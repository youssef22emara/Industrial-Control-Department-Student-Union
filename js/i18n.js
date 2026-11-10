// الترجمة: عربي / English
const DICT = {
  ar: {
    university: "جامعة حلوان التكنولوجية الدولية", search: "ابحث عن مادة...", noResults: "مفيش نتائج مطابقة",
    allSubjects: "كل المواد", file: "ملف", files: "ملف", open: "فتح المادة", view: "عرض", isNew: "جديد",
    noFiles: "لسه مفيش ملفات هنا.. هتتضاف قريب إن شاء الله", notFound: "المادة غير موجودة", back: "رجوع",
    menu: "القائمة", pages: "صفحة", noVideos: "لسه مفيش فيديوهات شرح هنا.. هتتضاف قريب إن شاء الله", badVideo: "رابط الفيديو غير صالح", download: "تحميل", openLink: "فتح الرابط", play: "تشغيل الفيديو", imgWord: "صورة", langBtn: "EN", langTitle: "Switch to English", themeTitle: "تبديل الوضع الليلي", close: "إغلاق", teacher: "الأستاذ/ة",
  },
  en: {
    university: "Helwan International Technological University", search: "Search subjects...", noResults: "No matching results",
    allSubjects: "All subjects", file: "file", files: "files", open: "Open subject", view: "View", isNew: "New",
    noFiles: "No files here yet.. coming soon", notFound: "Subject not found", back: "Back",
    menu: "Menu", pages: "pages", noVideos: "No explanation videos yet.. coming soon", badVideo: "Invalid video link", download: "Download", openLink: "Open link", play: "Play video", imgWord: "Image", langBtn: "عربي", langTitle: "التبديل إلى العربية", themeTitle: "Toggle dark mode", close: "Close", teacher: "Instructor",
  },
};

let lang = "ar";
try { lang = localStorage.getItem("lang") || "ar"; } catch (e) {}

export const getLang = () => lang;
export const isRtl = () => lang === "ar";
export const t = (k) => DICT[lang][k] ?? k;
// يرجع الحقل بالإنجليزي لو موجود (مثال: pick(s, "teacher") -> teacherEn)
export const pick = (o, k) => (lang === "en" && o[k + "En"]) || o[k];

export function applyLang() {
  const h = document.documentElement;
  h.lang = lang;
  h.dir = isRtl() ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute("aria-label", el.title);
  });
}

export function toggleLang() {
  lang = lang === "ar" ? "en" : "ar";
  try { localStorage.setItem("lang", lang); } catch (e) {}
}
