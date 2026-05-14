"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Languages ───────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", nativeName: "Bahasa Indonesia" },
  { code: "es", name: "Spanish", flag: "🇪🇸", nativeName: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", nativeName: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", nativeName: "Português" },
  { code: "it", name: "Italian", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", nativeName: "Nederlands" },
  { code: "ru", name: "Russian", flag: "🇷🇺", nativeName: "Русский" },
  { code: "zh", name: "Chinese", flag: "🇨🇳", nativeName: "中文" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", nativeName: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", nativeName: "한국어" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", nativeName: "العربية" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "pl", name: "Polish", flag: "🇵🇱", nativeName: "Polski" },
  { code: "sv", name: "Swedish", flag: "🇸🇪", nativeName: "Svenska" },
  { code: "no", name: "Norwegian", flag: "🇳🇴", nativeName: "Norsk" },
  { code: "da", name: "Danish", flag: "🇩🇰", nativeName: "Dansk" },
  { code: "fi", name: "Finnish", flag: "🇫🇮", nativeName: "Suomi" },
  { code: "th", name: "Thai", flag: "🇹🇭", nativeName: "ภาษาไทย" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", nativeName: "Tiếng Việt" },
  { code: "ms", name: "Malay", flag: "🇲🇾", nativeName: "Bahasa Melayu" },
  { code: "tl", name: "Filipino", flag: "🇵🇭", nativeName: "Filipino" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦", nativeName: "Українська" },
  { code: "ro", name: "Romanian", flag: "🇷🇴", nativeName: "Română" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺", nativeName: "Magyar" },
  { code: "cs", name: "Czech", flag: "🇨🇿", nativeName: "Čeština" },
  { code: "el", name: "Greek", flag: "🇬🇷", nativeName: "Ελληνικά" },
  { code: "he", name: "Hebrew", flag: "🇮🇱", nativeName: "עברית" },
  { code: "sw", name: "Swahili", flag: "🇰🇪", nativeName: "Kiswahili" },
  { code: "fa", name: "Persian", flag: "🇮🇷", nativeName: "فارسی" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", nativeName: "বাংলা" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", nativeName: "اردو" },
];

// ─── UI Text (i18n) ───────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    appName: "ZappLearn", tagline: "Learn Smarter, Not Harder",
    subtitle: "Upload any material and turn it into fun, interactive AI-powered lessons",
    myCourses: "My Courses", newCourse: "+ Create New Course",
    uploadTitle: "Upload Learning Material",
    dropzone: "Drag & drop your file here", dropzoneOr: "or click to browse",
    pasteTitle: "Or paste your content below",
    pastePlaceholder: "Paste your text, notes, article, or any educational content...",
    courseTitleLabel: "Course Title", courseTitlePlaceholder: "e.g. Introduction to Biology",
    generateBtn: "Generate Course ✨", generating: "Creating your personalized course...",
    generatingHint: "AI is turning your material into interactive lessons",
    startLesson: "Start Learning 🚀", continueLesson: "Continue →",
    next: "Next →", checkAnswer: "Check Answer",
    correct: "Correct! 🎉", wrong: "Oops! Not quite 😅",
    sectionComplete: "Section Complete! 🏆", courseComplete: "Course Complete! 🎓",
    xpEarned: "XP Earned", keepGoing: "Keep Going!", backHome: "← Back to Home",
    hearts: "Hearts", streak: "Streak", xp: "XP", quizTime: "Quiz Time! 🎯",
    lesson: "Lesson", section: "Section", progress: "Progress",
    explanation: "Explanation", story: "Story", example: "Example",
    tip: "Pro Tip", visual: "Visual Aid", chooseLanguage: "Choose Language",
    filesSupported: "Supported: .txt .md .js .py .html .json .csv",
    noCourses: "No courses yet — create your first one!",
    back: "← Back", of: "of", selectAnswer: "Select an answer",
    wrongAnswer: "Wrong answer! -1 ❤️", correctAnswer: "Correct! +10 XP ⭐",
    explanationLabel: "Why:", nextQuestion: "Next Question →",
    seeResults: "See Results 🏅", tryAgain: "Try Again",
    perfectScore: "Perfect Score! 🌟", greatJob: "Great Job! 💪",
    keepPracticing: "Keep Practicing! 📚", questionsCorrect: "correct",
    visualLabel: "💡 Imagine:", highlightLabel: "🔑 Key Point:",
    demoMode: "Demo Mode (no API key needed)",
    tryDemo: "Try Demo Course",
    apiKeyMissing: "Set ANTHROPIC_API_KEY to enable AI generation",
    sections: "sections", cards: "cards",
    completedSections: "sections completed",
  },
  id: {
    appName: "ZappLearn", tagline: "Belajar Lebih Cerdas",
    subtitle: "Upload materi apapun dan jadikan pelajaran interaktif bertenaga AI",
    myCourses: "Kursus Saya", newCourse: "+ Buat Kursus Baru",
    uploadTitle: "Upload Materi Pembelajaran",
    dropzone: "Seret & lepas file Anda di sini", dropzoneOr: "atau klik untuk memilih",
    pasteTitle: "Atau tempel konten Anda di bawah",
    pastePlaceholder: "Tempel teks, catatan, artikel, atau konten pendidikan apapun...",
    courseTitleLabel: "Judul Kursus", courseTitlePlaceholder: "mis. Pengenalan Biologi",
    generateBtn: "Buat Kursus ✨", generating: "Membuat kursus personal Anda...",
    generatingHint: "AI sedang mengubah materi Anda menjadi pelajaran interaktif",
    startLesson: "Mulai Belajar 🚀", continueLesson: "Lanjutkan →",
    next: "Lanjut →", checkAnswer: "Periksa Jawaban",
    correct: "Benar! 🎉", wrong: "Ups! Belum tepat 😅",
    sectionComplete: "Bagian Selesai! 🏆", courseComplete: "Kursus Selesai! 🎓",
    xpEarned: "XP Diperoleh", keepGoing: "Terus Semangat!", backHome: "← Kembali ke Beranda",
    hearts: "Nyawa", streak: "Hari", xp: "XP", quizTime: "Kuis! 🎯",
    lesson: "Pelajaran", section: "Bagian", progress: "Kemajuan",
    explanation: "Penjelasan", story: "Cerita", example: "Contoh",
    tip: "Tips Pro", visual: "Bantuan Visual", chooseLanguage: "Pilih Bahasa",
    filesSupported: "Didukung: .txt .md .js .py .html .json .csv",
    noCourses: "Belum ada kursus — buat yang pertama!",
    back: "← Kembali", of: "dari", selectAnswer: "Pilih jawaban",
    wrongAnswer: "Jawaban salah! -1 ❤️", correctAnswer: "Benar! +10 XP ⭐",
    explanationLabel: "Kenapa:", nextQuestion: "Pertanyaan Berikut →",
    seeResults: "Lihat Hasil 🏅", tryAgain: "Coba Lagi",
    perfectScore: "Nilai Sempurna! 🌟", greatJob: "Kerja Bagus! 💪",
    keepPracticing: "Terus Berlatih! 📚", questionsCorrect: "benar",
    visualLabel: "💡 Bayangkan:", highlightLabel: "🔑 Poin Utama:",
    demoMode: "Mode Demo (tanpa API key)",
    tryDemo: "Coba Kursus Demo",
    apiKeyMissing: "Atur ANTHROPIC_API_KEY untuk mengaktifkan AI",
    sections: "bagian", cards: "kartu",
    completedSections: "bagian selesai",
  },
};

const t = (lang, key) => {
  const c = lang?.code || "en";
  return (TRANSLATIONS[c]?.[key]) ?? (TRANSLATIONS.en[key]) ?? key;
};

// ─── Demo Course ──────────────────────────────────────────────────────────────
const DEMO_COURSE = {
  id: "demo",
  courseTitle: "Introduction to Programming",
  courseDescription: "Learn the fundamentals of programming through fun stories and interactive quizzes!",
  emoji: "💻",
  color: "#6366f1",
  createdAt: new Date().toISOString(),
  progress: {},
  sections: [
    {
      id: 1,
      title: "What is Programming?",
      cards: [
        {
          id: 1, type: "story", emoji: "🧑‍🍳",
          title: "The Recipe Analogy",
          content: "Imagine you want to bake a perfect cake. You follow a recipe — step by step instructions that tell you exactly what to do. Programming is exactly the same! A program is a recipe for your computer, telling it precisely what steps to perform.",
          highlight: "A program = a recipe for your computer",
          visual: "A chef reading a recipe book next to a computer displaying code",
        },
        {
          id: 2, type: "explanation", emoji: "🤖",
          title: "What is a Computer Program?",
          content: "A computer program is a set of instructions written in a language the computer understands. These instructions tell the computer what to do — from simple math calculations to displaying beautiful websites.",
          highlight: "Instructions the computer understands",
          visual: "An arrow from a text file labeled 'Code' pointing to a computer screen showing a result",
        },
        {
          id: 3, type: "example", emoji: "💡",
          title: "Real-World Examples",
          content: "Every app you use is a program! WhatsApp, YouTube, TikTok — they are all programs written by developers. When you tap a button, the program receives your instruction and responds accordingly.",
          highlight: "Every app = a program",
          visual: "Icons of popular apps arranged around a central 'code' symbol",
        },
        {
          id: 4, type: "tip", emoji: "⚡",
          title: "Programming Languages",
          content: "Just like humans speak English, Spanish or Mandarin, programmers write in languages like Python, JavaScript or Java. Each language has its own style, but they all give instructions to computers. Python is great for beginners — it reads almost like English!",
          highlight: "Python is perfect for beginners",
          visual: "Country flags next to programming language logos (Python snake 🐍, Java coffee ☕)",
        },
      ],
      quiz: [
        {
          id: 1,
          question: "What is a computer program?",
          options: ["A type of computer hardware", "A set of instructions for a computer", "A brand of laptop", "An internet browser"],
          correct: 1,
          explanation: "A computer program is a set of step-by-step instructions that tell a computer exactly what to do, just like a recipe tells a chef how to cook.",
        },
        {
          id: 2,
          question: "Which of these is a good beginner programming language?",
          options: ["Assembly", "C++", "Python", "Machine Code"],
          correct: 2,
          explanation: "Python is widely recommended for beginners because its syntax is clean and reads almost like plain English, making it easier to learn.",
        },
        {
          id: 3,
          question: "WhatsApp and YouTube are examples of:",
          options: ["Computer hardware", "Operating systems", "Computer programs", "Internet cables"],
          correct: 2,
          explanation: "Every app you use on your phone or computer is a program written by developers using programming languages.",
        },
      ],
    },
    {
      id: 2,
      title: "Variables & Data",
      cards: [
        {
          id: 1, type: "story", emoji: "📦",
          title: "The Magic Box",
          content: "Picture a magic box where you can store anything — a number, a name, even a photo. In programming, we call these boxes 'variables'. You give the box a name, put something inside, and whenever you need it, just call the name!",
          highlight: "Variables are named boxes for storing data",
          visual: "Colorful labeled boxes on a shelf, each containing different items (number, text, image)",
        },
        {
          id: 2, type: "explanation", emoji: "🏷️",
          title: "How Variables Work",
          content: "A variable has two parts: a name (like 'age' or 'username') and a value (like 25 or 'Maria'). You can change the value anytime! That's why they're called 'vari-ables' — the value can vary.",
          highlight: "name = value, and value can change",
          visual: "A labeled jar with 'age = 25' written on it, with an arrow showing it can change to 26",
        },
        {
          id: 3, type: "example", emoji: "🎮",
          title: "Variables in Games",
          content: "In a video game, variables track everything: your score (score = 100), your character name (player = 'HeroZ'), your health (health = 3). Every time you collect a coin, the program does: score = score + 10!",
          highlight: "score = score + 10 (real code!)",
          visual: "A game screen showing score counter, health bar, and player name — all labeled as variables",
        },
        {
          id: 4, type: "tip", emoji: "✨",
          title: "Naming Variables Well",
          content: "Great variable names describe what they store. Use 'studentAge' instead of 'x', or 'totalPrice' instead of 'tp'. Good names make code readable and save you headaches when you revisit your code later!",
          highlight: "Name variables to describe their purpose",
          visual: "Two columns: 'Bad names' (x, a, z) vs 'Good names' (userName, totalScore, isLoggedIn)",
        },
      ],
      quiz: [
        {
          id: 1,
          question: "What is a variable in programming?",
          options: ["A type of computer virus", "A named storage container for data", "A programming language", "A type of loop"],
          correct: 1,
          explanation: "A variable is like a named box that stores data. You give it a name and put a value inside, which you can read or change later.",
        },
        {
          id: 2,
          question: "In a game, if score = 50 and you collect a coin (+10), what is the new score?",
          options: ["50", "10", "60", "5010"],
          correct: 2,
          explanation: "score = score + 10 means 50 + 10 = 60. Variables can be updated by performing calculations on their current value.",
        },
        {
          id: 3,
          question: "Which is the BEST variable name for storing a user's age?",
          options: ["x", "a", "userAge", "variable1"],
          correct: 2,
          explanation: "userAge is descriptive — it tells exactly what data is stored. Good variable names make code easier to read and maintain.",
        },
        {
          id: 4,
          question: "Can a variable's value be changed after it is created?",
          options: ["No, never", "Only once", "Yes, anytime", "Only by the computer"],
          correct: 2,
          explanation: "Variables are designed to hold values that can change — that's why they're called 'variables'! You can update them as many times as needed.",
        },
      ],
    },
  ],
};

// ─── Card type config ─────────────────────────────────────────────────────────
const CARD_CONFIG = {
  story:       { gradient: "linear-gradient(135deg, #7c3aed, #4f46e5)", icon: "📖", label: "Story" },
  explanation: { gradient: "linear-gradient(135deg, #1d4ed8, #0891b2)", icon: "📚", label: "Explanation" },
  example:     { gradient: "linear-gradient(135deg, #065f46, #0d9488)", icon: "💡", label: "Example" },
  tip:         { gradient: "linear-gradient(135deg, #b45309, #d97706)", icon: "⚡", label: "Tip" },
  visual:      { gradient: "linear-gradient(135deg, #be123c, #e11d48)", icon: "🎨", label: "Visual" },
};

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const colors = ["#58CC02", "#FFD700", "#CE82FF", "#FF4B4B", "#1CB0F6", "#FF9600"];
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {Array.from({ length: 60 }).map((_, i) => {
        const style = {
          position: "absolute",
          width: `${6 + Math.random() * 10}px`,
          height: `${6 + Math.random() * 10}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          left: `${Math.random() * 100}%`,
          top: "-20px",
          animation: `confettiFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 0.8}s forwards`,
          transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ xp, hearts, streak, lang, setLang, showLangSelector, setShowLangSelector, setView }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,30,0.95)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "0 20px", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <button onClick={() => setView("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "1.3rem", fontWeight: "800", color: "#fff",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{ fontSize: "1.5rem" }}>🧠</span>
        <span style={{ background: "linear-gradient(90deg,#58CC02,#1CB0F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ZappLearn
        </span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Hearts */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.1rem", opacity: i < hearts ? 1 : 0.25 }}>❤️</span>
          ))}
        </div>
        {/* XP */}
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)",
          borderRadius: "20px", padding: "4px 12px",
        }}>
          <span>⚡</span>
          <span style={{ color: "#FFD700", fontWeight: "700", fontSize: "0.9rem" }}>{xp} {t(lang, "xp")}</span>
        </div>
        {/* Streak */}
        <div style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(255,150,0,0.12)", border: "1px solid rgba(255,150,0,0.3)",
          borderRadius: "20px", padding: "4px 12px",
        }}>
          <span>🔥</span>
          <span style={{ color: "#FF9600", fontWeight: "700", fontSize: "0.9rem" }}>{streak}</span>
        </div>

        {/* Language Selector */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowLangSelector(!showLangSelector)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px", padding: "5px 12px", cursor: "pointer", color: "#fff",
            fontSize: "0.85rem", fontWeight: "600",
          }}>
            <span>{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
            <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>▼</span>
          </button>

          {showLangSelector && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              background: "#1a1a3e", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "16px", padding: "8px", width: "260px", maxHeight: "380px",
              overflowY: "auto", zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontSize: "0.75rem", color: "#888", padding: "4px 8px 8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                {t(lang, "chooseLanguage")}
              </div>
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => { setLang(l); setShowLangSelector(false); }} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "8px 10px", background: lang.code === l.code ? "rgba(88,204,2,0.15)" : "transparent",
                  border: "none", borderRadius: "8px", cursor: "pointer", color: "#fff",
                  fontSize: "0.85rem", textAlign: "left",
                  transition: "background 0.15s",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{l.flag}</span>
                  <div>
                    <div style={{ fontWeight: lang.code === l.code ? "700" : "400" }}>{l.nativeName}</div>
                    <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{l.name}</div>
                  </div>
                  {lang.code === l.code && <span style={{ marginLeft: "auto", color: "#58CC02" }}>✓</span>}
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
function HomeView({ courses, setView, setActiveCourse, lang, xp, streak }) {
  const totalSections = courses.reduce((acc, c) => acc + (c.sections?.length || 0), 0);
  const completedSections = courses.reduce((acc, c) => acc + Object.values(c.progress || {}).filter(Boolean).length, 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Hero */}
      <div style={{
        textAlign: "center", marginBottom: "48px",
        background: "linear-gradient(135deg, rgba(88,204,2,0.08), rgba(28,176,246,0.08))",
        borderRadius: "24px", padding: "48px 24px",
        border: "1px solid rgba(88,204,2,0.15)",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🧠✨</div>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", margin: "0 0 12px",
          background: "linear-gradient(90deg,#58CC02,#1CB0F6,#CE82FF)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {t(lang, "tagline")}
        </h1>
        <p style={{ fontSize: "1rem", color: "#aaa", margin: "0 0 32px", maxWidth: "500px", marginInline: "auto" }}>
          {t(lang, "subtitle")}
        </p>
        <button onClick={() => setView("upload")} style={{
          background: "linear-gradient(135deg, #58CC02, #1CB0F6)",
          border: "none", color: "#fff", padding: "14px 32px",
          borderRadius: "50px", fontSize: "1rem", fontWeight: "800",
          cursor: "pointer", letterSpacing: "0.5px",
          boxShadow: "0 4px 20px rgba(88,204,2,0.4)",
          transition: "transform 0.1s, box-shadow 0.1s",
        }}>
          {t(lang, "newCourse")}
        </button>
      </div>

      {/* Stats bar */}
      {courses.length > 0 && (
        <div style={{
          display: "flex", gap: "16px", marginBottom: "32px",
          flexWrap: "wrap",
        }}>
          {[
            { label: "Courses", value: courses.length, icon: "📚", color: "#6366f1" },
            { label: "Sections done", value: `${completedSections}/${totalSections}`, icon: "✅", color: "#58CC02" },
            { label: t(lang, "xp"), value: xp, icon: "⚡", color: "#FFD700" },
            { label: t(lang, "streak"), value: streak, icon: "🔥", color: "#FF9600" },
          ].map((s) => (
            <div key={s.label} style={{
              flex: "1 1 120px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
              padding: "16px", textAlign: "center",
            }}>
              <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#666" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Courses grid */}
      <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px", color: "#ddd" }}>
        {t(lang, "myCourses")}
      </h2>

      {courses.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "rgba(255,255,255,0.02)", borderRadius: "20px",
          border: "2px dashed rgba(255,255,255,0.1)",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "#666", marginBottom: "24px" }}>{t(lang, "noCourses")}</p>
          <button onClick={() => setView("upload")} style={{
            background: "rgba(88,204,2,0.12)", border: "1px solid rgba(88,204,2,0.4)",
            color: "#58CC02", padding: "10px 24px", borderRadius: "50px",
            cursor: "pointer", fontWeight: "600", fontSize: "0.9rem",
          }}>
            {t(lang, "tryDemo")}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {courses.map((course) => {
            const total = course.sections?.length || 0;
            const done = Object.values(course.progress || {}).filter(Boolean).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <button key={course.id} onClick={() => { setActiveCourse(course); setView("course"); }} style={{
                background: `linear-gradient(135deg, ${course.color}22, ${course.color}11)`,
                border: `1px solid ${course.color}44`,
                borderRadius: "20px", padding: "24px", cursor: "pointer",
                textAlign: "left", color: "#fff",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{course.emoji}</div>
                <div style={{ fontWeight: "800", fontSize: "1rem", marginBottom: "6px", lineHeight: "1.3" }}>
                  {course.courseTitle}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "14px", lineHeight: "1.4" }}>
                  {course.courseDescription?.slice(0, 80)}...
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "8px" }}>
                  {course.sections?.length || 0} {t(lang, "sections")} • {pct}% done
                </div>
                {/* Progress bar */}
                <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: `linear-gradient(90deg, ${course.color}, ${course.color}aa)`,
                    borderRadius: "3px", transition: "width 0.5s ease",
                  }} />
                </div>
              </button>
            );
          })}
          {/* Add new course button */}
          <button onClick={() => setView("upload")} style={{
            background: "rgba(255,255,255,0.02)", border: "2px dashed rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "24px", cursor: "pointer",
            color: "#666", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "8px",
            minHeight: "160px", transition: "border-color 0.2s, color 0.2s",
            fontSize: "0.9rem",
          }}>
            <span style={{ fontSize: "2rem" }}>➕</span>
            <span>{t(lang, "newCourse")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Upload View ──────────────────────────────────────────────────────────────
function UploadView({ setView, addCourse, lang, loadDemo }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatingStep, setGeneratingStep] = useState(0);
  const fileInputRef = useRef(null);

  const steps = ["Analyzing your material...", "Structuring lessons...", "Crafting stories & examples...", "Building quiz questions...", "Finalizing your course..."];

  const handleFile = (file) => {
    if (!file) return;
    const allowed = [".txt", ".md", ".js", ".py", ".html", ".json", ".csv", ".ts", ".tsx", ".jsx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError("File type not supported. Please use .txt, .md, .js, .py, .html, .json or .csv");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target.result);
    reader.readAsText(file);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleGenerate = async () => {
    if (!content.trim() || content.trim().length < 30) {
      setError("Please provide more content (at least 30 characters).");
      return;
    }
    setError("");
    setIsGenerating(true);
    setGeneratingStep(0);

    const stepInterval = setInterval(() => {
      setGeneratingStep((s) => Math.min(s + 1, steps.length - 1));
    }, 2000);

    try {
      const res = await fetch("/api/learn/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, language: lang.name, title }),
      });
      const data = await res.json();
      clearInterval(stepInterval);

      if (!data.success) throw new Error(data.error || "Generation failed");
      addCourse(data.course);
      setView("home");
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "24px", animation: "pulse 1.5s ease-in-out infinite" }}>🧠</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "8px", color: "#fff" }}>
          {t(lang, "generating")}
        </h2>
        <p style={{ color: "#888", marginBottom: "32px" }}>{t(lang, "generatingHint")}</p>
        <div style={{
          background: "rgba(255,255,255,0.04)", borderRadius: "16px",
          padding: "24px", marginBottom: "24px",
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "8px 0", opacity: i <= generatingStep ? 1 : 0.25,
              transition: "opacity 0.5s",
            }}>
              <span style={{ fontSize: "1.1rem" }}>
                {i < generatingStep ? "✅" : i === generatingStep ? "⏳" : "⭕"}
              </span>
              <span style={{ color: i <= generatingStep ? "#fff" : "#555", fontSize: "0.9rem" }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%", background: "linear-gradient(90deg,#58CC02,#1CB0F6)",
            borderRadius: "2px", transition: "width 2s ease",
            width: `${((generatingStep + 1) / steps.length) * 100}%`,
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px" }}>
      <button onClick={() => setView("home")} style={{
        background: "none", border: "none", color: "#888", cursor: "pointer",
        fontSize: "0.9rem", marginBottom: "24px", padding: 0,
      }}>
        {t(lang, "back")}
      </button>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px", color: "#fff" }}>
        {t(lang, "uploadTitle")} ✨
      </h1>
      <p style={{ color: "#888", marginBottom: "32px", fontSize: "0.9rem" }}>
        {t(lang, "generatingHint")}
      </p>

      {/* Course title */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#bbb", marginBottom: "8px" }}>
          {t(lang, "courseTitleLabel")}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(lang, "courseTitlePlaceholder")}
          style={{
            width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px",
            color: "#fff", fontSize: "1rem", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* File drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? "#58CC02" : "rgba(255,255,255,0.15)"}`,
          borderRadius: "20px", padding: "40px 24px", textAlign: "center",
          cursor: "pointer", marginBottom: "24px",
          background: isDragging ? "rgba(88,204,2,0.06)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s",
        }}
      >
        <input ref={fileInputRef} type="file" accept=".txt,.md,.js,.py,.html,.json,.csv,.ts,.tsx,.jsx" onChange={(e) => handleFile(e.target.files[0])} style={{ display: "none" }} />
        {fileName ? (
          <>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📄</div>
            <div style={{ color: "#58CC02", fontWeight: "700", marginBottom: "4px" }}>{fileName}</div>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>File loaded — {content.length.toLocaleString()} characters</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📂</div>
            <div style={{ color: "#ddd", fontWeight: "600", marginBottom: "4px" }}>{t(lang, "dropzone")}</div>
            <div style={{ color: "#888", fontSize: "0.85rem", marginBottom: "4px" }}>{t(lang, "dropzoneOr")}</div>
            <div style={{ color: "#555", fontSize: "0.75rem" }}>{t(lang, "filesSupported")}</div>
          </>
        )}
      </div>

      {/* Text paste area */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#bbb", marginBottom: "8px" }}>
          {t(lang, "pasteTitle")}
        </label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setFileName(""); }}
          placeholder={t(lang, "pastePlaceholder")}
          rows={10}
          style={{
            width: "100%", padding: "14px 16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "16px", color: "#ddd", fontSize: "0.9rem",
            resize: "vertical", outline: "none", lineHeight: "1.6",
            fontFamily: "inherit", boxSizing: "border-box",
          }}
        />
        <div style={{ fontSize: "0.75rem", color: "#555", marginTop: "4px", textAlign: "right" }}>
          {content.length.toLocaleString()} characters
        </div>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "12px", padding: "12px 16px", color: "#f87171",
          fontSize: "0.85rem", marginBottom: "16px",
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={handleGenerate}
          disabled={!content.trim()}
          style={{
            flex: "1 1 200px", padding: "14px 24px",
            background: content.trim() ? "linear-gradient(135deg, #58CC02, #1CB0F6)" : "rgba(255,255,255,0.08)",
            border: "none", borderRadius: "50px", cursor: content.trim() ? "pointer" : "not-allowed",
            color: "#fff", fontWeight: "800", fontSize: "1rem",
            boxShadow: content.trim() ? "0 4px 20px rgba(88,204,2,0.35)" : "none",
            transition: "all 0.2s",
          }}
        >
          {t(lang, "generateBtn")}
        </button>
        <button onClick={loadDemo} style={{
          padding: "14px 20px", background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.4)", borderRadius: "50px",
          cursor: "pointer", color: "#a5b4fc", fontWeight: "600", fontSize: "0.9rem",
        }}>
          {t(lang, "tryDemo")}
        </button>
      </div>

      <p style={{ fontSize: "0.75rem", color: "#555", marginTop: "12px", textAlign: "center" }}>
        {t(lang, "apiKeyMissing")}
      </p>
    </div>
  );
}

