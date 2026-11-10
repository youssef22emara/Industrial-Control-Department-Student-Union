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
  شكل الملف الواحد داخل content (الترتيب في الصفحة = ترتيب السطور هنا):

  ملف PDF / صورة:
  { cat: "lecture", title: "المحاضرة 1", titleEn: "Lecture 1", type: "pdf" | "image", url: "files/physics/lec1.pdf", date: "2026-11-10", pages: 12, size: "1.2 MB" }

  فيديو يوتيوب (الصق رابط الفيديو أو الـ Playlist كما هو وهيظهر جوه الموقع):
  { cat: "video", title: "شرح المحاضرة 1", titleEn: "Lecture 1 Explained", type: "video", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", date: "2026-11-10" }

  - cat: lecture | section | summary | video | book | exam
  - titleEn / pages / size / date: اختياريين
*/
export const SUBJECTS = [
  { id: "physics", icon: "fa-atom", c1: "#6a11cb", c2: "#2575fc", title: "Physics", teacher: "طه مرغني حسانين", teacherEn: "Taha Marghany Hassanein", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: [
    { cat: "lecture", title: "المحاضرة 1: الوحدات والقياسات", titleEn: "Lecture 1: Units and Measurements", type: "pdf", url: "files/physics/lec1-units-and-measurements.pdf", date: "2026-11-10", pages: 11, size: "1.9 MB" },
    { cat: "summary", title: "جداول الفيزياء: الأنظمة والوحدات والأبعاد", titleEn: "Physics Tables: Systems of Units & Dimensions", type: "pdf", url: "files/physics/units-tables.pdf", date: "2026-11-10", pages: 2, size: "128 KB" },
    { cat: "section", title: "شيت الباب الأول - الأسئلة", titleEn: "Chapter 1 Sheet - Questions", type: "pdf", url: "files/physics/sheet1-questions.pdf", date: "2026-11-10", pages: 2, size: "109 KB" },
    { cat: "section", title: "شيت الباب الأول - مع الحل", titleEn: "Chapter 1 Sheet - With Solutions", type: "pdf", url: "files/physics/sheet1-solutions.pdf", date: "2026-11-10", pages: 2, size: "131 KB" },
  ]},
  { id: "technical-drawing", icon: "fa-compass-drafting", c1: "#f2711c", c2: "#fbb034", title: "Technical Drawing", teacher: "محمد عثمان", teacherEn: "Mohamed Othman", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: []},
  { id: "italian", icon: "fa-language", c1: "#0f9b8e", c2: "#43c59e", title: "Italian", teacher: "وفاء عبد الرؤوف البيه", teacherEn: "Wafaa Abdel Raouf El-Beih", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: [
    { cat: "summary", title: "دليل الحروف الإيطالية والنطق بالعربي", titleEn: "Italian Alphabet & Pronunciation Guide", type: "pdf", url: "files/italian/alphabet-guide.pdf", date: "2026-11-10", pages: 2, size: "32 KB" },
    { cat: "book", title: "كتاب الإيطالي - الفرقة الأولى", titleEn: "Italian Textbook - First Year", type: "pdf", url: "files/italian/textbook-year1.pdf", date: "2026-11-10", pages: 78, size: "11.2 MB" },
  ]},
  { id: "electrical-motors", icon: "fa-bolt", c1: "#cb2d3e", c2: "#ef6a3a", title: "Principal and operation of three phase electrical motors", teacher: "حسام حجازي", teacherEn: "Hossam Hegazy", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: [
    { cat: "lecture", title: "المحاضرة 1: تعريف وتركيب وأنواع المحرك الحثي ثلاثي الأوجه", titleEn: "Lecture 1: Definition, Construction & Types of 3-Phase Induction Motor", type: "pdf", url: "files/electrical-motors/lec1-induction-motor.pdf", date: "2026-11-10", pages: 10, size: "506 KB" },
  ]},
  { id: "math1", icon: "fa-square-root-variable", c1: "#1e3c72", c2: "#2a7bd5", title: "Mathematics 1", teacher: "ابراهيم عيد", teacherEn: "Ibrahim Eid", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: [
    { cat: "lecture", title: "الباب الأول: توصيف المادة والجبر", titleEn: "Chapter 1: Syllabus & Algebra", type: "pdf", url: "files/math1/ch01-syllabus-algebra.pdf", date: "2026-11-10", pages: 16, size: "1.3 MB" },
    { cat: "lecture", title: "الباب الثاني: المعادلات", titleEn: "Chapter 2: Equations", type: "pdf", url: "files/math1/ch02-equations.pdf", date: "2026-11-10", pages: 10, size: "778 KB" },
    { cat: "section", title: "شيت 1", titleEn: "Sheet 1", type: "pdf", url: "files/math1/sheet-01.pdf", date: "2026-11-10", pages: 2, size: "236 KB" },
    { cat: "section", title: "شيت 2", titleEn: "Sheet 2", type: "pdf", url: "files/math1/sheet-02.pdf", date: "2026-11-10", pages: 2, size: "259 KB" },
  ]},
  { id: "electronics", icon: "fa-microchip", c1: "#8e2de2", c2: "#4a00e0", title: "Principal of Electronics", teacher: "جولينا سمير", teacherEn: "Giulina Samir", program: "برنامج قسم التحكم (IC)", programEn: "Industrial Control (IC) Program", content: [
    { cat: "summary", title: "ملخص الدوائر الثنائية (الدايود)", titleEn: "Diode Circuits Summary", type: "pdf", url: "files/electronics/diode-circuits-summary.pdf", date: "2026-11-10", pages: 4, size: "63 KB" },
    { cat: "section", title: "Diode Applications: حل الأمثلة", titleEn: "Diode Applications: Solved Examples", type: "pdf", url: "files/electronics/diode-applications-solved.pdf", date: "2026-11-10", pages: 6, size: "3.2 MB" },
    { cat: "section", title: "حل أمثلة الدايود بخط اليد (1)", titleEn: "Handwritten Diode Solutions (1)", type: "image", url: "files/electronics/hand-solution-1.jpg", date: "2026-10-31", size: "103 KB" },
    { cat: "section", title: "حل أمثلة الدايود بخط اليد (2)", titleEn: "Handwritten Diode Solutions (2)", type: "image", url: "files/electronics/hand-solution-2.jpg", date: "2026-11-01", size: "68 KB" },
    { cat: "section", title: "حل أمثلة الدايود بخط اليد (3)", titleEn: "Handwritten Diode Solutions (3)", type: "image", url: "files/electronics/hand-solution-3.jpg", date: "2026-11-01", size: "83 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (1)", titleEn: "Lecture Board (1)", type: "image", url: "files/electronics/board-1.jpg", date: "2026-11-01", size: "212 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (2)", titleEn: "Lecture Board (2)", type: "image", url: "files/electronics/board-2.jpg", date: "2026-11-08", size: "123 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (3)", titleEn: "Lecture Board (3)", type: "image", url: "files/electronics/board-3.jpg", date: "2026-11-08", size: "141 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (4)", titleEn: "Lecture Board (4)", type: "image", url: "files/electronics/board-4.jpg", date: "2026-11-08", size: "112 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (5)", titleEn: "Lecture Board (5)", type: "image", url: "files/electronics/board-5.jpg", date: "2026-11-08", size: "96 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (6)", titleEn: "Lecture Board (6)", type: "image", url: "files/electronics/board-6.jpg", date: "2026-11-08", size: "113 KB" },
    { cat: "lecture", title: "سبورة المحاضرة (7)", titleEn: "Lecture Board (7)", type: "image", url: "files/electronics/board-7.jpg", date: "2026-11-08", size: "142 KB" },
  ]},
];
