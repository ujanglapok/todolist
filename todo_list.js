// ===============================
// LOAD TASKS
// ===============================
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

// DAILY GOAL elements
const goalInput = document.getElementById("goalInput");
const saveGoalBtn = document.getElementById("saveGoal");
const goalText = document.getElementById("goalText");
const goalCheck = document.getElementById("goalCheck");
const goalCongrats = document.getElementById("goalCongrats");

// UI
const notifyEl = document.getElementById("notify");
const confettiCanvas = document.getElementById("confettiCanvas");


// ===============================
// SAVE TASK + PROGRESS + AUTO-GOAL
// ===============================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
  checkDailyGoalAuto();
}


// ===============================
// PROGRESS RING
// ===============================
function updateProgress() {
  const ring = document.getElementById("progressRing");
  const ringLabel = document.getElementById("ringLabel");
  if (!ring || !ringLabel) return;

  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const circle = ring.querySelector(".ring-fill");
  if (!circle) return;

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
  ringLabel.textContent = pct + "%";
}


// ===============================
// NOTIFICATION
// ===============================
function showNotification() {
  if (!notifyEl) return;
  notifyEl.classList.add("show");
  setTimeout(() => notifyEl.classList.remove("show"), 1600);
}


// ===============================
// ADD TASK
// ===============================
function addTask() {
  if (!taskInput) return;
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, done: false });
  saveTasks();

  taskInput.value = "";
  showNotification();
  updateProgress();
}

addBtn?.addEventListener("click", addTask);
taskInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});


// ===============================
// DAILY GOAL SYSTEM
// ===============================
function loadGoal() {
  const saved = localStorage.getItem("daily_goal");
  const done = localStorage.getItem("daily_goal_done") === "true";

  if (saved && !done) {
    goalText.textContent = "🎯 Goal: " + saved;
    goalCheck.checked = false;
  } else {
    goalText.textContent = "";
    goalCheck.checked = false;
  }
}

function saveGoal() {
  const v = goalInput.value.trim();
  if (!v) return;

  localStorage.setItem("daily_goal", v);
  localStorage.setItem("daily_goal_done", "false");

  goalText.textContent = "🎯 Goal: " + v;
  goalCheck.checked = false;
  goalInput.value = "";
}
saveGoalBtn?.addEventListener("click", saveGoal);

function completeDailyGoal() {
  localStorage.removeItem("daily_goal");
  localStorage.setItem("daily_goal_done", "true");

  goalText.textContent = "";
  showGoalCongrats();

  setTimeout(() => {
    goalCheck.checked = false;
  }, 500);
}

goalCheck?.addEventListener("change", () => {
  if (goalCheck.checked) {
    completeDailyGoal();
  } else {
    localStorage.setItem("daily_goal_done", "false");
  }
});

function checkDailyGoalAuto() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  if (total > 0 && done === total) {
    completeDailyGoal();
  }
}


// ===============================
// CONGRATS + CONFETTI
// ===============================
function showGoalCongrats() {
  goalCongrats.style.display = "block";
  startConfetti();

  setTimeout(() => {
    goalCongrats.style.display = "none";
  }, 2000);
}

function startConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext("2d");
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  for (let i = 0; i < 36; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20,
      size: 6 + Math.random() * 8,
      speed: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 360},80%,60%)`
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speed;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    frame++;
    if (frame < 40) requestAnimationFrame(animate);
    else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      canvas.style.display = "none";
    }
  }
  animate();
}


// ===============================
// SUPER GREETING CLOCK
// ===============================
function runSuperGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;

  const lang = navigator.language || "id-ID";
  const now = new Date();

  const hour = now.getHours();
  const dayName = now.toLocaleDateString(lang, { weekday: "long" });
  const timeString = now.toLocaleTimeString(lang, {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  let greet = "";
  if (hour >= 4 && hour < 11) greet = lang.startsWith("id") ? "Selamat pagi 🌅" : "Good morning 🌅";
  else if (hour >= 11 && hour < 15) greet = lang.startsWith("id") ? "Selamat siang ☀️" : "Good afternoon ☀️";
  else if (hour >= 15 && hour < 18) greet = lang.startsWith("id") ? "Selamat sore 🌤️" : "Good evening 🌤️";
  else greet = lang.startsWith("id") ? "Selamat malam 🌙" : "Good night 🌙";

  const dayMsg = lang.startsWith("id")
    ? `Semangat di hari ${dayName}!`
    : `Happy ${dayName}!`;

  greetingEl.innerHTML = `
    <div style="font-size:22px;font-weight:700;margin-bottom:6px;">${greet}</div>
    <div style="font-size:14px;opacity:.8;margin-bottom:4px;">${dayMsg}</div>
    <div style="font-size:13px;color:#0f766e;font-weight:600;">${timeString}</div>
  `;
}


// ===============================
// MOTIVATIONAL QUOTES SYSTEM (30 mins)
// ===============================

const quotes = [
  "Tetap bergerak walau pelan, yang penting tidak berhenti.",
  "Kerja keras tidak akan mengkhianati hasil.",
  "Kamu lebih kuat dari yang kamu kira.",
  "Fokus pada progres, bukan kesempurnaan.",
  "Sedikit demi sedikit, lama-lama menjadi bukit.",
  "Disiplin hari ini menentukan masa depanmu.",
  "Mulai sekarang, bukan nanti.",
  "Tidak ada usaha yang sia-sia.",
  "Perubahan besar dimulai dari langkah kecil.",
  "Jangan menyerah, kamu sudah sejauh ini!"
];

function updateQuote() {
  const quoteEl = document.getElementById("quote");
  if (!quoteEl) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selected = quotes[randomIndex];

  quoteEl.textContent = selected;
  localStorage.setItem("quote_last", selected);
  localStorage.setItem("quote_time", Date.now());
}

function quoteScheduler() {
  const quoteEl = document.getElementById("quote");
  if (!quoteEl) return;

  const lastQuote = localStorage.getItem("quote_last");
  const lastTime = Number(localStorage.getItem("quote_time"));

  if (!lastQuote || !lastTime) {
    updateQuote();
    return;
  }

  const now = Date.now();
  const diff = now - lastTime;

  if (diff >= 30 * 60 * 1000) {
    // 30 menit berlalu
    updateQuote();
  } else {
    // tetap pakai quote sebelumnya
    quoteEl.textContent = lastQuote;
  }
}

setInterval(quoteScheduler, 60000); // cek tiap 1 menit


// MOOD SYSTEM
const moodButtons = document.querySelectorAll(".mood-btn");
const moodText = document.getElementById("moodText");

// Kata-kata sesuai mood
const moodMessages = {
  happy: [
    "Senangnya kamu hari ini! Pertahankan energi positifmu! ✨",
    "Kamu terlihat bersemangat! Hari ini pasti jadi hari yang hebat! 😄",
    "Mood bagus! Gunakan untuk menyelesaikan banyak hal! 🚀"
  ],
  okay: [
    "Sedang biasa saja ya? Tidak apa-apa, pelan tapi pasti. 🌿",
    "Tidak buruk, tidak juga hebat. Tapi kamu tetap maju! 💪",
    "Hari biasa itu normal. Kamu tetap hebat kok. 🙂"
  ],
  sad: [
    "Lagi sedih? Nggak apa-apa. Kamu kuat, kamu bisa melewati ini. 🤍",
    "Terasa berat ya? Ingat, semua bakal membaik. Kamu nggak sendiri. 🌧️➡️🌤️",
    "Pelan-pelan ya… Kamu sudah melakukan yang terbaik. Aku bangga sama kamu. 💛"
  ]
};

// Klik mood
moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;

    // Random salah satu pesan
    const list = moodMessages[mood];
    const message = list[Math.floor(Math.random() * list.length)];

    moodText.textContent = message;

    // Simpan mood ke localStorage
    localStorage.setItem("currentMood", mood);
    localStorage.setItem("currentMoodMessage", message);
  });
});

// Load mood sebelumnya saat open halaman
function loadMood() {
  const savedMood = localStorage.getItem("currentMood");
  const savedMsg = localStorage.getItem("currentMoodMessage");

  if (savedMood && savedMsg) {
    moodText.textContent = savedMsg;
  }
}

// STARTUP
// ===============================
loadGoal();
updateProgress();
checkDailyGoalAuto();
runSuperGreeting();
setInterval(runSuperGreeting, 1000);
quoteScheduler();
