import { SITE, SUBJECTS } from "./data.js";
import { t, pick } from "./i18n.js";
import { initSettings } from "./settings.js";

const $ = (id) => document.getElementById(id);
let query = "";

function render() {
  $("siteName").textContent = pick(SITE, "name");
  $("tagline").textContent = pick(SITE, "tagline");
  $("term").textContent = pick(SITE, "term");
  document.title = pick(SITE, "name");

  const v = query.toLowerCase();
  const list = SUBJECTS.filter((s) => `${s.title} ${s.teacher} ${s.teacherEn || ""}`.toLowerCase().includes(v));

  $("grid").innerHTML = list.map((s) => `
    <a class="card" href="subject.html?id=${s.id}" style="--c1:${s.c1};--c2:${s.c2}">
      <div class="banner">
        <i class="fa-solid ${s.icon} watermark"></i>
        <span class="badge">IC</span>
        <div class="ico"><i class="fa-solid ${s.icon}"></i></div>
      </div>
      <div class="body">
        <h2 dir="ltr">${s.title}</h2>
        <div class="row"><i class="fa-solid fa-user-tie"></i> ${pick(s, "teacher")}</div>
        <div class="row muted"><i class="fa-solid fa-graduation-cap"></i> ${pick(s, "program")}</div>
      </div>
      <div class="foot">
        <span class="count"><i class="fa-regular fa-folder-open"></i> ${s.content.length} ${t(s.content.length === 1 ? "file" : "files")}</span>
        <span class="go">${t("open")} <i class="fa-solid fa-arrow-left flip"></i></span>
      </div>
    </a>`).join("");
  $("empty").hidden = list.length > 0;
}

$("q").addEventListener("input", (e) => { query = e.target.value.trim(); render(); });
initSettings(render);
