"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Languages ────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", name: "English",    flag: "🇬🇧", nativeName: "English" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
  { code: "es", name: "Spanish",    flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French",     flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German",     flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  { code: "it", name: "Italian",    flag: "🇮🇹", nativeName: "Italiano" },
  { code: "nl", name: "Dutch",      flag: "🇳🇱", nativeName: "Nederlands" },
  { code: "ru", name: "Russian",    flag: "🇷🇺", nativeName: "Русский" },
  { code: "zh", name: "Chinese",    flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", name: "Japanese",   flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Korean",     flag: "🇰🇷", nativeName: "한국어" },
  { code: "ar", name: "Arabic",     flag: "🇸🇦", nativeName: "العربية" },
  { code: "hi", name: "Hindi",      flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "tr", name: "Turkish",    flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "pl", name: "Polish",     flag: "🇵🇱", nativeName: "Polski" },
  { code: "sv", name: "Swedish",    flag: "🇸🇪", nativeName: "Svenska" },
  { code: "no", name: "Norwegian",  flag: "🇳🇴", nativeName: "Norsk" },
  { code: "da", name: "Danish",     flag: "🇩🇰", nativeName: "Dansk" },
  { code: "fi", name: "Finnish",    flag: "🇫🇮", nativeName: "Suomi" },
  { code: "th", name: "Thai",       flag: "🇹🇭", nativeName: "ภาษาไทย" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", nativeName: "Tiếng Việt" },
  { code: "ms", name: "Malay",      flag: "🇲🇾", nativeName: "Bahasa Melayu" },
  { code: "tl", name: "Filipino",   flag: "🇵🇭", nativeName: "Filipino" },
  { code: "uk", name: "Ukrainian",  flag: "🇺🇦", nativeName: "Українська" },
  { code: "ro", name: "Romanian",   flag: "🇷🇴", nativeName: "Română" },
  { code: "hu", name: "Hungarian",  flag: "🇭🇺", nativeName: "Magyar" },
  { code: "cs", name: "Czech",      flag: "🇨🇿", nativeName: "Čeština" },
  { code: "el", name: "Greek",      flag: "🇬🇷", nativeName: "Ελληνικά" },
  { code: "he", name: "Hebrew",     flag: "🇮🇱", nativeName: "עברית" },
  { code: "sw", name: "Swahili",    flag: "🇰🇪", nativeName: "Kiswahili" },
  { code: "fa", name: "Persian",    flag: "🇮🇷", nativeName: "فارسی" },
  { code: "bn", name: "Bengali",    flag: "🇧🇩", nativeName: "বাংলা" },
  { code: "ur", name: "Urdu",       flag: "🇵🇰", nativeName: "اردو" },
];

// ─── XP Level system ──────────────────────────────────────────────────────────
const LEVELS = [
  { min: 0,    max: 99,   label: "Seedling",    icon: "🌱", color: "#86efac" },
  { min: 100,  max: 299,  label: "Explorer",    icon: "⭐", color: "#fde68a" },
  { min: 300,  max: 599,  label: "Scholar",     icon: "🔥", color: "#fb923c" },
  { min: 600,  max: 999,  label: "Mastermind",  icon: "💎", color: "#a5b4fc" },
  { min: 1000, max: 1999, label: "Champion",    icon: "👑", color: "#f9a8d4" },
  { min: 2000, max: Infinity, label: "Legend",  icon: "🏆", color: "#FFD700" },
];
const getLevel = (xp) => LEVELS.find((l) => xp >= l.min && xp <= l.max) || LEVELS[0];

// ─── Difficulty levels ────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { id: "kids",         label: "Kids",         emoji: "🧒", desc: "Ages 6–11 · Very simple, story-based" },
  { id: "beginner",     label: "Beginner",     emoji: "🌱", desc: "Ages 12–15 · Clear & accessible" },
  { id: "intermediate", label: "Intermediate", emoji: "📘", desc: "Ages 16–18 · Detailed explanations" },
  { id: "advanced",     label: "Advanced",     emoji: "🎓", desc: "University level · In-depth analysis" },
  { id: "expert",       label: "Expert",       emoji: "🔬", desc: "Professional / Research grade" },
];

// ─── UI Translations (i18n) ───────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    tagline: "Learn Smarter, Not Harder",
    subtitle: "Upload any material and turn it into fun, interactive AI-powered lessons",
    myCourses: "My Courses", newCourse: "+ Create New Course",
    uploadTitle: "Create a New Course",
    dropzone: "Drag & drop a file here", dropzoneOr: "or click to browse files",
    pasteTitle: "Or paste your content below",
    pastePlaceholder: "Paste notes, an article, a textbook chapter, code, or any educational content...",
    courseTitleLabel: "Course Title",
    courseTitlePlaceholder: "e.g. Introduction to Biology",
    difficultyLabel: "Learning Level",
    generateBtn: "Generate Course ✨",
    generating: "Creating your personalized course...",
    generatingHint: "AI is turning your material into interactive lessons",
    startLesson: "Start Learning 🚀",
    next: "Next →", checkAnswer: "Check Answer",
    sectionComplete: "Section Complete! 🏆",
    courseComplete: "Course Complete! 🎓",
    keepGoing: "Keep Going!",
    backToCourse: "← Course Overview",
    backHome: "← Back to Home",
    hearts: "Hearts", streak: "Streak", xp: "XP",
    quizTime: "Quiz Time! 🎯",
    section: "Section", cards: "cards",
    chooseLanguage: "Choose Language",
    filesSupported: "Supported: .txt .md .js .py .html .json .csv and more",
    noCourses: "No courses yet — create your first one!",
    back: "← Back", of: "of",
    selectAnswer: "Select an answer to continue",
    wrongAnswer: "Not quite — try next time! 😅",
    correctAnswer: "Correct! 🎉",
    explanationLabel: "Why:",
    nextQuestion: "Next Question →",
    seeResults: "See Results 🏅",
    perfectScore: "Perfect Score! 🌟",
    greatJob: "Great Job! 💪",
    keepPracticing: "Keep Practicing! 📚",
    questionsCorrect: "correct",
    visualLabel: "💡 Picture this:",
    highlightLabel: "🔑 Key Point:",
    tryDemo: "Try Demo Course",
    apiKeyMissing: "ANTHROPIC_API_KEY required in .env.local for AI generation",
    sections: "sections",
    story: "Story", explanation: "Explanation", example: "Example",
    tip: "Pro Tip", visual: "Visual",
    deleteCourse: "Delete Course",
    deleteConfirm: "Delete this course? This cannot be undone.",
    confirmYes: "Yes, delete", confirmNo: "Cancel",
    level: "Level", yourLevel: "Your Level",
    xpToNext: "XP to next level",
    courseCreated: "Course created successfully!",
    totalCourses: "Courses", sectionsComplete: "Sections done",
    continueWhere: "Continue where you left off",
  },
  id: {
    tagline: "Belajar Lebih Cerdas",
    subtitle: "Upload materi apapun dan jadikan pelajaran interaktif bertenaga AI",
    myCourses: "Kursus Saya", newCourse: "+ Buat Kursus Baru",
    uploadTitle: "Buat Kursus Baru",
    dropzone: "Seret & lepas file di sini", dropzoneOr: "atau klik untuk memilih file",
    pasteTitle: "Atau tempel konten Anda di bawah",
    pastePlaceholder: "Tempel catatan, artikel, bab buku teks, kode, atau konten pendidikan apapun...",
    courseTitleLabel: "Judul Kursus",
    courseTitlePlaceholder: "mis. Pengenalan Biologi",
    difficultyLabel: "Tingkat Pembelajaran",
    generateBtn: "Buat Kursus ✨",
    generating: "Membuat kursus personal Anda...",
    generatingHint: "AI sedang mengubah materi Anda menjadi pelajaran interaktif",
    startLesson: "Mulai Belajar 🚀",
    next: "Lanjut →", checkAnswer: "Periksa Jawaban",
    sectionComplete: "Bagian Selesai! 🏆",
    courseComplete: "Kursus Selesai! 🎓",
    keepGoing: "Terus Semangat!",
    backToCourse: "← Ikhtisar Kursus",
    backHome: "← Kembali ke Beranda",
    hearts: "Nyawa", streak: "Hari", xp: "XP",
    quizTime: "Kuis! 🎯",
    section: "Bagian", cards: "kartu",
    chooseLanguage: "Pilih Bahasa",
    filesSupported: "Didukung: .txt .md .js .py .html .json .csv dan lainnya",
    noCourses: "Belum ada kursus — buat yang pertama!",
    back: "← Kembali", of: "dari",
    selectAnswer: "Pilih jawaban untuk melanjutkan",
    wrongAnswer: "Belum tepat — coba lagi! 😅",
    correctAnswer: "Benar! 🎉",
    explanationLabel: "Kenapa:",
    nextQuestion: "Pertanyaan Berikut →",
    seeResults: "Lihat Hasil 🏅",
    perfectScore: "Nilai Sempurna! 🌟",
    greatJob: "Kerja Bagus! 💪",
    keepPracticing: "Terus Berlatih! 📚",
    questionsCorrect: "benar",
    visualLabel: "💡 Bayangkan:",
    highlightLabel: "🔑 Poin Utama:",
    tryDemo: "Coba Kursus Demo",
    apiKeyMissing: "ANTHROPIC_API_KEY diperlukan di .env.local untuk generasi AI",
    sections: "bagian",
    story: "Cerita", explanation: "Penjelasan", example: "Contoh",
    tip: "Tips Pro", visual: "Visual",
    deleteCourse: "Hapus Kursus",
    deleteConfirm: "Hapus kursus ini? Tidak dapat dibatalkan.",
    confirmYes: "Ya, hapus", confirmNo: "Batal",
    level: "Level", yourLevel: "Level Anda",
    xpToNext: "XP ke level berikutnya",
    courseCreated: "Kursus berhasil dibuat!",
    totalCourses: "Kursus", sectionsComplete: "Bagian selesai",
    continueWhere: "Lanjutkan dari terakhir kali",
  },
};

