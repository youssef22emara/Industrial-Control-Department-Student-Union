import { SITE, SUBJECTS, CATEGORIES } from "./data.js";
import { t, pick, getLang, isRtl } from "./i18n.js";
import { initSettings } from "./settings.js";

const $ = (id) => document.getElementById(id);
const subject = SUBJECTS.find((s) => s.id === new URLSearchParams(location.search).get("id"));

// أول تاب فيه محتوى يتفتح تلقائياً
let active = subject
  ? (CATEGORIES.find((c) => subject.content.some((f) => f.cat === c.id)) || CATEGORIES[0]).id
  : CATEGORIES[0].id;
let gallery = [];
let current = 0;

if (subject) {
  const r = document.documentElement.style;
  r.setProperty("--c1", subject.c1);
  r.setProperty("--c2", subject.c2);
  $("shIcon").classList.add(subject.icon);
}

const isNew = (d) => d && (Date.now() - new Date(d)) / 864e5 <= 7;
const fmt = (d) => d ? new Date(d).toLocaleDateString(getLang() === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// يحوّل أي رابط يوتيوب (فيديو / short / playlist) لرابط iframe
function youtube(url) {
  try {
    const u = new URL(url);
    const list = u.searchParams.get("list");
    let id = null;
    if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
    else if (/^\/(shorts|embed|live)\//.test(u.pathname)) id = u.pathname.split("/")[2];
    else id = u.searchParams.get("v");
    const base = "https://www.youtube-nocookie.com/embed/";
    if (id) return { src: `${base}${id}?autoplay=1&rel=0${list ? `&list=${list}` : ""}`, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
    if (list) return { src: `${base}videoseries?list=${list}&autoplay=1`, thumb: null };
  } catch (e) {}
  return null;
}

const chips = (arr) => `<div class="chips">${arr.filter(Boolean).map((c) => `<span dir="auto">${c}</span>`).join("")}</div>`;

function card(f) {
  const name = esc(pick(f, "title"));
  const badge = isNew(f.date) ? `<span class="new">${t("isNew")}</span>` : "";

  if (f.type === "video") {
    const yt = youtube(f.url);
    if (!yt) return `<div class="file"><div class="ftile"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <div class="info"><b>${name}</b>${chips([t("badVideo")])}</div></div>`;
    return `<div class="video">
      <button class="vthumb" data-src="${yt.src}" data-title="${name}" style="${yt.thumb ? `background-image:url('${yt.thumb}')` : ""}" aria-label="${t("play")}">
        <span class="play"><i class="fa-solid fa-play"></i></span>
      </button>
      <div class="vinfo"><b>${name} ${badge}</b>${chips([fmt(f.date)])}</div>
    </div>`;
  }
  if (f.type === "image") {
    return `<div class="file img" data-i="${gallery.indexOf(f)}">
      <div class="imgbox"><img loading="lazy" src="${f.url}" alt="${name}"><span class="zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></span></div>
      <div class="vinfo"><b>${name} ${badge}</b>${chips([fmt(f.date), f.size && `<bdi dir="ltr">${f.size}</bdi>`])}</div>
    </div>`;
  }
  return `<div class="file">
    <div class="ftile"><i class="fa-solid fa-file-pdf"></i></div>
    <div class="info"><b>${name} ${badge}</b>${chips(["PDF", f.pages ? `${f.pages} ${t("pages")}` : "", f.size && `<bdi dir="ltr">${f.size}</bdi>`, fmt(f.date)])}</div>
    <div class="acts">
      <a class="btn sm" href="${f.url}" target="_blank" rel="noopener"><i class="fa-solid fa-eye"></i> <span>${t("view")}</span></a>
      <a class="btn sm alt" href="${f.url}" download title="${t("download")}"><i class="fa-solid fa-download"></i></a>
    </div>
  </div>`;
}

function render() {
  $("siteName").textContent = pick(SITE, "name");
  if (!subject) {
    $("title").textContent = t("notFound");
    $("meta").innerHTML = `<a href="index.html">${t("back")}</a>`;
    $("tabs").innerHTML = ""; $("list").innerHTML = "";
    return;
  }
  document.title = subject.title;
  $("title").textContent = subject.title;
  $("meta").textContent = `${t("teacher")}: ${pick(subject, "teacher")} • ${pick(subject, "program")}`;
  const total = subject.content.length;
  $("stats").innerHTML = `<span><i class="fa-regular fa-folder-open"></i> ${total} ${t(total === 1 ? "file" : "files")}</span>`;

  $("tabs").innerHTML = CATEGORIES.map((c) => {
    const n = subject.content.filter((f) => f.cat === c.id).length;
    return `<button class="tab ${c.id === active ? "on" : ""} ${n ? "" : "zero"}" data-id="${c.id}">
      <i class="fa-solid ${c.icon}"></i> ${pick(c, "label")} <small>${n}</small></button>`;
  }).join("");

  const items = subject.content.filter((f) => f.cat === active); // الترتيب = ترتيب data.js
  gallery = items.filter((f) => f.type === "image");
  const list = $("list");
  list.classList.toggle("videos", active === "video");

  if (!items.length) {
    list.innerHTML = `<p class="empty"><i class="fa-regular fa-folder-open"></i>${t(active === "video" ? "noVideos" : "noFiles")}</p>`;
    return;
  }
  list.innerHTML = items.map(card).join("");
}

// ----- تشغيل الفيديو (iframe بيتحمّل عند الضغط بس لسرعة الصفحة) -----
$("list").addEventListener("click", (e) => {
  const th = e.target.closest(".vthumb");
  if (th) {
    const f = document.createElement("iframe");
    f.src = th.dataset.src; f.title = th.dataset.title; f.allowFullscreen = true;
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.referrerPolicy = "strict-origin-when-cross-origin";
    th.replaceWith(f);
    return;
  }
  const el = e.target.closest(".img");
  if (!el) return;
  show(+el.dataset.i);
  $("lightbox").showModal();
});

// ----- Lightbox -----
function show(i) {
  current = (i + gallery.length) % gallery.length;
  $("lbImg").src = gallery[current].url;
}
const step = (side) => (side === "right") === isRtl() ? -1 : 1;

$("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  active = tab.dataset.id;
  render();
});
$("lbClose").onclick = () => $("lightbox").close();
$("lbR").onclick = () => show(current + step("right"));
$("lbL").onclick = () => show(current + step("left"));
$("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") e.target.close(); });
document.addEventListener("keydown", (e) => {
  if (!$("lightbox").open) return;
  if (e.key === "ArrowRight") show(current + step("right"));
  if (e.key === "ArrowLeft") show(current + step("left"));
});

initSettings(render);
