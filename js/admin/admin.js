import { SUBJECTS, CATEGORIES } from "../data.js";
import { GH, toB64Str } from "./github.js";
import { seal, open } from "./crypto.js";
import { initTheme, toggleTheme } from "../theme.js";

const $ = (id) => document.getElementById(id);
const STORE = "ic_admin_v1";
const CONTENT_PATH = "data/content.json";
const IDLE_MS = 15 * 60 * 1000;
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let gh = null;          // بيتحفظ في الذاكرة بس (مش على الجهاز)
let state = { data: {}, sha: null };
let idleTimer, failCount = 0, lockedUntil = 0;

// ---------------- أدوات ----------------
function toast(msg, err = false) {
  const t = $("toast");
  t.textContent = msg; t.className = "toast show" + (err ? " err" : "");
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = "toast"), 3500);
}
const fmtSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB");
const fileToB64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result.split(",")[1]);
  r.onerror = () => rej(new Error("فشل قراءة الملف"));
  r.readAsDataURL(file);
});
// اسم ملف آمن (إنجليزي + رقم مميز) علشان أسماء واتساب والعربي بتبوّظ الروابط
function safeName(name) {
  const dot = name.lastIndexOf(".");
  const ext = (dot > -1 ? name.slice(dot) : "").toLowerCase().replace(/[^.a-z0-9]/g, "");
  const base = (dot > -1 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
  return `${base}-${Date.now().toString(36)}${ext}`;
}
const isYoutube = (u) => { try { const h = new URL(u).hostname; return /(^|\.)youtube\.com$|(^|\.)youtu\.be$|youtube-nocookie\.com$/.test(h); } catch { return false; } };

// ---------------- قفل / دخول ----------------
function showLock() {
  gh = null; clearTimeout(idleTimer);
  const has = !!localStorage.getItem(STORE);
  $("setup").hidden = has; $("unlock").hidden = !has;
  $("lock").hidden = false; $("dash").hidden = true; $("logoutBtn").hidden = true;
  ["unPass", "sToken", "sPass", "sPass2"].forEach((i) => ($(i).value = ""));
}
function bumpIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { toast("اتقفلت اللوحة لعدم النشاط"); showLock(); }, IDLE_MS);
}
async function enter(cfg) {
  gh = new GH(cfg);
  $("lock").hidden = true; $("dash").hidden = false; $("logoutBtn").hidden = false;
  $("repoChip").textContent = `${cfg.owner}/${cfg.repo}@${cfg.branch}`;
  bumpIdle();
  await loadContent();
  renderManage();
}
async function loadContent() {
  try { state = await gh.getJSON(CONTENT_PATH); }
  catch (e) { toast("تعذر تحميل المحتوى: " + e.message, true); }
}

$("setup").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("sMsg"); msg.textContent = "";
  if ($("sPass").value !== $("sPass2").value) { msg.textContent = "الباسورد مش متطابق"; return; }
  const cfg = { owner: $("sOwner").value.trim(), repo: $("sRepo").value.trim(), branch: $("sBranch").value.trim(), token: $("sToken").value.trim() };
  const btn = e.submitter; btn.disabled = true;
  try {
    await new GH(cfg).verify();
    localStorage.setItem(STORE, JSON.stringify(await seal($("sPass").value, cfg)));
    await enter(cfg);
  } catch (err) { msg.textContent = err.message; }
  btn.disabled = false;
});

$("unlock").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("unMsg");
  if (Date.now() < lockedUntil) { msg.textContent = `استنى ${Math.ceil((lockedUntil - Date.now()) / 1000)} ثانية وحاول تاني`; return; }
  try {
    const cfg = await open($("unPass").value, JSON.parse(localStorage.getItem(STORE)));
    failCount = 0; msg.textContent = "";
    await enter(cfg);
  } catch {
    failCount++; msg.textContent = "الباسورد غلط";
    if (failCount >= 5) { lockedUntil = Date.now() + 30000; failCount = 0; }
  }
});
$("resetBtn").onclick = () => {
  if (confirm("هيتمسح الـ Token والإعدادات من الجهاز ده، وهتحتاج تدخلهم تاني. متأكد؟")) { localStorage.removeItem(STORE); showLock(); }
};
$("logoutBtn").onclick = showLock;
$("themeBtn").onclick = toggleTheme;
["click", "keydown"].forEach((ev) => document.addEventListener(ev, () => gh && bumpIdle()));

