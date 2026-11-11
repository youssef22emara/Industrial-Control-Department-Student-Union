// ===== كل بيانات الموقع هنا. لإضافة ملف جديد عدّل هذا الملف فقط =====

export const SITE = {
  name: "اتحاد طلاب قسم التحكم الصناعي",
  nameEn: "Industrial Control Students Union",
  tagline: "كل الملخصات والمحاضرات والسكاشن في مكان واحد.. ومجاناً",
  taglineEn: "All summaries, lectures and sections in one place.. for free",
  term: "الفرقة الأولى - الترم الأول",
  termEn: "First Year - First Semester",
};

export const CATEGORIES = [
  { id: "lecture", label: "المحاضرات", labelEn: "Lectures", icon: "fa-chalkboard-user" },
  { id: "section", label: "السكاشن والشيتات", labelEn: "Sections & Sheets", icon: "fa-pen-ruler" },
  { id: "summary", label: "الملخصات", labelEn: "Summaries", icon: "fa-file-lines" },
  { id: "video",   label: "فيديوهات الشرح", labelEn: "Video Explanations", icon: "fa-circle-play" },
  { id: "book",    label: "كتب ومراجع", labelEn: "Books & References", icon: "fa-book" },
  { id: "exam",    label: "امتحانات سابقة", labelEn: "Past Exams", icon: "fa-circle-question" },
];

/*
  شكل الملف الواحد (بيتخزن في data/content.json وبتضيفه من لوحة التحكم admin.html، والترتيب = ترتيب السطور):

  ملف PDF / صورة:
  { cat: "lecture", title: "المحاضرة 1", titleEn: "Lecture 1", type: "pdf" | "image", url: "files/physics/lec1.pdf", date: "2026-11-10", pages: 12, size: "1.2 MB" }

  فيديو يوتيوب (الصق رابط الفيديو أو الـ Playlist كما هو وهيظهر جوه الموقع):
  { cat: "video", title: "شرح المحاضرة 1", titleEn: "Lecture 1 Explained", type: "video", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", date: "2026-11-10" }

  - cat: lecture | section | summary | video | book | exam
  - titleEn / pages / size / date: اختياريين
*/
const SUBJECTS_META = [
  { id: "physics", icon: "fa-atom", c1: "#6a11cb", c2: "#2575fc", title: "Physics", teacher: "طه مرغني حسانين", teacherEn: "Taha Marghany Hassanein", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
  { id: "technical-drawing", icon: "fa-compass-drafting", c1: "#f2711c", c2: "#fbb034", title: "Technical Drawing", teacher: "محمد عثمان", teacherEn: "Mohamed Othman", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
  { id: "italian", icon: "fa-language", c1: "#0f9b8e", c2: "#43c59e", title: "Italian", teacher: "وفاء عبد الرؤوف البيه", teacherEn: "Wafaa Abdel Raouf El-Beih", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
  { id: "electrical-motors", icon: "fa-bolt", c1: "#cb2d3e", c2: "#ef6a3a", title: "Principal and operation of three phase electrical motors", teacher: "حسام حجازي", teacherEn: "Hossam Hegazy", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
  { id: "math1", icon: "fa-square-root-variable", c1: "#1e3c72", c2: "#2a7bd5", title: "Mathematics 1", teacher: "ابراهيم عيد", teacherEn: "Ibrahim Eid", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
  { id: "electronics", icon: "fa-microchip", c1: "#8e2de2", c2: "#4a00e0", title: "Principal of Electronics", teacher: "جولينا سمير", teacherEn: "Giulina Samir", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program"},
];

// المحتوى (الملفات والفيديوهات) بيتحمّل من data/content.json
let CONTENT = {};
try {
  const r = await fetch("data/content.json", { cache: "no-cache" });
  if (r.ok) CONTENT = await r.json();
} catch (e) {}

export const SUBJECTS = SUBJECTS_META.map((s) => ({ ...s, content: CONTENT[s.id] || [] }));