const t = (lang, key) => {
  const c = lang?.code || "en";
  return TRANSLATIONS[c]?.[key] ?? TRANSLATIONS.en[key] ?? key;
};

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "zapplearn_v2";
const loadState = () => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; }
};
const saveState = (state) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* ignore quota errors */ }
};

// ─── Demo Course ──────────────────────────────────────────────────────────────
const DEMO_COURSE = {
  id: "demo-v2",
  courseTitle: "Introduction to Programming",
  courseDescription: "Learn the fundamentals of programming through fun stories and interactive quizzes!",
  emoji: "💻", color: "#6366f1",
  difficulty: "beginner",
  createdAt: new Date(0).toISOString(),
  progress: {},
  sections: [
    {
      id: 1,
      title: "What is Programming?",
      cards: [
        {
          id: 1, type: "story", emoji: "🧑‍🍳",
          title: "The Recipe Analogy",
          content: "Imagine you want to bake a perfect cake. You follow a recipe — step-by-step instructions that tell you exactly what to do. Programming is exactly the same! A program is a recipe for your computer, telling it precisely what steps to perform.",
          highlight: "A program = a recipe for your computer",
          visual: "A chef reading a recipe book next to a computer showing lines of code",
        },
        {
          id: 2, type: "explanation", emoji: "🤖",
          title: "What is a Computer Program?",
          content: "A computer program is a set of instructions written in a language the computer understands. These instructions tell the computer what to do — from simple math to displaying beautiful websites and powering social media apps.",
          highlight: "Instructions written in a language computers understand",
          visual: "An arrow from a text file labeled 'Code' pointing to a computer screen showing a result",
        },
        {
          id: 3, type: "example", emoji: "📱",
          title: "Programs You Use Every Day",
          content: "Every app on your phone is a program! WhatsApp sends your messages, YouTube streams videos, and Google Maps finds your route — they are all programs written by teams of developers using programming languages.",
          highlight: "Every app = a carefully written program",
          visual: "App icons arranged around a central 'code' symbol with connecting lines",
        },
        {
          id: 4, type: "tip", emoji: "⚡",
          title: "Which Language Should I Learn?",
          content: "Just like humans speak different languages, programmers write in Python, JavaScript, Java, and more. Each has its strength. Python is perfect for beginners because it reads almost like plain English — and it powers AI, data science, and automation!",
          highlight: "Python: the friendliest language for beginners",
          visual: "Language flags next to programming logos — Python 🐍, JavaScript ⚡, Java ☕",
        },
      ],
      quiz: [
        {
          id: 1,
          question: "What is the best analogy for a computer program?",
          options: ["A type of computer hardware", "A recipe with step-by-step instructions", "A brand of laptop", "An internet service provider"],
          correct: 1,
          explanation: "Just like a recipe tells a chef exactly what steps to follow, a computer program tells a computer exactly what instructions to execute — step by step.",
        },
        {
          id: 2,
          question: "Which language is widely recommended for beginners?",
          options: ["Assembly language", "C++", "Python", "Machine code"],
          correct: 2,
          explanation: "Python uses clean, English-like syntax that is easy to read and write, making it the top choice for beginners around the world.",
        },
        {
          id: 3,
          question: "WhatsApp and YouTube are examples of:",
          options: ["Computer hardware components", "Operating systems", "Computer programs built by developers", "Internet infrastructure cables"],
          correct: 2,
          explanation: "Every app — whether on your phone or computer — is a program written by developers using programming languages like Swift, Kotlin, or JavaScript.",
        },
      ],
    },
    {
      id: 2,
      title: "Variables & Data",
      cards: [
        {
          id: 1, type: "story", emoji: "📦",
          title: "The Magic Labeled Box",
          content: "Picture a magic box where you can store anything — a number, a name, a photo. In programming, we call these boxes 'variables'. You give the box a label, put something inside, and whenever you need it, just call the label's name!",
          highlight: "Variables = labeled boxes for storing data",
          visual: "Colorful labeled boxes on a shelf, each containing a different type of data",
        },
        {
          id: 2, type: "explanation", emoji: "🏷️",
          title: "How Variables Work",
          content: "Every variable has two parts: a name (like 'age' or 'username') and a value (like 25 or 'Maria'). You can change the value anytime. That is why they are called 'variables' — the value can vary over time!",
          highlight: "variableName = value (and value can change)",
          visual: "A labeled jar with 'age = 25', an arrow shows it updating to 26",
        },
        {
          id: 3, type: "example", emoji: "🎮",
          title: "Variables Power Every Game",
          content: "In any video game, variables track everything in real-time: score = 1500, playerName = 'HeroZ', livesLeft = 3, level = 7. Every time you collect a coin, the program runs: score = score + 10. Variables make games feel alive!",
          highlight: "score = score + 10 (this is real working code!)",
          visual: "A game HUD showing score, lives, and level — each labeled as a variable",
        },
        {
          id: 4, type: "tip", emoji: "✨",
          title: "Name Variables Like a Pro",
          content: "Professional developers name variables clearly to describe exactly what they store. Use 'studentAge' not 'x', 'totalCartPrice' not 'tp'. Clear names save hours of confusion when you review code you wrote months ago!",
          highlight: "Descriptive names make code self-documenting",
          visual: "Side-by-side: 'Bad: x, a, tp' in red vs 'Good: userAge, totalPrice, isLoggedIn' in green",
        },
      ],
      quiz: [
        {
          id: 1,
          question: "What is a variable in programming?",
          options: ["A type of computer malware", "A named container that stores data", "A programming language", "A conditional loop"],
          correct: 1,
          explanation: "A variable is like a named box that stores data. You assign it a name and a value, and you can read or update that value at any time during the program.",
        },
        {
          id: 2,
          question: "If score = 50 and a player collects a coin worth 10 points, what is the new score?",
          options: ["50", "10", "60", "5010"],
          correct: 2,
          explanation: "score = score + 10 evaluates to 50 + 10 = 60. This is how variables are updated — you can perform calculations using their current value.",
        },
        {
          id: 3,
          question: "Which is the BEST variable name for storing a customer's email address?",
          options: ["e", "var1", "customerEmail", "x99"],
          correct: 2,
          explanation: "'customerEmail' is descriptive — a reader immediately knows what data it holds. Descriptive names make code far easier to read, maintain, and debug.",
        },
        {
          id: 4,
          question: "Can a variable's value be changed after it is first assigned?",
          options: ["No — values are permanent", "Only one time", "Yes — as many times as needed", "Only by system processes"],
          correct: 2,
          explanation: "Variables are designed to change — that is why they are called 'variables'! You can update them as often as your program requires.",
        },
      ],
    },
  ],
};

