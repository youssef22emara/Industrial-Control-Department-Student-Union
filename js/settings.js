// يربط زراير (اللغة / الوضع الليلي) بالصفحة
import { applyLang, toggleLang } from "./i18n.js";
import { initTheme, toggleTheme } from "./theme.js";

export function initSettings(rerender) {
  const refresh = () => { applyLang(); rerender(); };
  initTheme();
  document.getElementById("themeBtn").onclick = toggleTheme;
  document.getElementById("langBtn").onclick = () => { toggleLang(); refresh(); };
  refresh();
}

// ===== قائمة الموبايل + فتح/قفل البحث =====
const $ = (id) => document.getElementById(id);
const nav = document.querySelector(".nav");
const menuBtn = $("menuBtn");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
}
menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 700) setMenu(false); });

const box = $("searchBox"), input = $("q");
if (box) {
  $("searchBtn").addEventListener("click", () => { box.classList.add("open"); input.focus(); });
  input.addEventListener("blur", () => { if (!input.value) box.classList.remove("open"); });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    input.value = ""; input.dispatchEvent(new Event("input"));
    box.classList.remove("open"); input.blur();
  });
}
