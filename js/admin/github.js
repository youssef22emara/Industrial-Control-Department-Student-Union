// التواصل مع GitHub API (الحماية الحقيقية هنا: الكتابة مستحيلة من غير التوكن)
const API = "https://api.github.com";

export const toB64Str = (str) => {
  const b = new TextEncoder().encode(str);
  let s = "";
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};
const fromB64Str = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, "")), (c) => c.charCodeAt(0)));

export class GH {
  constructor(cfg) { Object.assign(this, cfg); } // owner, repo, branch, token

  get repoUrl() { return `${API}/repos/${this.owner}/${this.repo}`; }
  url(path) { return `${this.repoUrl}/contents/${path.split("/").map(encodeURIComponent).join("/")}`; }

  async call(url, opt = {}) {
    const r = await fetch(url, {
      cache: "no-store", ...opt,
      headers: { Authorization: `Bearer ${this.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    });
    if (r.status === 404) return { status: 404 };
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.message || `HTTP ${r.status}`); e.status = r.status; throw e; }
    return j;
  }

  async verify() {
    const j = await this.call(this.repoUrl);
    if (j.status === 404) throw new Error("الريبو مش موجود، أو التوكن مش مديله صلاحية عليه.");
    if (j.permissions && !j.permissions.push) throw new Error("التوكن ملوش صلاحية الكتابة (لازم Contents: Read and write).");
    const b = await this.call(`${this.repoUrl}/branches/${encodeURIComponent(this.branch)}`);
    if (b.status === 404) throw new Error(`الفرع "${this.branch}" مش موجود.`);
  }

  async getFile(path) {
    const j = await this.call(`${this.url(path)}?ref=${encodeURIComponent(this.branch)}`);
    return j.status === 404 ? null : j;
  }
  put(path, contentB64, message, sha) {
    return this.call(this.url(path), { method: "PUT", body: JSON.stringify({ message, content: contentB64, branch: this.branch, ...(sha ? { sha } : {}) }) });
  }
  del(path, sha, message) {
    return this.call(this.url(path), { method: "DELETE", body: JSON.stringify({ message, sha, branch: this.branch }) });
  }
  async getJSON(path) {
    const f = await this.getFile(path);
    return f ? { data: JSON.parse(fromB64Str(f.content)), sha: f.sha } : { data: {}, sha: null };
  }
  async putJSON(path, data, sha, message) {
    const r = await this.put(path, toB64Str(JSON.stringify(data, null, 2)), message, sha);
    return r.content.sha;
  }
}