// ---------------- حفظ بأمان (يعيد المحاولة لو حصل تعارض) ----------------
async function mutate(fn, message) {
  for (let i = 0; i < 3; i++) {
    const cur = await gh.getJSON(CONTENT_PATH);
    fn(cur.data);
    try {
      const sha = await gh.putJSON(CONTENT_PATH, cur.data, cur.sha, message);
      state = { data: cur.data, sha };
      return;
    } catch (e) { if (e.status !== 409 && e.status !== 422) throw e; }
  }
  throw new Error("حصل تعارض في الحفظ، حاول تاني");
}

// ---------------- رفع ----------------
const subjOpts = SUBJECTS.map((s) => `<option value="${s.id}">${esc(s.title)}</option>`).join("");
$("upSubject").innerHTML = subjOpts;
$("mgSubject").innerHTML = subjOpts;
$("upCat").innerHTML = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");
$("upDate").value = new Date().toISOString().slice(0, 10);

document.querySelectorAll("[name=mode]").forEach((r) => r.addEventListener("change", () => {
  const video = document.querySelector("[name=mode]:checked").value === "video";
  $("fileBox").hidden = video; $("videoBox").hidden = !video;
  if (video) $("upCat").value = "video";
}));
$("upFiles").addEventListener("change", () => {
  const n = $("upFiles").files.length;
  $("fileInfo").textContent = n ? `${n} ملف مختار` : "PDF أو صور (JPG / PNG / WEBP) - تقدر تختار أكتر من ملف";
});
["dragover", "dragleave", "drop"].forEach((ev) => $("drop").addEventListener(ev, (e) => {
  e.preventDefault();
  $("drop").classList.toggle("over", ev === "dragover");
  if (ev === "drop") { $("upFiles").files = e.dataTransfer.files; $("upFiles").dispatchEvent(new Event("change")); }
}));

function log(text, cls = "") {
  const li = document.createElement("li"); li.className = cls; li.textContent = text;
  $("log").appendChild(li); return li;
}

$("upForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("log").innerHTML = "";
  const subject = $("upSubject").value, cat = $("upCat").value, date = $("upDate").value || new Date().toISOString().slice(0, 10);
  const titleAr = $("upTitle").value.trim(), titleEn = $("upTitleEn").value.trim();
  const video = document.querySelector("[name=mode]:checked").value === "video";
  const items = [];
  $("upBtn").disabled = true;
  try {
    if (video) {
      const url = $("upUrl").value.trim();
      if (!isYoutube(url)) throw new Error("الرابط لازم يكون رابط يوتيوب صحيح");
      if (!titleAr) throw new Error("اكتب عنوان الفيديو");
      items.push({ cat, title: titleAr, ...(titleEn && { titleEn }), type: "video", url, date });
    } else {
      const files = [...$("upFiles").files];
      if (!files.length) throw new Error("اختار ملف واحد على الأقل");
      for (const f of files) {
        const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
        if (!isPdf && !f.type.startsWith("image/")) throw new Error(`"${f.name}" نوعه مش مدعوم (PDF أو صور بس)`);
        if (f.size > 50 * 1048576) throw new Error(`"${f.name}" أكبر من 50 ميجا`);
      }
      for (const [i, f] of files.entries()) {
        const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
        const li = log(`جاري رفع ${f.name} (${fmtSize(f.size)})...`);
        const path = `files/${subject}/${safeName(f.name)}`;
        await gh.put(path, await fileToB64(f), `Add ${path}`);
        li.textContent = `✔ اترفع: ${f.name}`; li.className = "ok";
        const n = files.length > 1 ? ` (${i + 1})` : "";
        const base = titleAr || f.name.replace(/\.[^.]+$/, "");
        items.push({ cat, title: base + (titleAr ? n : ""), ...(titleEn && { titleEn: titleEn + n }), type: isPdf ? "pdf" : "image", url: path, date, size: fmtSize(f.size) });
      }
    }
    const li = log("جاري تحديث قائمة المحتوى...");
    await mutate((data) => {
      const arr = (data[subject] ||= []);
      $("upTop").checked ? arr.unshift(...items) : arr.push(...items);
    }, `Add ${items.length} item(s) to ${subject}`);
    li.textContent = "✔ تم النشر! هيظهر على الموقع بعد حوالي 1-2 دقيقة."; li.className = "ok";
    toast("تم الرفع بنجاح ✅");
    $("upForm").reset(); $("upDate").value = date; $("fileInfo").textContent = "PDF أو صور (JPG / PNG / WEBP) - تقدر تختار أكتر من ملف";
    $("fileBox").hidden = false; $("videoBox").hidden = true;
    $("mgSubject").value = subject; renderManage();
  } catch (err) {
    log("✖ " + err.message, "err"); toast(err.message, true);
  }
  $("upBtn").disabled = false;
});

