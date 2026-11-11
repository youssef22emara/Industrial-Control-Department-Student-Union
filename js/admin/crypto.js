// تشفير التوكن على جهازك بباسورد (AES-GCM + PBKDF2). التوكن مش بيتخزن كنص عادي أبداً.
const enc = new TextEncoder();
const dec = new TextDecoder();
const toB64 = (u8) => btoa(String.fromCharCode(...u8));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(pass, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function seal(pass, obj) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pass, salt);
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(obj)));
  return { salt: toB64(salt), iv: toB64(iv), data: toB64(new Uint8Array(data)) };
}

// بيرمي خطأ لو الباسورد غلط
export async function open(pass, box) {
  const key = await deriveKey(pass, fromB64(box.salt));
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(box.iv) }, key, fromB64(box.data));
  return JSON.parse(dec.decode(plain));
}
