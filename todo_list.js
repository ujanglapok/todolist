// todo_list.js (cleaned)
// - Adds tasks to localStorage
// - Updates progress ring (reads tasks from storage)
// - Saves daily goal and triggers congrats/confetti
// - Simple, defensive, no duplicate functions

// Load tasks safely
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

// Elements for daily goal & UI
const goalInput = document.getElementById("goalInput");
const saveGoalBtn = document.getElementById("saveGoal");
const goalText = document.getElementById("goalText");
const goalCheck = document.getElementById("goalCheck");
const goalCongrats = document.getElementById("goalCongrats");
const notifyEl = document.getElementById("notify");
const confettiCanvas = document.getElementById("confettiCanvas");

// Save tasks to storage and refresh progress
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
  checkDailyGoalAuto();
}

// Progress ring updater (reads fresh from storage)
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

  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset}`;
  ringLabel.textContent = pct + "%";
}

// Notification popup
function showNotification() {
  if (!notifyEl) return;
  notifyEl.classList.add("show");
  setTimeout(() => notifyEl.classList.remove("show"), 1600);
}

// Add task
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

// Daily goal functions
function loadGoal() {
  const saved = localStorage.getItem("daily_goal");
  const done = localStorage.getItem("daily_goal_done") === "true";
  if (saved && !done) goalText.textContent = "🎯 Goal: " + saved;
  if (done && goalCheck) {
    // If goal was auto-completed earlier, show congrats briefly
    goalCheck.checked = true;
    goalText.textContent = "";
    showGoalCongrats();
  }
}

function saveGoal() {
  if (!goalInput) return;
  const v = goalInput.value.trim();
  if (!v) return;
  localStorage.setItem("daily_goal", v);
  localStorage.setItem("daily_goal_done", "false");
  goalText.textContent = "🎯 Goal: " + v;
  if (goalCheck) goalCheck.checked = false;
  goalInput.value = "";
}

function completeDailyGoal() {
  localStorage.removeItem("daily_goal");
  localStorage.setItem("daily_goal_done", "true");
  if (goalText) goalText.textContent = "";
  showGoalCongrats();
  // uncheck after short delay to reset UI
  if (goalCheck) setTimeout(() => (goalCheck.checked = false), 800);
}

function checkDailyGoalAuto() {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  if (total > 0 && done === total) {
    completeDailyGoal();
  }
}

// Congrat & confetti
function showGoalCongrats() {
  if (!goalCongrats) return;
  goalCongrats.style.display = "block";
  startConfetti();
  setTimeout(() => {
    goalCongrats.style.display = "none";
  }, 2400);
}

function startConfetti() {
  if (!confettiCanvas) return;
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
    if (frame < 50) requestAnimationFrame(animate);
    else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      canvas.style.display = "none";
    }
  }
  animate();
}

// Events
if (addBtn) addBtn.addEventListener("click", addTask);
if (taskInput) taskInput.addEventListener("keypress", e => { if (e.key === "Enter") addTask(); });
if (saveGoalBtn) saveGoalBtn.addEventListener("click", saveGoal);
if (goalCheck) goalCheck.addEventListener("change", () => { if (goalCheck.checked) completeDailyGoal(); });

// Greeting (single combined, localized)
function runSuperGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;
  const userLang = navigator.language || "id-ID";
  const now = new Date();
  const hour = now.getHours();
  const dayName = now.toLocaleDateString(userLang, { weekday: "long" });
  const timeString = now.toLocaleTimeString(userLang, { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  let greet = "";
  if (hour >= 4 && hour < 11) greet = userLang.startsWith("id") ? "Selamat pagi 🌅" : "Good morning 🌅";
  else if (hour >= 11 && hour < 15) greet = userLang.startsWith("id") ? "Selamat siang ☀️" : "Good afternoon ☀️";
  else if (hour >= 15 && hour < 18) greet = userLang.startsWith("id") ? "Selamat sore 🌤️" : "Good evening 🌤️";
  else greet = userLang.startsWith("id") ? "Selamat malam 🌙" : "Good night 🌙";

  const dayMessage = userLang.startsWith("id") ? `Semangat di hari ${dayName}!` : `Happy ${dayName}!`;

  greetingEl.innerHTML = `
    <div style="font-size:22px;font-weight:700;margin-bottom:6px;">${greet}</div>
    <div style="font-size:14px;opacity:.85;margin-bottom:4px;">${dayMessage}</div>
    <div style="font-size:13px;color:#0f766e;font-weight:600;">${timeString}</div>
  `;
}

// Startup
loadGoal();
updateProgress();
checkDailyGoalAuto();
runSuperGreeting();
setInterval(runSuperGreeting, 1000);