// ---------------- إدارة المحتوى ----------------
const typeIcon = { pdf: "fa-file-pdf", image: "fa-image", video: "fa-circle-play" };

function renderManage() {
  const sid = $("mgSubject").value;
  const items = state.data[sid] || [];
  if (!items.length) { $("mgList").innerHTML = '<p class="hint">مفيش محتوى للمادة دي لسه.</p>'; return; }
  $("mgList").innerHTML = CATEGORIES.map((c) => {
    const rows = items.map((f, i) => ({ f, i })).filter((x) => x.f.cat === c.id);
    if (!rows.length) return "";
    return `<div><h3><i class="fa-solid ${c.icon}"></i> ${c.label} (${rows.length})</h3>` + rows.map(({ f, i }, k) => `
      <div class="mrow">
        <i class="fa-solid ${typeIcon[f.type] || "fa-file"}"></i>
        <div class="t">${esc(f.title)}<small>${esc(f.titleEn || "")} ${f.date ? "• " + esc(f.date) : ""}</small></div>
        <button data-act="up" data-i="${i}" title="لفوق" ${k === 0 ? "disabled" : ""}><i class="fa-solid fa-arrow-up"></i></button>
        <button data-act="down" data-i="${i}" title="لتحت" ${k === rows.length - 1 ? "disabled" : ""}><i class="fa-solid fa-arrow-down"></i></button>
        <button data-act="edit" data-i="${i}" title="تعديل العنوان"><i class="fa-solid fa-pen"></i></button>
        <button data-act="del" data-i="${i}" class="danger" title="حذف"><i class="fa-solid fa-trash"></i></button>
      </div>`).join("") + "</div>";
  }).join("");
}
$("mgSubject").addEventListener("change", renderManage);

$("mgList").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn || btn.disabled) return;
  const sid = $("mgSubject").value, i = +btn.dataset.i, act = btn.dataset.act;
  const item = (state.data[sid] || [])[i];
  if (!item) return;
  btn.disabled = true;
  try {
    if (act === "up" || act === "down") {
      await mutate((data) => {
        const arr = data[sid], dir = act === "up" ? -1 : 1;
        let j = i + dir;
        while (arr[j] && arr[j].cat !== item.cat) j += dir;
        if (arr[j]) [arr[i], arr[j]] = [arr[j], arr[i]];
      }, `Reorder in ${sid}`);
    } else if (act === "edit") {
      const ar = prompt("العنوان بالعربي:", item.title); if (ar === null) { btn.disabled = false; return; }
      const en = prompt("العنوان بالإنجليزي (اتركه فاضي لو مش عايز):", item.titleEn || "") ?? "";
      await mutate((data) => {
        const t = data[sid][i]; t.title = ar.trim() || t.title;
        en.trim() ? (t.titleEn = en.trim()) : delete t.titleEn;
      }, `Edit title in ${sid}`);
    } else if (act === "del") {
      if (!confirm(`حذف "${item.title}"؟ الملف نفسه هيتمسح من الموقع.`)) { btn.disabled = false; return; }
      await mutate((data) => { data[sid].splice(i, 1); if (!data[sid].length) delete data[sid]; }, `Remove item from ${sid}`);
      const stillUsed = Object.values(state.data).flat().some((f) => f.url === item.url);
      if (item.url?.startsWith("files/") && !stillUsed) {
        const f = await gh.getFile(item.url);
        if (f) await gh.del(item.url, f.sha, `Delete ${item.url}`);
      }
    }
    toast("تم الحفظ ✅");
  } catch (err) { toast(err.message, true); await loadContent(); }
  renderManage();
});

// ---------------- بدء التشغيل ----------------
initTheme();
if (!window.crypto?.subtle) {
  $("lock").innerHTML = '<p class="msg">المتصفح ده مش بيدعم التشفير. افتح اللوحة من رابط https أو localhost.</p>';
} else showLock();