// ─── Card type config ─────────────────────────────────────────────────────────
const CARD_CONFIG = {
  story:       { gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)", icon: "📖", labelKey: "story" },
  explanation: { gradient: "linear-gradient(135deg,#1d4ed8,#0891b2)", icon: "📚", labelKey: "explanation" },
  example:     { gradient: "linear-gradient(135deg,#065f46,#0d9488)", icon: "💡", labelKey: "example" },
  tip:         { gradient: "linear-gradient(135deg,#b45309,#d97706)", icon: "⚡", labelKey: "tip" },
  visual:      { gradient: "linear-gradient(135deg,#be123c,#e11d48)", icon: "🎨", labelKey: "visual" },
};

// ─── Confetti (fixed: random values are stable per mount) ─────────────────────
function Confetti({ active }) {
  const COLORS = ["#58CC02","#FFD700","#CE82FF","#FF4B4B","#1CB0F6","#FF9600","#f472b6","#34d399"];
  // Pre-generate stable particle data so it doesn't re-randomize on every render
  const particles = useMemo(() =>
    Array.from({ length: 70 }, (_, i) => ({
      w:    6 + (i * 3.7) % 12,
      h:    6 + (i * 5.3) % 12,
      left: (i * 14.3) % 100,
      dur:  1.4 + (i * 0.07) % 2,
      del:  (i * 0.013) % 0.9,
      rot:  (i * 53) % 360,
      circle: i % 3 !== 0,
      color: COLORS[i % COLORS.length],
    }))
  , []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position:"absolute",
          width:`${p.w}px`, height:`${p.h}px`,
          background: p.color,
          borderRadius: p.circle ? "50%" : "2px",
          left:`${p.left}%`, top:"-20px",
          animation:`confettiFall ${p.dur}s linear ${p.del}s forwards`,
          transform:`rotate(${p.rot}deg)`,
        }} />
      ))}
    </div>
  );
}