// ─── Course Overview ──────────────────────────────────────────────────────────
function CourseView({ course, setView, setActiveSection, lang, setActiveCourse }) {
  const total = course.sections?.length || 0;
  const done = Object.values(course.progress || {}).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
      <button onClick={() => { setView("home"); setActiveCourse(null); }} style={{
        background: "none", border: "none", color: "#888", cursor: "pointer",
        fontSize: "0.9rem", marginBottom: "24px", padding: 0,
      }}>
        {t(lang, "back")}
      </button>

      {/* Course header */}
      <div style={{
        background: `linear-gradient(135deg, ${course.color}22, ${course.color}11)`,
        border: `1px solid ${course.color}33`,
        borderRadius: "24px", padding: "32px", marginBottom: "32px", textAlign: "center",
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "12px" }}>{course.emoji}</div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: "900", margin: "0 0 8px", color: "#fff" }}>
          {course.courseTitle}
        </h1>
        <p style={{ color: "#aaa", margin: "0 0 20px", fontSize: "0.9rem" }}>
          {course.courseDescription}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
          <div style={{ height: "8px", flex: 1, maxWidth: "200px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${course.color}, #1CB0F6)`, borderRadius: "4px", transition: "width 0.5s" }} />
          </div>
          <span style={{ color: course.color, fontWeight: "700" }}>{pct}%</span>
        </div>
      </div>

      {/* Sections list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {course.sections?.map((section, idx) => {
          const isComplete = course.progress?.[idx];
          const isUnlocked = idx === 0 || course.progress?.[idx - 1];
          return (
            <button key={section.id} onClick={() => { if (isUnlocked) { setActiveSection(idx); setView("lesson"); } }} style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "18px 20px",
              background: isComplete ? "rgba(88,204,2,0.08)" : isUnlocked ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isComplete ? "rgba(88,204,2,0.25)" : isUnlocked ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"}`,
              borderRadius: "16px", cursor: isUnlocked ? "pointer" : "not-allowed",
              color: isUnlocked ? "#fff" : "#444", textAlign: "left",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isComplete ? "rgba(88,204,2,0.2)" : isUnlocked ? `${course.color}22` : "rgba(255,255,255,0.04)",
                border: `2px solid ${isComplete ? "#58CC02" : isUnlocked ? course.color : "rgba(255,255,255,0.08)"}`,
                fontSize: "1.1rem",
              }}>
                {isComplete ? "✅" : isUnlocked ? idx + 1 : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", marginBottom: "3px" }}>
                  {t(lang, "section")} {idx + 1}: {section.title}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {section.cards?.length || 0} {t(lang, "cards")} + quiz
                  {isComplete && <span style={{ color: "#58CC02", marginLeft: "8px" }}>✓ Done</span>}
                </div>
              </div>
              {isUnlocked && <span style={{ color: isComplete ? "#58CC02" : "#888", fontSize: "1.2rem" }}>→</span>}
            </button>
          );
        })}
      </div>

      {done === total && total > 0 && (
        <div style={{
          marginTop: "32px", textAlign: "center", padding: "24px",
          background: "linear-gradient(135deg, rgba(88,204,2,0.1), rgba(28,176,246,0.1))",
          borderRadius: "20px", border: "1px solid rgba(88,204,2,0.25)",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🎓</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#58CC02" }}>
            {t(lang, "courseComplete")}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lesson View ──────────────────────────────────────────────────────────────
function LessonView({ course, sectionIndex, setView, setActiveSection, addXP, lang }) {
  const section = course.sections?.[sectionIndex];
  const [cardIndex, setCardIndex] = useState(0);
  const [entering, setEntering] = useState(false);

  if (!section) return null;
  const cards = section.cards || [];
  const card = cards[cardIndex];
  const cfg = CARD_CONFIG[card?.type] || CARD_CONFIG.explanation;
  const progress = ((cardIndex + 1) / cards.length) * 100;

  const nextCard = () => {
    if (cardIndex < cards.length - 1) {
      setEntering(true);
      setTimeout(() => { setCardIndex((i) => i + 1); setEntering(false); }, 200);
    } else {
      setView("quiz");
    }
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "20px" }}>
      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => setView("course")} style={{
          background: "none", border: "none", color: "#888", cursor: "pointer",
          fontSize: "1.2rem", padding: "4px",
        }}>✕</button>
        <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #58CC02, #1CB0F6)",
            borderRadius: "4px", transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{ color: "#888", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {cardIndex + 1} {t(lang, "of")} {cards.length}
        </span>
      </div>

      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "16px" }}>
        {t(lang, "section")} {sectionIndex + 1}: <strong style={{ color: "#ddd" }}>{section.title}</strong>
      </div>

      {/* Card */}
      {card && (
        <div style={{
          borderRadius: "24px", overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          opacity: entering ? 0 : 1, transform: entering ? "translateX(30px)" : "translateX(0)",
          transition: "opacity 0.2s, transform 0.2s",
        }}>
          {/* Card header */}
          <div style={{ background: cfg.gradient, padding: "28px 28px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "1rem" }}>{cfg.icon}</span>
              <span style={{
                background: "rgba(255,255,255,0.2)", padding: "3px 10px",
                borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700",
                color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>
                {t(lang, card.type) || cfg.label}
              </span>
            </div>
            <div style={{ fontSize: "4rem", marginBottom: "12px", textAlign: "center" }}>{card.emoji}</div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "800", color: "#fff", textAlign: "center" }}>
              {card.title}
            </h2>
          </div>

          {/* Card body */}
          <div style={{ background: "#1a1a3e", padding: "28px" }}>
            <p style={{ color: "#ddd", fontSize: "1rem", lineHeight: "1.7", margin: "0 0 20px" }}>
              {card.content}
            </p>

            {/* Key highlight */}
            {card.highlight && (
              <div style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px", padding: "12px 16px", marginBottom: "16px",
              }}>
                <span style={{ fontSize: "0.75rem", color: "#888", display: "block", marginBottom: "4px" }}>
                  {t(lang, "highlightLabel")}
                </span>
                <strong style={{ color: "#FFD700", fontSize: "0.95rem" }}>{card.highlight}</strong>
              </div>
            )}

            {/* Visual description */}
            {card.visual && (
              <div style={{
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "12px", padding: "12px 16px", marginBottom: "20px",
              }}>
                <span style={{ fontSize: "0.75rem", color: "#888", display: "block", marginBottom: "4px" }}>
                  {t(lang, "visualLabel")}
                </span>
                <span style={{ color: "#a5b4fc", fontSize: "0.88rem", fontStyle: "italic" }}>{card.visual}</span>
              </div>
            )}

            <button onClick={nextCard} style={{
              width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #58CC02, #0d9488)",
              border: "none", borderRadius: "14px", cursor: "pointer",
              color: "#fff", fontWeight: "800", fontSize: "1rem",
              boxShadow: "0 4px 16px rgba(88,204,2,0.3)",
              transition: "transform 0.1s",
            }}>
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
  const quiz = section?.quiz || [];
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);

  if (!section || quiz.length === 0) {
    completeSection(sectionIndex);
    setView("section-complete");
    return null;
  }

  const q = quiz[qIndex];
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
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleNext = () => {
    if (qIndex < quiz.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setShowResult(true);
      completeSection(sectionIndex);
    }
  };

  if (showResult) {
    const pct = Math.round((score / quiz.length) * 100);
    const isNextSection = sectionIndex < (course.sections?.length || 0) - 1;
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>
          {pct === 100 ? "🌟" : pct >= 70 ? "🏆" : "📚"}
        </div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "8px", color: "#fff" }}>
          {pct === 100 ? t(lang, "perfectScore") : pct >= 70 ? t(lang, "greatJob") : t(lang, "keepPracticing")}
        </h2>
        <p style={{ color: "#aaa", marginBottom: "32px" }}>
          {score}/{quiz.length} {t(lang, "questionsCorrect")} — {pct}%
        </p>
        <div style={{
          display: "flex", gap: "16px", justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {isNextSection && (
            <button onClick={() => {
              setView("lesson");
              // Parent will update sectionIndex via completeSection callback
            }} style={{
              padding: "14px 28px", background: "linear-gradient(135deg,#58CC02,#1CB0F6)",
              border: "none", borderRadius: "50px", cursor: "pointer",
              color: "#fff", fontWeight: "800", fontSize: "0.95rem",
            }}>
              {t(lang, "keepGoing")} →
            </button>
          )}
          <button onClick={() => setView("course")} style={{
            padding: "14px 28px", background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50px",
            cursor: "pointer", color: "#ddd", fontWeight: "600", fontSize: "0.9rem",
          }}>
            {t(lang, "backHome")}
          </button>
        </div>
      </div>
    );
  }

  const optionColors = {
    default: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "#ddd" },
    selected: { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.5)", text: "#a5b4fc" },
    correct: { bg: "rgba(88,204,2,0.12)", border: "rgba(88,204,2,0.5)", text: "#86efac" },
    wrong: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.5)", text: "#fca5a5" },
  };

  const getOptStyle = (idx) => {
    if (!checked) return selected === idx ? optionColors.selected : optionColors.default;
    if (idx === q.correct) return optionColors.correct;
    if (idx === selected && !isCorrect) return optionColors.wrong;
    return optionColors.default;
  };

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", padding: "20px" }}>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => setView("course")} style={{
          background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "1.2rem", padding: "4px",
        }}>✕</button>
        <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${((qIndex + 1) / quiz.length) * 100}%`,
            background: "linear-gradient(90deg,#FFD700,#FF9600)",
            borderRadius: "4px", transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{ color: "#888", fontSize: "0.8rem" }}>{qIndex + 1}/{quiz.length}</span>
      </div>

      <div style={{ fontSize: "0.85rem", color: "#888", marginBottom: "20px" }}>
        🎯 <strong style={{ color: "#FFD700" }}>{t(lang, "quizTime")}</strong> — {section.title}
      </div>

      {/* Question card */}
      <div style={{
        background: "#1a1a3e", borderRadius: "20px", padding: "28px",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: shake ? "shake 0.5s ease" : "none",
      }}>
        <h3 style={{ fontSize: "1.1rem", color: "#fff", fontWeight: "700", margin: "0 0 24px", lineHeight: "1.5" }}>
          {q.question}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {q.options.map((opt, idx) => {
            const st = getOptStyle(idx);
            return (
              <button key={idx} onClick={() => !checked && setSelected(idx)} style={{
                padding: "14px 16px", background: st.bg,
                border: `2px solid ${st.border}`,
                borderRadius: "12px", cursor: checked ? "default" : "pointer",
                color: st.text, textAlign: "left", fontSize: "0.95rem",
                fontWeight: selected === idx ? "700" : "400",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.07)", fontSize: "0.8rem", fontWeight: "700",
                }}>
                  {checked && idx === q.correct ? "✓" : checked && idx === selected && !isCorrect ? "✗" : String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation (after check) */}
        {checked && (
          <div style={{
            background: isCorrect ? "rgba(88,204,2,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${isCorrect ? "rgba(88,204,2,0.3)" : "rgba(239,68,68,0.3)"}`,
            borderRadius: "12px", padding: "14px 16px", marginBottom: "16px",
          }}>
            <div style={{ fontWeight: "800", color: isCorrect ? "#86efac" : "#fca5a5", marginBottom: "6px" }}>
              {isCorrect ? t(lang, "correctAnswer") : t(lang, "wrongAnswer")}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#bbb" }}>
              <strong style={{ color: "#aaa" }}>{t(lang, "explanationLabel")}</strong> {q.explanation}
            </div>
          </div>
        )}

        {!checked ? (
          <button onClick={handleCheck} disabled={selected === null} style={{
            width: "100%", padding: "14px",
            background: selected !== null ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
            border: "none", borderRadius: "14px", cursor: selected !== null ? "pointer" : "not-allowed",
            color: "#fff", fontWeight: "800", fontSize: "1rem",
            opacity: selected === null ? 0.5 : 1, transition: "all 0.2s",
          }}>
            {selected === null ? t(lang, "selectAnswer") : t(lang, "checkAnswer")}
          </button>
        ) : (
          <button onClick={handleNext} style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg,#58CC02,#1CB0F6)",
            border: "none", borderRadius: "14px", cursor: "pointer",
            color: "#fff", fontWeight: "800", fontSize: "1rem",
            boxShadow: "0 4px 16px rgba(88,204,2,0.3)",
          }}>
            {qIndex < quiz.length - 1 ? t(lang, "nextQuestion") : t(lang, "seeResults")}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearnPage() {
  const [view, setView] = useState("home");
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [courses, setCourses] = useState([DEMO_COURSE]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [xp, setXP] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak] = useState(1);
  const [confetti, setConfetti] = useState(false);

  const addXP = useCallback((amount) => setXP((x) => x + amount), []);
  const loseHeart = useCallback(() => setHearts((h) => Math.max(0, h - 1)), []);

  const addCourse = useCallback((course) => {
    setCourses((prev) => [...prev, course]);
  }, []);

  const loadDemo = useCallback(() => {
    setActiveCourse(DEMO_COURSE);
    setActiveSection(0);
    setView("course");
  }, []);

  const completeSection = useCallback((idx) => {
    if (!activeCourse) return;
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
    addXP(50);
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeCourse.id
          ? { ...c, progress: { ...c.progress, [idx]: true } }
          : c
      )
    );
    setActiveCourse((prev) =>
      prev ? { ...prev, progress: { ...prev.progress, [idx]: true } } : prev
    );
  }, [activeCourse, addXP]);

  const handleViewChange = useCallback((newView) => {
    if (newView === "lesson" && activeCourse) {
      const nextSection = Object.values(activeCourse.progress || {}).filter(Boolean).length;
      if (view === "home" || view === "course") {
        setActiveSection(nextSection < (activeCourse.sections?.length || 0) ? nextSection : 0);
      } else {
        setActiveSection((s) => Math.min(s + 1, (activeCourse.sections?.length || 1) - 1));
      }
    }
    setView(newView);
  }, [activeCourse, view]);

  const handleSetActiveCourse = useCallback((course) => {
    setActiveCourse(course);
    const courseFromState = courses.find((c) => c.id === course.id);
    if (courseFromState) setActiveCourse(courseFromState);
  }, [courses]);

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        button:hover { transform: scale(1.02); }
        button:active { transform: scale(0.98); }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0d1033 50%, #0a1a0a 100%)",
        color: "#e0e0ff", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
        onClick={() => showLangSelector && setShowLangSelector(false)}
      >
        <Confetti active={confetti} />

        <Navbar
          xp={xp} hearts={hearts} streak={streak}
          lang={lang} setLang={setLang}
          showLangSelector={showLangSelector}
          setShowLangSelector={setShowLangSelector}
          setView={setView}
        />

        <div style={{ animation: "slideUp 0.3s ease" }} key={view}>
          {view === "home" && (
            <HomeView
              courses={courses} setView={setView}
              setActiveCourse={handleSetActiveCourse}
              lang={lang} xp={xp} streak={streak}
            />
          )}
          {view === "upload" && (
            <UploadView
              setView={setView} addCourse={addCourse}
              lang={lang} loadDemo={loadDemo}
            />
          )}
          {view === "course" && activeCourse && (
            <CourseView
              course={activeCourse} setView={handleViewChange}
              setActiveSection={setActiveSection} lang={lang}
              setActiveCourse={setActiveCourse}
            />
          )}
          {view === "lesson" && activeCourse && (
            <LessonView
              course={activeCourse} sectionIndex={activeSection}
              setView={handleViewChange}
              setActiveSection={setActiveSection}
              addXP={addXP} lang={lang}
            />
          )}
          {view === "quiz" && activeCourse && (
            <QuizView
              course={activeCourse} sectionIndex={activeSection}
              setView={handleViewChange}
              addXP={addXP} loseHeart={loseHeart}
              lang={lang} completeSection={completeSection}
            />
          )}
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.75rem", color: "#333", marginTop: "60px",
        }}>
          ZappLearn — Powered by Anthropic Claude AI &nbsp;•&nbsp; {LANGUAGES.length} languages supported
        </footer>
      </div>
    </>
  );
}
