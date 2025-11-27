// ===============================
// ===============================
// SOUND EFFECTS — FIXED & WORKING
// ===============================

// klik lembut
const sClick = () => {
  const a = new Audio("data:audio/wav;base64,UklGRuQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YU4AAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=");
  a.volume = 1;
  a.play();
};


// woosh lembut (hapus)
const sWoosh = () => {
  const a = new Audio("data:audio/wav;base64,UklGRrwAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUwAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=");
  a.volume = 1;
  a.play();
};



// ===================================================
// cek_todo.js — Render task list + progress + sounds
// ===================================================
(function() {
  const taskList = document.getElementById("taskList");
  const container = document.querySelector(".container");
  if (!taskList || !container) return;

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Insert controls area (progress bar + clear button)
  const controls = document.createElement("div");
  controls.className = "ct-controls";
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.justifyContent = "space-between";
  controls.style.marginBottom = "12px";

  const progressLabel = document.createElement("div");
  progressLabel.textContent = "Progress — 0%";
  progressLabel.style.fontSize = "13px";
  progressLabel.style.color = "#475569";

  const progressBarWrap = document.createElement("div");
  progressBarWrap.style.flex = "1";
  progressBarWrap.style.marginLeft = "14px";

  const progressBar = document.createElement("div");
  progressBar.style.width = "100%";
  progressBar.style.height = "10px";
  progressBar.style.background = "rgba(15,23,42,0.06)";
  progressBar.style.borderRadius = "999px";
  progressBar.style.overflow = "hidden";

  const progressFill = document.createElement("div");
  progressFill.style.width = "0%";
  progressFill.style.height = "100%";
  progressFill.style.background = "linear-gradient(90deg,#06b6d4,#0d9488)";
  progressFill.style.transition = "width 420ms cubic-bezier(.2,.9,.3,1)";

  progressBar.appendChild(progressFill);
  progressBarWrap.appendChild(progressBar);

  controls.appendChild(progressLabel);
  controls.appendChild(progressBarWrap);

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Bersihkan selesai";
  clearBtn.style.marginLeft = "12px";
  clearBtn.style.padding = "8px 12px";
  clearBtn.style.borderRadius = "10px";
  clearBtn.style.border = "1px solid rgba(15,23,42,0.06)";
  clearBtn.style.background = "transparent";
  clearBtn.style.cursor = "pointer";
  clearBtn.style.color = "#0f766e";
  clearBtn.style.fontWeight = "600";
  clearBtn.style.display = "none";

  controls.appendChild(clearBtn);
  container.insertBefore(controls, taskList);

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function calcProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    progressFill.style.width = pct + "%";
    progressLabel.textContent = `Progress — ${pct}%`;

    clearBtn.style.display = tasks.some(t => t.done) ? "inline-block" : "none";
  }

  function render() {
    tasks.sort((a,b) => (a.done === b.done) ? 0 : (a.done ? 1 : -1));
    taskList.innerHTML = "";

    tasks.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = "task" + (task.done ? " done" : "");

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.width = "100%";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.alignItems = "center";
      left.style.gap = "12px";

      const chk = document.createElement("button");
      chk.innerHTML = task.done ? "✓" : "";
      chk.style.width = "22px";
      chk.style.height = "22px";
      chk.style.borderRadius = "6px";
      chk.style.border = "1.5px solid rgba(15,23,42,0.12)";
      chk.style.background = task.done ? "linear-gradient(90deg,#06b6d4,#0d9488)" : "#fff";
      chk.style.color = "#fff";
      chk.style.cursor = "pointer";

      const label = document.createElement("div");
      label.textContent = task.text;
      label.style.color = task.done ? "#475569" : "#0f1724";
      label.style.flex = "1";

      left.appendChild(chk);
      left.appendChild(label);

      const actions = document.createElement("div");
      actions.style.display = "flex";
      actions.style.gap = "8px";

      const del = document.createElement("button");
      del.textContent = "Hapus";
      del.style.background = "#ef4444";
      del.style.color = "#fff";
      del.style.border = "none";
      del.style.padding = "8px 10px";
      del.style.borderRadius = "10px";
      del.style.cursor = "pointer";
      del.style.opacity = "0.95";

      actions.appendChild(del);
      row.appendChild(left);
      row.appendChild(actions);
      li.appendChild(row);
      taskList.appendChild(li);

      // =======================
      // ADD CHECK SOUND
      // =======================
      chk.addEventListener("click", () => {
        tasks[i].done = !tasks[i].done;
        save();
        sClick();   // 🔊 klik lembut
        render();
      });

      // =======================
      // ADD DELETE SOUND
      // =======================
      del.addEventListener("click", () => {
        tasks.splice(i,1);
        save();
        sWoosh();   // 🔊 woosh lembut
        render();
      });
    });

    calcProgress();
  }

  clearBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => !t.done);
    save();
    sWoosh();
    render();
  });

  render();
})();

