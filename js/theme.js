// الوضع الليلي
const root = document.documentElement;

export function initTheme() { updateIcon(); }

export function toggleTheme() {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  updateIcon();
}

function updateIcon() {
  const btn = document.getElementById("themeBtn");
  if (btn) btn.innerHTML = `<i class="fa-solid ${root.dataset.theme === "dark" ? "fa-sun" : "fa-moon"}"></i>`;
}