// ─── Level Badge ──────────────────────────────────────────────────────────────
function LevelBadge({ xp, compact = false }) {
  const lvl = getLevel(xp);
  const next = LEVELS.find((l) => l.min > xp);
  if (compact) {
    return (
      <span style={{
        display:"inline-flex", alignItems:"center", gap:"4px",
        background:`${lvl.color}20`, border:`1px solid ${lvl.color}50`,
        borderRadius:"20px", padding:"3px 10px",
        fontSize:"0.78rem", fontWeight:"700", color: lvl.color,
      }}>
        {lvl.icon} {lvl.label}
      </span>
    );
  }
  const pct = next ? Math.round(((xp - lvl.min) / (next.min - lvl.min)) * 100) : 100;
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:"2rem", marginBottom:"4px" }}>{lvl.icon}</div>
      <div style={{ fontWeight:"800", color: lvl.color, fontSize:"1rem" }}>{lvl.label}</div>
      {next && (
        <>
          <div style={{ height:"5px", background:"rgba(255,255,255,0.08)", borderRadius:"3px", margin:"6px 0 3px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background: lvl.color, borderRadius:"3px", transition:"width 0.5s" }} />
          </div>
          <div style={{ fontSize:"0.7rem", color:"#666" }}>{next.min - xp} XP to {next.label}</div>
        </>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ xp, hearts, streak, lang, setLang, showLangSelector, setShowLangSelector, setView }) {
  const lvl = getLevel(xp);
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(8,8,24,0.97)", backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(255,255,255,0.07)",
      padding:"0 16px", height:"58px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      gap:"8px",
    }}>
      {/* Logo */}
      <button onClick={() => setView("home")} style={{
        background:"none", border:"none", cursor:"pointer",
        display:"flex", alignItems:"center", gap:"7px", flexShrink:0,
      }}>
        <span style={{ fontSize:"1.4rem" }}>🧠</span>
        <span style={{
          fontSize:"1.15rem", fontWeight:"900",
          background:"linear-gradient(90deg,#58CC02,#1CB0F6)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>ZappLearn</span>
      </button>

      {/* Stats row */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"nowrap" }}>
        {/* Hearts */}
        <div style={{
          display:"flex", alignItems:"center", gap:"2px",
          background:"rgba(255,75,75,0.1)", border:"1px solid rgba(255,75,75,0.2)",
          borderRadius:"20px", padding:"4px 10px",
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize:"0.9rem", opacity: i < hearts ? 1 : 0.2, transition:"opacity 0.3s" }}>❤️</span>
          ))}
        </div>

        {/* XP + Level */}
        <div style={{
          display:"flex", alignItems:"center", gap:"5px",
          background:"rgba(255,215,0,0.1)", border:"1px solid rgba(255,215,0,0.25)",
          borderRadius:"20px", padding:"4px 11px",
        }}>
          <span style={{ fontSize:"0.85rem" }}>⚡</span>
          <span style={{ color:"#FFD700", fontWeight:"700", fontSize:"0.85rem" }}>{xp}</span>
          <LevelBadge xp={xp} compact />
        </div>

        {/* Streak */}
        <div style={{
          display:"flex", alignItems:"center", gap:"4px",
          background:"rgba(255,150,0,0.1)", border:"1px solid rgba(255,150,0,0.25)",
          borderRadius:"20px", padding:"4px 11px",
        }}>
          <span style={{ fontSize:"0.9rem" }}>🔥</span>
          <span style={{ color:"#FF9600", fontWeight:"700", fontSize:"0.85rem" }}>{streak}</span>
        </div>

        {/* Language selector */}
        <div style={{ position:"relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowLangSelector((v) => !v); }}
            style={{
              display:"flex", alignItems:"center", gap:"5px",
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:"20px", padding:"5px 11px", cursor:"pointer", color:"#fff",
              fontSize:"0.82rem", fontWeight:"600",
            }}
          >
            <span>{lang.flag}</span>
            <span style={{ display:"none", ["@media(min-width:500px)"]: { display:"inline" } }}>{lang.code.toUpperCase()}</span>
            <span style={{ fontSize:"0.6rem", opacity:0.6 }}>▼</span>
          </button>

          {showLangSelector && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position:"absolute", right:0, top:"calc(100% + 8px)",
                background:"#12122a", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:"16px", padding:"8px", width:"240px", maxHeight:"360px",
                overflowY:"auto", zIndex:200, boxShadow:"0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ fontSize:"0.72rem", color:"#888", padding:"4px 8px 8px", fontWeight:"700", textTransform:"uppercase", letterSpacing:"1px" }}>
                {t(lang, "chooseLanguage")}
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l); setShowLangSelector(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:"10px",
                    width:"100%", padding:"8px 10px",
                    background: lang.code === l.code ? "rgba(88,204,2,0.12)" : "transparent",
                    border:"none", borderRadius:"8px", cursor:"pointer", color:"#fff",
                    fontSize:"0.84rem", textAlign:"left",
                  }}
                >
                  <span style={{ fontSize:"1.15rem" }}>{l.flag}</span>
                  <div>
                    <div style={{ fontWeight: lang.code === l.code ? "700" : "400" }}>{l.nativeName}</div>
                    <div style={{ fontSize:"0.68rem", opacity:0.45 }}>{l.name}</div>
                  </div>
                  {lang.code === l.code && <span style={{ marginLeft:"auto", color:"#58CC02", fontWeight:"700" }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────
function HomeView({ courses, setCourses, setView, setActiveCourse, lang, xp, streak }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalSections = courses.reduce((a, c) => a + (c.sections?.length || 0), 0);
  const doneSections  = courses.reduce((a, c) => a + Object.values(c.progress || {}).filter(Boolean).length, 0);
  const lvl = getLevel(xp);

  const handleDelete = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setDeleteTarget(null);
  };

  // Find the most recently active course to show "continue" prompt
  const inProgressCourse = courses.find((c) => {
    const done = Object.values(c.progress || {}).filter(Boolean).length;
    return done > 0 && done < (c.sections?.length || 0);
  });

  return (
    <div style={{ maxWidth:"920px", margin:"0 auto", padding:"36px 16px 60px" }}>
      {/* Hero */}
      <div style={{
        textAlign:"center", marginBottom:"40px",
        background:"linear-gradient(135deg,rgba(88,204,2,0.07),rgba(28,176,246,0.07))",
        borderRadius:"24px", padding:"44px 20px",
        border:"1px solid rgba(88,204,2,0.12)",
      }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"14px" }}>🧠✨</div>
        <h1 style={{
          fontSize:"clamp(1.6rem,4vw,2.6rem)", fontWeight:"900", margin:"0 0 10px",
          background:"linear-gradient(90deg,#58CC02,#1CB0F6,#CE82FF)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.2,
        }}>
          {t(lang, "tagline")}
        </h1>
        <p style={{ fontSize:"0.95rem", color:"#999", margin:"0 0 28px", maxWidth:"480px", marginInline:"auto", lineHeight:1.6 }}>
          {t(lang, "subtitle")}
        </p>
        <button
          onClick={() => setView("upload")}
          style={{
            background:"linear-gradient(135deg,#58CC02,#1CB0F6)",
            border:"none", color:"#fff", padding:"13px 30px",
            borderRadius:"50px", fontSize:"0.95rem", fontWeight:"800",
            cursor:"pointer", letterSpacing:"0.3px",
            boxShadow:"0 4px 20px rgba(88,204,2,0.35)",
          }}
        >
          {t(lang, "newCourse")}
        </button>
      </div>

      {/* Continue where you left off */}
      {inProgressCourse && (
        <div style={{
          background:`linear-gradient(135deg,${inProgressCourse.color}15,${inProgressCourse.color}08)`,
          border:`1px solid ${inProgressCourse.color}30`,
          borderRadius:"16px", padding:"16px 20px", marginBottom:"28px",
          display:"flex", alignItems:"center", gap:"14px",
        }}>
          <span style={{ fontSize:"2rem" }}>{inProgressCourse.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.75rem", color:"#888", marginBottom:"2px" }}>{t(lang, "continueWhere")}</div>
            <div style={{ fontWeight:"700", color:"#fff" }}>{inProgressCourse.courseTitle}</div>
          </div>
          <button
            onClick={() => { setActiveCourse(inProgressCourse); setView("course"); }}
            style={{
              background: inProgressCourse.color, border:"none",
              color:"#fff", padding:"8px 18px", borderRadius:"20px",
              cursor:"pointer", fontWeight:"700", fontSize:"0.85rem", whiteSpace:"nowrap",
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Stats */}
      {courses.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:"12px", marginBottom:"32px" }}>
          {[
            { label: t(lang, "totalCourses"), value: courses.length,      icon: "📚", color: "#6366f1" },
            { label: t(lang, "sectionsComplete"), value:`${doneSections}/${totalSections}`, icon:"✅", color:"#58CC02" },
            { label: "XP",    value: xp,    icon: "⚡", color: "#FFD700" },
            { label: t(lang, "streak"), value: `${streak}🔥`, icon: "", color:"#FF9600" },
          ].map((s) => (
            <div key={s.label} style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:"14px", padding:"14px 10px", textAlign:"center",
            }}>
              <div style={{ fontSize:"1.3rem", marginBottom:"2px" }}>{s.icon}</div>
              <div style={{ fontSize:"1.3rem", fontWeight:"800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize:"0.7rem", color:"#555" }}>{s.label}</div>
            </div>
          ))}
          {/* Level card */}
          <div style={{
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:"14px", padding:"14px 10px",
          }}>
            <LevelBadge xp={xp} />
          </div>
        </div>
      )}

      {/* Course grid */}
      <h2 style={{ fontSize:"1.1rem", fontWeight:"700", marginBottom:"16px", color:"#ccc", display:"flex", alignItems:"center", gap:"8px" }}>
        {t(lang, "myCourses")}
        <span style={{ fontSize:"0.8rem", color:"#555", fontWeight:"400" }}>({courses.length})</span>
      </h2>

      {courses.length === 0 ? (
        <div style={{
          textAlign:"center", padding:"56px 20px",
          background:"rgba(255,255,255,0.015)", borderRadius:"20px",
          border:"2px dashed rgba(255,255,255,0.08)",
        }}>
          <div style={{ fontSize:"3rem", marginBottom:"10px" }}>📭</div>
          <p style={{ color:"#555", marginBottom:"20px", fontSize:"0.9rem" }}>{t(lang, "noCourses")}</p>
          <button
            onClick={() => { setActiveCourse(DEMO_COURSE); setView("course"); }}
            style={{
              background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.35)",
              color:"#a5b4fc", padding:"10px 22px", borderRadius:"20px",
              cursor:"pointer", fontWeight:"600", fontSize:"0.88rem",
            }}
          >
            {t(lang, "tryDemo")}
          </button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:"16px" }}>
          {courses.map((course) => {
            const total = course.sections?.length || 0;
            const done  = Object.values(course.progress || {}).filter(Boolean).length;
            const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
            const diff  = DIFFICULTIES.find((d) => d.id === course.difficulty);
            return (
              <div key={course.id} style={{
                background:`linear-gradient(135deg,${course.color}20,${course.color}0a)`,
                border:`1px solid ${course.color}35`,
                borderRadius:"18px", padding:"20px", position:"relative",
                cursor:"pointer",
              }}>
                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(course.id); }}
                  style={{
                    position:"absolute", top:"10px", right:"10px",
                    background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.2)",
                    borderRadius:"8px", color:"#f87171", cursor:"pointer",
                    fontSize:"0.7rem", padding:"3px 8px", fontWeight:"600",
                  }}
                  title={t(lang, "deleteCourse")}
                >✕</button>

                <div
                  onClick={() => { setActiveCourse(course); setView("course"); }}
                  style={{ display:"flex", flexDirection:"column", gap:"8px" }}
                >
                  <div style={{ fontSize:"2.2rem" }}>{course.emoji}</div>
                  <div style={{ fontWeight:"800", fontSize:"0.95rem", lineHeight:1.3, color:"#fff", paddingRight:"28px" }}>
                    {course.courseTitle}
                  </div>
                  {diff && (
                    <div style={{ fontSize:"0.72rem", color:"#888", display:"flex", alignItems:"center", gap:"4px" }}>
                      {diff.emoji} {diff.label}
                    </div>
                  )}
                  <div style={{ fontSize:"0.8rem", color:"#888" }}>
                    {course.courseDescription?.length > 80
                      ? course.courseDescription.slice(0, 80) + "…"
                      : course.courseDescription}
                  </div>
                  <div style={{ fontSize:"0.72rem", color:"#666", marginTop:"2px" }}>
                    {total} {t(lang, "sections")} · {pct}% complete
                  </div>
                  <div style={{ height:"5px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden" }}>
                    <div style={{
                      height:"100%", width:`${pct}%`,
                      background:`linear-gradient(90deg,${course.color},${course.color}88)`,
                      borderRadius:"3px", transition:"width 0.5s ease",
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
          {/* Add new */}
          <button
            onClick={() => setView("upload")}
            style={{
              background:"rgba(255,255,255,0.015)", border:"2px dashed rgba(255,255,255,0.1)",
              borderRadius:"18px", padding:"20px", cursor:"pointer",
              color:"#555", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:"8px",
              minHeight:"150px", fontSize:"0.88rem",
            }}
          >
            <span style={{ fontSize:"1.8rem" }}>➕</span>
            <span>{t(lang, "newCourse")}</span>
          </button>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:"20px",
        }}>
          <div style={{
            background:"#12122a", border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:"20px", padding:"28px", maxWidth:"360px", width:"100%", textAlign:"center",
          }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>🗑️</div>
            <p style={{ color:"#ddd", marginBottom:"24px", fontSize:"0.95rem" }}>
              {t(lang, "deleteConfirm")}
            </p>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
              <button
                onClick={() => handleDelete(deleteTarget)}
                style={{
                  background:"rgba(239,68,68,0.8)", border:"none", color:"#fff",
                  padding:"10px 22px", borderRadius:"20px", cursor:"pointer", fontWeight:"700",
                }}
              >{t(lang, "confirmYes")}</button>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                  color:"#ddd", padding:"10px 22px", borderRadius:"20px", cursor:"pointer", fontWeight:"600",
                }}
              >{t(lang, "confirmNo")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Upload View ──────────────────────────────────────────────────────────────
function UploadView({ setView, addCourse, lang, showDemo }) {
  const [title,        setTitle]        = useState("");
  const [content,      setContent]      = useState("");
  const [isDragging,   setIsDragging]   = useState(false);
  const [fileName,     setFileName]     = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error,        setError]        = useState("");
  const [stepIdx,      setStepIdx]      = useState(0);
  const [difficulty,   setDifficulty]   = useState("beginner");
  const fileInputRef = useRef(null);

  const STEPS = [
    "Analyzing your material…",
    "Structuring lesson sections…",
    "Crafting stories & examples…",
    "Building quiz questions…",
    "Finalizing your course…",
  ];

  const handleFile = (file) => {
    if (!file) return;
    const ALLOWED = [".txt",".md",".js",".ts",".tsx",".jsx",".py",".html",".json",".csv",".xml",".yaml",".yml"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setError(`File type not supported. Supported: ${ALLOWED.join(" ")}`);
      return;
    }
    if (file.size > 1024 * 1024) { setError("File is too large (max 1 MB)."); return; }
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target.result);
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsText(file, "UTF-8");
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleGenerate = async () => {
    const trimmed = content.trim();
    if (trimmed.length < 30) {
      setError("Please provide more content (at least 30 characters).");
      return;
    }
    setError("");
    setIsGenerating(true);
    setStepIdx(0);
    const iv = setInterval(() => setStepIdx((s) => Math.min(s + 1, STEPS.length - 1)), 2200);

    try {
      const res = await fetch("/api/learn/process", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ content: trimmed, language: lang.name, title: title || "My Course", difficulty }),
      });
      const data = await res.json();
      clearInterval(iv);
      if (!data.success) throw new Error(data.error || "Generation failed");
      addCourse(data.course);
      setView("home");
    } catch (err) {
      clearInterval(iv);
      setError(err.message);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"80px 20px", textAlign:"center" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"20px", animation:"pulse 1.4s ease-in-out infinite" }}>🧠</div>
        <h2 style={{ fontSize:"1.4rem", fontWeight:"800", marginBottom:"6px", color:"#fff" }}>
          {t(lang, "generating")}
        </h2>
        <p style={{ color:"#888", marginBottom:"28px", fontSize:"0.88rem" }}>{t(lang, "generatingHint")}</p>
        <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:"14px", padding:"20px", marginBottom:"20px" }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"10px",
              padding:"7px 0", opacity: i <= stepIdx ? 1 : 0.2, transition:"opacity 0.5s",
            }}>
              <span style={{ fontSize:"1rem" }}>
                {i < stepIdx ? "✅" : i === stepIdx ? "⏳" : "⭕"}
              </span>
              <span style={{ color: i <= stepIdx ? "#ddd" : "#444", fontSize:"0.88rem" }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px", overflow:"hidden" }}>
          <div style={{
            height:"100%",
            width:`${((stepIdx + 1) / STEPS.length) * 100}%`,
            background:"linear-gradient(90deg,#58CC02,#1CB0F6)",
            borderRadius:"2px", transition:"width 2.2s ease",
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:"700px", margin:"0 auto", padding:"36px 16px 60px" }}>
      <button onClick={() => setView("home")} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"0.88rem", marginBottom:"20px", padding:0 }}>
        {t(lang, "back")}
      </button>
      <h1 style={{ fontSize:"1.7rem", fontWeight:"800", marginBottom:"6px", color:"#fff" }}>
        {t(lang, "uploadTitle")} ✨
      </h1>
      <p style={{ color:"#888", marginBottom:"28px", fontSize:"0.88rem" }}>{t(lang, "generatingHint")}</p>

      {/* Title */}
      <div style={{ marginBottom:"18px" }}>
        <label style={{ display:"block", fontSize:"0.82rem", fontWeight:"600", color:"#bbb", marginBottom:"7px" }}>
          {t(lang, "courseTitleLabel")}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(lang, "courseTitlePlaceholder")}
          style={{
            width:"100%", padding:"11px 14px",
            background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"11px", color:"#fff", fontSize:"0.95rem", outline:"none", boxSizing:"border-box",
          }}
        />
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom:"20px" }}>
        <label style={{ display:"block", fontSize:"0.82rem", fontWeight:"600", color:"#bbb", marginBottom:"9px" }}>
          {t(lang, "difficultyLabel")}
        </label>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              title={d.desc}
              style={{
                padding:"7px 14px", borderRadius:"20px", cursor:"pointer", fontSize:"0.82rem", fontWeight:"600",
                border:`2px solid ${difficulty === d.id ? "#58CC02" : "rgba(255,255,255,0.1)"}`,
                background: difficulty === d.id ? "rgba(88,204,2,0.12)" : "rgba(255,255,255,0.03)",
                color: difficulty === d.id ? "#86efac" : "#888",
                transition:"all 0.15s",
              }}
            >
              {d.emoji} {d.label}
            </button>
          ))}
        </div>
        {DIFFICULTIES.find((d) => d.id === difficulty) && (
          <p style={{ fontSize:"0.75rem", color:"#666", marginTop:"6px", marginLeft:"2px" }}>
            {DIFFICULTIES.find((d) => d.id === difficulty).desc}
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border:`2px dashed ${isDragging ? "#58CC02" : "rgba(255,255,255,0.12)"}`,
          borderRadius:"18px", padding:"36px 20px", textAlign:"center",
          cursor:"pointer", marginBottom:"18px",
          background: isDragging ? "rgba(88,204,2,0.05)" : "rgba(255,255,255,0.015)",
          transition:"all 0.2s",
        }}
      >
        <input
          ref={fileInputRef} type="file"
          accept=".txt,.md,.js,.ts,.tsx,.jsx,.py,.html,.json,.csv,.xml,.yaml,.yml"
          onChange={(e) => handleFile(e.target.files[0])}
          style={{ display:"none" }}
        />
        {fileName ? (
          <>
            <div style={{ fontSize:"2.2rem", marginBottom:"7px" }}>📄</div>
            <div style={{ color:"#58CC02", fontWeight:"700", marginBottom:"3px" }}>{fileName}</div>
            <div style={{ fontSize:"0.78rem", color:"#888" }}>{content.length.toLocaleString()} characters loaded</div>
          </>
        ) : (
          <>
            <div style={{ fontSize:"2.2rem", marginBottom:"7px" }}>📂</div>
            <div style={{ color:"#ddd", fontWeight:"600", marginBottom:"3px" }}>{t(lang, "dropzone")}</div>
            <div style={{ color:"#777", fontSize:"0.82rem", marginBottom:"4px" }}>{t(lang, "dropzoneOr")}</div>
            <div style={{ color:"#444", fontSize:"0.72rem" }}>{t(lang, "filesSupported")}</div>
          </>
        )}
      </div>

      {/* Paste area */}
      <div style={{ marginBottom:"18px" }}>
        <label style={{ display:"block", fontSize:"0.82rem", fontWeight:"600", color:"#bbb", marginBottom:"7px" }}>
          {t(lang, "pasteTitle")}
        </label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setFileName(""); }}
          placeholder={t(lang, "pastePlaceholder")}
          rows={9}
          style={{
            width:"100%", padding:"13px 14px",
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"14px", color:"#ccc", fontSize:"0.88rem",
            resize:"vertical", outline:"none", lineHeight:"1.65",
            fontFamily:"inherit", boxSizing:"border-box",
          }}
        />
        <div style={{ fontSize:"0.72rem", color:"#444", marginTop:"4px", textAlign:"right" }}>
          {content.length.toLocaleString()} / 8,000 characters
        </div>
      </div>

      {error && (
        <div style={{
          background:"rgba(239,68,68,0.09)", border:"1px solid rgba(239,68,68,0.28)",
          borderRadius:"11px", padding:"11px 14px", color:"#f87171",
          fontSize:"0.84rem", marginBottom:"14px",
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <button
          onClick={handleGenerate}
          disabled={content.trim().length < 30}
          style={{
            flex:"1 1 190px", padding:"13px 22px",
            background: content.trim().length >= 30
              ? "linear-gradient(135deg,#58CC02,#1CB0F6)"
              : "rgba(255,255,255,0.06)",
            border:"none", borderRadius:"50px",
            cursor: content.trim().length >= 30 ? "pointer" : "not-allowed",
            color:"#fff", fontWeight:"800", fontSize:"0.95rem",
            boxShadow: content.trim().length >= 30 ? "0 4px 18px rgba(88,204,2,0.3)" : "none",
            transition:"all 0.2s",
          }}
        >
          {t(lang, "generateBtn")}
        </button>
        <button
          onClick={showDemo}
          style={{
            padding:"13px 18px", background:"rgba(99,102,241,0.12)",
            border:"1px solid rgba(99,102,241,0.35)", borderRadius:"50px",
            cursor:"pointer", color:"#a5b4fc", fontWeight:"600", fontSize:"0.88rem",
          }}
        >
          {t(lang, "tryDemo")}
        </button>
      </div>
      <p style={{ fontSize:"0.72rem", color:"#444", marginTop:"10px", textAlign:"center" }}>
        {t(lang, "apiKeyMissing")}
      </p>
    </div>
  );
}

// ─── Course Overview ──────────────────────────────────────────────────────────
function CourseView({ course, setView, setActiveSection, lang, goHome }) {
  const total = course.sections?.length || 0;
  const done  = Object.values(course.progress || {}).filter(Boolean).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const diff  = DIFFICULTIES.find((d) => d.id === course.difficulty);

  return (
    <div style={{ maxWidth:"680px", margin:"0 auto", padding:"36px 16px 60px" }}>
      <button onClick={goHome} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"0.88rem", marginBottom:"20px", padding:0 }}>
        {t(lang, "backHome")}
      </button>

      {/* Course header */}
      <div style={{
        background:`linear-gradient(135deg,${course.color}1a,${course.color}0a)`,
        border:`1px solid ${course.color}30`,
        borderRadius:"22px", padding:"28px", marginBottom:"28px", textAlign:"center",
      }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"10px" }}>{course.emoji}</div>
        {diff && (
          <div style={{ fontSize:"0.75rem", color:"#888", marginBottom:"8px" }}>{diff.emoji} {diff.label} level</div>
        )}
        <h1 style={{ fontSize:"1.5rem", fontWeight:"900", margin:"0 0 8px", color:"#fff", lineHeight:1.2 }}>
          {course.courseTitle}
        </h1>
        <p style={{ color:"#999", margin:"0 0 18px", fontSize:"0.88rem", lineHeight:1.6 }}>
          {course.courseDescription}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", justifyContent:"center" }}>
          <div style={{
            flex:1, maxWidth:"180px", height:"7px",
            background:"rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden",
          }}>
            <div style={{
              height:"100%", width:`${pct}%`,
              background:`linear-gradient(90deg,${course.color},#1CB0F6)`,
              borderRadius:"4px", transition:"width 0.5s",
            }} />
          </div>
          <span style={{ color: course.color, fontWeight:"800", fontSize:"0.9rem" }}>{pct}%</span>
          <span style={{ color:"#555", fontSize:"0.8rem" }}>{done}/{total} sections</span>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {course.sections?.map((section, idx) => {
          const isComplete = !!course.progress?.[idx];
          const isUnlocked = idx === 0 || !!course.progress?.[idx - 1];
          return (
            <button
              key={section.id}
              onClick={() => { if (!isUnlocked) return; setActiveSection(idx); setView("lesson"); }}
              style={{
                display:"flex", alignItems:"center", gap:"14px",
                padding:"16px 18px",
                background: isComplete
                  ? "rgba(88,204,2,0.07)"
                  : isUnlocked ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                border:`1px solid ${
                  isComplete ? "rgba(88,204,2,0.22)"
                  : isUnlocked ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)"}`,
                borderRadius:"14px",
                cursor: isUnlocked ? "pointer" : "not-allowed",
                color: isUnlocked ? "#fff" : "#3a3a5a", textAlign:"left",
                transition:"background 0.15s, border-color 0.15s",
              }}
            >
              <div style={{
                width:"40px", height:"40px", borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                background: isComplete ? "rgba(88,204,2,0.18)" : isUnlocked ? `${course.color}20` : "rgba(255,255,255,0.03)",
                border:`2px solid ${isComplete ? "#58CC02" : isUnlocked ? course.color : "rgba(255,255,255,0.06)"}`,
                fontSize:"1rem",
              }}>
                {isComplete ? "✅" : isUnlocked ? <span style={{ fontWeight:"800", color: course.color }}>{idx + 1}</span> : "🔒"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:"700", marginBottom:"3px", fontSize:"0.92rem" }}>
                  {t(lang, "section")} {idx + 1}: {section.title}
                </div>
                <div style={{ fontSize:"0.76rem", color:"#666" }}>
                  {section.cards?.length || 0} {t(lang, "cards")} · quiz
                  {isComplete && <span style={{ color:"#58CC02", marginLeft:"6px" }}>✓ Done</span>}
                </div>
              </div>
              {isUnlocked && (
                <span style={{ color: isComplete ? "#58CC02" : "#555", fontSize:"1.1rem" }}>→</span>
              )}
            </button>
          );
        })}
      </div>

      {done === total && total > 0 && (
        <div style={{
          marginTop:"28px", textAlign:"center", padding:"22px",
          background:"linear-gradient(135deg,rgba(88,204,2,0.08),rgba(28,176,246,0.08))",
          borderRadius:"18px", border:"1px solid rgba(88,204,2,0.22)",
        }}>
          <div style={{ fontSize:"2.2rem", marginBottom:"7px" }}>🎓</div>
          <div style={{ fontSize:"1.1rem", fontWeight:"800", color:"#58CC02" }}>
            {t(lang, "courseComplete")}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lesson View ──────────────────────────────────────────────────────────────
function LessonView({ course, sectionIndex, setView, lang }) {
  const section = course.sections?.[sectionIndex];
  const [cardIndex, setCardIndex] = useState(0);
  const [sliding,   setSliding]   = useState(false);

  // Reset card index when section changes
  useEffect(() => { setCardIndex(0); }, [sectionIndex]);

  if (!section) { setView("course"); return null; }

  const cards    = section.cards || [];
  const card     = cards[cardIndex];
  const cfg      = CARD_CONFIG[card?.type] || CARD_CONFIG.explanation;
  const progress = cards.length > 0 ? ((cardIndex + 1) / cards.length) * 100 : 100;

  const nextCard = () => {
    if (cardIndex < cards.length - 1) {
      setSliding(true);
      setTimeout(() => { setCardIndex((i) => i + 1); setSliding(false); }, 180);
    } else {
      setView("quiz");
    }
  };

  const cardLabel = t(lang, cfg.labelKey) || cfg.labelKey;

  return (
    <div style={{ maxWidth:"600px", margin:"0 auto", padding:"20px 16px 60px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px" }}>
        <button
          onClick={() => setView("course")}
          style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"1.1rem", padding:"4px", lineHeight:1 }}
        >✕</button>
        <div style={{ flex:1, height:"7px", background:"rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${progress}%`,
            background:"linear-gradient(90deg,#58CC02,#1CB0F6)",
            borderRadius:"4px", transition:"width 0.35s ease",
          }} />
        </div>
        <span style={{ color:"#777", fontSize:"0.78rem", whiteSpace:"nowrap" }}>
          {cardIndex + 1} {t(lang, "of")} {cards.length}
        </span>
      </div>
      <div style={{ fontSize:"0.82rem", color:"#777", marginBottom:"14px" }}>
        {t(lang, "section")} {sectionIndex + 1}: <strong style={{ color:"#bbb" }}>{section.title}</strong>
      </div>

      {/* Card */}
      {card && (
        <div style={{
          borderRadius:"22px", overflow:"hidden",
          boxShadow:"0 16px 48px rgba(0,0,0,0.45)",
          opacity: sliding ? 0 : 1,
          transform: sliding ? "translateX(24px)" : "translateX(0)",
          transition:"opacity 0.18s, transform 0.18s",
        }}>
          {/* Header gradient */}
          <div style={{ background: cfg.gradient, padding:"26px 26px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"14px" }}>
              <span style={{ fontSize:"0.95rem" }}>{cfg.icon}</span>
              <span style={{
                background:"rgba(255,255,255,0.18)", padding:"3px 10px",
                borderRadius:"20px", fontSize:"0.72rem", fontWeight:"700",
                color:"#fff", textTransform:"uppercase", letterSpacing:"0.5px",
              }}>{cardLabel}</span>
            </div>
            <div style={{ fontSize:"3.5rem", textAlign:"center", marginBottom:"10px" }}>{card.emoji}</div>
            <h2 style={{ margin:0, fontSize:"1.2rem", fontWeight:"800", color:"#fff", textAlign:"center", lineHeight:1.3 }}>
              {card.title}
            </h2>
          </div>

          {/* Body */}
          <div style={{ background:"#181830", padding:"24px" }}>
            <p style={{ color:"#ccc", fontSize:"0.97rem", lineHeight:"1.72", margin:"0 0 18px" }}>
              {card.content}
            </p>

            {card.highlight && (
              <div style={{
                background:"rgba(255,215,0,0.06)", border:"1px solid rgba(255,215,0,0.18)",
                borderRadius:"11px", padding:"11px 14px", marginBottom:"14px",
                display:"flex", flexDirection:"column", gap:"4px",
              }}>
                <span style={{ fontSize:"0.72rem", color:"#888", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  {t(lang, "highlightLabel")}
                </span>
                <strong style={{ color:"#FFD700", fontSize:"0.93rem" }}>{card.highlight}</strong>
              </div>
            )}

            {card.visual && (
              <div style={{
                background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.18)",
                borderRadius:"11px", padding:"11px 14px", marginBottom:"20px",
                display:"flex", flexDirection:"column", gap:"4px",
              }}>
                <span style={{ fontSize:"0.72rem", color:"#888", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  {t(lang, "visualLabel")}
                </span>
                <span style={{ color:"#a5b4fc", fontSize:"0.86rem", fontStyle:"italic" }}>{card.visual}</span>
              </div>
            )}

            <button
              onClick={nextCard}
              style={{
                width:"100%", padding:"13px",
                background: cardIndex < cards.length - 1
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "linear-gradient(135deg,#58CC02,#0d9488)",
                border:"none", borderRadius:"13px", cursor:"pointer",
                color:"#fff", fontWeight:"800", fontSize:"0.97rem",
                boxShadow: cardIndex < cards.length - 1
                  ? "0 4px 14px rgba(99,102,241,0.3)"
                  : "0 4px 14px rgba(88,204,2,0.3)",
              }}
            >
              {cardIndex < cards.length - 1 ? t(lang, "next") : `${t(lang, "quizTime")}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quiz View ────────────────────────────────────────────────────────────────
function QuizView({ course, sectionIndex, setView, addXP, loseHeart, lang, completeSection }) {
  const section = course.sections?.[sectionIndex];
  const quiz    = useMemo(() => section?.quiz || [], [section]);

  const [qIndex,     setQIndex]     = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [checked,    setChecked]    = useState(false);
  const [score,      setScore]      = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shake,      setShake]      = useState(false);

  // Bug fix: side-effect on mount if no quiz questions
  useEffect(() => {
    if (!section || quiz.length === 0) {
      completeSection(sectionIndex);
      setView("course");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!section || quiz.length === 0) return null;

  const q         = quiz[qIndex];
  const isCorrect = selected === q.correct;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (isCorrect) {
      addXP(10);
      setScore((s) => s + 1);
    } else {
      loseHeart();
      setShake(true);
      setTimeout(() => setShake(false), 550);
    }
  };

  const handleNext = () => {
    if (qIndex < quiz.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      completeSection(sectionIndex);
      setShowResult(true);
    }
  };

  if (showResult) {
    const pct          = Math.round((score / quiz.length) * 100);
    const hasNextSection = sectionIndex < (course.sections?.length || 0) - 1;
    return (
      <div style={{ maxWidth:"480px", margin:"0 auto", padding:"60px 20px", textAlign:"center" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:"14px" }}>
          {pct === 100 ? "🌟" : pct >= 70 ? "🏆" : "📚"}
        </div>
        <h2 style={{ fontSize:"1.7rem", fontWeight:"900", marginBottom:"7px", color:"#fff" }}>
          {pct === 100 ? t(lang,"perfectScore") : pct >= 70 ? t(lang,"greatJob") : t(lang,"keepPracticing")}
        </h2>
        <p style={{ color:"#999", marginBottom:"10px", fontSize:"0.92rem" }}>
          {score}/{quiz.length} {t(lang,"questionsCorrect")} — {pct}%
        </p>
        <p style={{ color:"#FFD700", fontWeight:"700", marginBottom:"32px", fontSize:"0.9rem" }}>
          +{score * 10} XP earned ⚡
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          {hasNextSection && (
            <button
              onClick={() => { setView("next-lesson"); }}
              style={{
                padding:"13px 26px", background:"linear-gradient(135deg,#58CC02,#1CB0F6)",
                border:"none", borderRadius:"50px", cursor:"pointer",
                color:"#fff", fontWeight:"800", fontSize:"0.92rem",
                boxShadow:"0 4px 14px rgba(88,204,2,0.3)",
              }}
            >
              {t(lang,"keepGoing")} →
            </button>
          )}
          <button
            onClick={() => setView("course")}
            style={{
              padding:"13px 26px", background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.14)", borderRadius:"50px",
              cursor:"pointer", color:"#ccc", fontWeight:"600", fontSize:"0.9rem",
            }}
          >
            {t(lang,"backToCourse")}
          </button>
        </div>
      </div>
    );
  }

  const OPT = {
    default:  { bg:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.10)", text:"#ccc" },
    selected: { bg:"rgba(99,102,241,0.14)",  border:"rgba(99,102,241,0.45)",  text:"#a5b4fc" },
    correct:  { bg:"rgba(88,204,2,0.10)",    border:"rgba(88,204,2,0.45)",    text:"#86efac" },
    wrong:    { bg:"rgba(239,68,68,0.10)",   border:"rgba(239,68,68,0.45)",   text:"#fca5a5" },
  };

  const getStyle = (idx) => {
    if (!checked) return selected === idx ? OPT.selected : OPT.default;
    if (idx === q.correct) return OPT.correct;
    if (idx === selected && !isCorrect) return OPT.wrong;
    return OPT.default;
  };

  return (
    <div style={{ maxWidth:"600px", margin:"0 auto", padding:"20px 16px 60px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"18px" }}>
        <button onClick={() => setView("course")} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:"1.1rem", padding:"4px" }}>✕</button>
        <div style={{ flex:1, height:"7px", background:"rgba(255,255,255,0.07)", borderRadius:"4px", overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${((qIndex + 1) / quiz.length) * 100}%`,
            background:"linear-gradient(90deg,#FFD700,#FF9600)",
            borderRadius:"4px", transition:"width 0.35s ease",
          }} />
        </div>
        <span style={{ color:"#777", fontSize:"0.78rem" }}>{qIndex + 1}/{quiz.length}</span>
      </div>

      <div style={{ fontSize:"0.82rem", color:"#888", marginBottom:"18px" }}>
        🎯 <strong style={{ color:"#FFD700" }}>{t(lang,"quizTime")}</strong> — {section.title}
      </div>

      {/* Question */}
      <div style={{
        background:"#181830", borderRadius:"18px", padding:"24px",
        border:"1px solid rgba(255,255,255,0.07)",
        animation: shake ? "shake 0.5s ease" : "none",
      }}>
        <h3 style={{ fontSize:"1.05rem", color:"#fff", fontWeight:"700", margin:"0 0 20px", lineHeight:1.55 }}>
          {q.question}
        </h3>

        <div style={{ display:"flex", flexDirection:"column", gap:"9px", marginBottom:"18px" }}>
          {q.options.map((opt, idx) => {
            const s = getStyle(idx);
            return (
              <button
                key={idx}
                onClick={() => !checked && setSelected(idx)}
                style={{
                  padding:"13px 14px", background: s.bg,
                  border:`2px solid ${s.border}`,
                  borderRadius:"11px", cursor: checked ? "default" : "pointer",
                  color: s.text, textAlign:"left", fontSize:"0.92rem",
                  fontWeight: selected === idx ? "700" : "400",
                  transition:"background 0.14s, border-color 0.14s",
                  display:"flex", alignItems:"center", gap:"10px",
                }}
              >
                <span style={{
                  width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background:"rgba(255,255,255,0.06)", fontSize:"0.78rem", fontWeight:"800",
                  color: s.text,
                }}>
                  {checked && idx === q.correct ? "✓"
                    : checked && idx === selected && !isCorrect ? "✗"
                    : String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {checked && (
          <div style={{
            background: isCorrect ? "rgba(88,204,2,0.07)" : "rgba(239,68,68,0.07)",
            border:`1px solid ${isCorrect ? "rgba(88,204,2,0.28)" : "rgba(239,68,68,0.28)"}`,
            borderRadius:"11px", padding:"13px 14px", marginBottom:"14px",
          }}>
            <div style={{ fontWeight:"800", color: isCorrect ? "#86efac" : "#fca5a5", marginBottom:"5px", fontSize:"0.9rem" }}>
              {isCorrect ? t(lang,"correctAnswer") : t(lang,"wrongAnswer")}
            </div>
            <div style={{ fontSize:"0.84rem", color:"#bbb", lineHeight:1.5 }}>
              <strong style={{ color:"#888" }}>{t(lang,"explanationLabel")}</strong> {q.explanation}
            </div>
          </div>
        )}

        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            style={{
              width:"100%", padding:"13px",
              background: selected !== null
                ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                : "rgba(255,255,255,0.04)",
              border:"none", borderRadius:"12px",
              cursor: selected !== null ? "pointer" : "not-allowed",
              color:"#fff", fontWeight:"800", fontSize:"0.95rem",
              opacity: selected === null ? 0.45 : 1, transition:"all 0.18s",
            }}
          >
            {selected === null ? t(lang,"selectAnswer") : t(lang,"checkAnswer")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            style={{
              width:"100%", padding:"13px",
              background:"linear-gradient(135deg,#58CC02,#1CB0F6)",
              border:"none", borderRadius:"12px", cursor:"pointer",
              color:"#fff", fontWeight:"800", fontSize:"0.95rem",
              boxShadow:"0 4px 14px rgba(88,204,2,0.28)",
            }}
          >
            {qIndex < quiz.length - 1 ? t(lang,"nextQuestion") : t(lang,"seeResults")}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearnPage() {
  // ── State (initialised from localStorage) ──────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [view,    setViewRaw] = useState("home");

  const [lang,             setLang]             = useState(LANGUAGES[0]);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [courses,          setCourses]          = useState([DEMO_COURSE]);
  const [activeCourse,     setActiveCourse]     = useState(null);
  const [activeSection,    setActiveSection]    = useState(0);
  const [xp,               setXP]               = useState(0);
  const [hearts,           setHearts]           = useState(5);
  const [streak,           setStreak]           = useState(1);
  const [confetti,         setConfetti]         = useState(false);

  // ── Load persisted state on mount ─────────────────────────────────────────
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.courses?.length)    setCourses(saved.courses);
      if (saved.xp   != null)       setXP(saved.xp);
      if (saved.hearts != null)     setHearts(Math.min(5, Math.max(0, saved.hearts)));
      if (saved.langCode) {
        const found = LANGUAGES.find((l) => l.code === saved.langCode);
        if (found) setLang(found);
      }
      // Streak logic
      const today     = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      if (saved.lastVisit === today) {
        setStreak(saved.streak || 1);
      } else if (saved.lastVisit === yesterday) {
        setStreak((saved.streak || 1) + 1);
      } else if (saved.lastVisit) {
        setStreak(1); // missed a day — reset
      }
    }
    setMounted(true);
  }, []);

  // ── Persist state on changes ───────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    saveState({
      courses,
      xp,
      hearts,
      streak,
      langCode:  lang.code,
      lastVisit: new Date().toDateString(),
    });
  }, [mounted, courses, xp, hearts, streak, lang]);

  // ── Heart regen: +1 heart every 30 min (max 5) ────────────────────────────
  useEffect(() => {
    if (hearts >= 5) return;
    const timer = setTimeout(() => setHearts((h) => Math.min(5, h + 1)), 30 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [hearts]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addXP      = useCallback((n)  => setXP((x) => x + n), []);
  const loseHeart  = useCallback(()   => setHearts((h) => Math.max(0, h - 1)), []);
  const addCourse  = useCallback((c)  => setCourses((prev) => [c, ...prev]), []);

  const showDemo   = useCallback(() => {
    setActiveCourse(DEMO_COURSE);
    setActiveSection(0);
    setViewRaw("course");
  }, []);

  const completeSection = useCallback((idx) => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3200);
    addXP(50);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeCourse?.id
          ? { ...c, progress: { ...c.progress, [idx]: true } }
          : c
      )
    );
    setActiveCourse((prev) =>
      prev ? { ...prev, progress: { ...prev.progress, [idx]: true } } : prev
    );
  }, [activeCourse, addXP]);

  // ── View transitions ────────────────────────────────────────────────────────
  const setView = useCallback((newView) => {
    if (newView === "next-lesson") {
      // Advance to the next section's lesson
      setActiveSection((s) => {
        const next = Math.min(s + 1, (activeCourse?.sections?.length || 1) - 1);
        return next;
      });
      setViewRaw("lesson");
      return;
    }
    setViewRaw(newView);
  }, [activeCourse]);

  const handleSetActiveCourse = useCallback((course) => {
    // Always use the latest version from state (so progress is up to date)
    const latest = courses.find((c) => c.id === course.id) || course;
    setActiveCourse(latest);
  }, [courses]);

  const goHome = useCallback(() => {
    setActiveCourse(null);
    setViewRaw("home");
  }, []);

  // Keep activeCourse in sync when courses state updates
  useEffect(() => {
    if (activeCourse) {
      const fresh = courses.find((c) => c.id === activeCourse.id);
      if (fresh) setActiveCourse(fresh);
    }
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null; // prevent SSR hydration mismatch

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.08); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
      `}</style>

      <div
        style={{
          minHeight:"100vh",
          background:"linear-gradient(160deg,#080818 0%,#0d102e 55%,#080d18 100%)",
          color:"#e0e0ff",
          fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",
        }}
        onClick={() => showLangSelector && setShowLangSelector(false)}
      >
        <Confetti active={confetti} />

        <Navbar
          xp={xp} hearts={hearts} streak={streak}
          lang={lang} setLang={setLang}
          showLangSelector={showLangSelector}
          setShowLangSelector={setShowLangSelector}
          setView={setViewRaw}
        />

        <div key={view} style={{ animation:"fadeSlideUp 0.25s ease" }}>
          {view === "home" && (
            <HomeView
              courses={courses} setCourses={setCourses}
              setView={setViewRaw}
              setActiveCourse={(c) => { handleSetActiveCourse(c); setViewRaw("course"); }}
              lang={lang} xp={xp} streak={streak}
            />
          )}
          {view === "upload" && (
            <UploadView
              setView={setViewRaw} addCourse={addCourse}
              lang={lang} showDemo={showDemo}
            />
          )}
          {view === "course" && activeCourse && (
            <CourseView
              course={activeCourse}
              setView={(v) => { if (v === "lesson") setActiveSection(
                courses.find((c)=>c.id===activeCourse.id)
                  ? Object.keys(courses.find((c)=>c.id===activeCourse.id).progress||{}).length
                  : 0
              ); setViewRaw(v); }}
              setActiveSection={setActiveSection}
              lang={lang} goHome={goHome}
            />
          )}
          {view === "lesson" && activeCourse && (
            <LessonView
              course={activeCourse} sectionIndex={activeSection}
              setView={setView} lang={lang}
            />
          )}
          {view === "quiz" && activeCourse && (
            <QuizView
              course={activeCourse} sectionIndex={activeSection}
              setView={setView}
              addXP={addXP} loseHeart={loseHeart}
              lang={lang} completeSection={completeSection}
            />
          )}
        </div>

        <footer style={{
          textAlign:"center", padding:"28px 16px",
          borderTop:"1px solid rgba(255,255,255,0.04)",
          fontSize:"0.72rem", color:"#2a2a4a", marginTop:"60px",
        }}>
          ZappLearn · Powered by Anthropic Claude AI · {LANGUAGES.length} languages supported
        </footer>
      </div>
    </>
  );
}
