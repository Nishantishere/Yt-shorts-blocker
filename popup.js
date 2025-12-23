const api = window.browser || window.chrome;

const toggle = document.getElementById("toggle");
const minutesInput = document.getElementById("minutes");
const slider = document.getElementById("minutes-slider");
const startBtn = document.getElementById("start");
const extendBtn = document.getElementById("extend");
const extendRow = document.getElementById("extendRow");
const status = document.getElementById("status");
const statsEl = document.getElementById("stats");
const resetBtn = document.getElementById("reset-storage");

let interval = null;

/* ---------- helpers ---------- */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function format(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}

function isActive(state) {
  return state.focusUntil && Date.now() < state.focusUntil;
}

/* ---------- render ---------- */
function render(state) {
  const today = todayKey();
  const statsToday = state.stats?.date === today ? state.stats : { seconds: 0 };


  /* ---------- Preset Chips ---------- */
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const mins = parseInt(chip.dataset.mins, 10);

    // Update input and slider
    minutesInput.value = mins;
    slider.value = mins;

    // Highlight active chip
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});


  // --- Countdown timer (red button) ---
  if (isActive(state)) {
    const left = state.focusUntil - Date.now();
    startBtn.textContent = format(left);
    startBtn.style.background = "#ef4444";
    extendRow.style.display = "block";
    status.textContent = "Focus active";
  } else {
    startBtn.textContent = "Start Focus Timer";
    startBtn.style.background = "";
    extendRow.style.display = "none";
    status.textContent = "";
  }

  // --- Total Focus Today (extension ON time) ---
  let totalSeconds = statsToday.seconds || 0;
  if (state.enabledSince) {
    totalSeconds += Math.floor((Date.now() - state.enabledSince) / 1000);
  }
  statsEl.textContent = format(totalSeconds * 1000);
}

/* ---------- load ---------- */
api.storage.sync.get(
  { enabled: true, enabledSince: null, focusUntil: null, stats: {} },
  (state) => {
    toggle.checked = state.enabled;

    // initialize enabledSince if extension is ON but missing
    if (toggle.checked && !state.enabledSince) {
      api.storage.sync.set({ enabledSince: Date.now() });
      state.enabledSince = Date.now();
    }

    render(state);

    // Update every second
    interval = setInterval(() => {
      api.storage.sync.get(
        { enabled: true, enabledSince: null, focusUntil: null, stats: {} },
        (s) => render(s)
      );
    }, 1000);
  }
);

/* ---------- sync inputs ---------- */
slider.addEventListener("input", () => {
  minutesInput.value = slider.value;
});
minutesInput.addEventListener("input", () => {
  if (minutesInput.value > 0) {
    slider.value = Math.min(minutesInput.value, 120);
  }
});

/* ---------- toggle ON/OFF ---------- */
toggle.addEventListener("change", () => {
  api.storage.sync.get({ stats: {} }, (state) => {
    const today = todayKey();
    let totalSeconds = state.stats?.date === today ? state.stats.seconds || 0 : 0;

    if (toggle.checked) {
      // turn ON → set enabledSince
      api.storage.sync.set({
        enabled: true,
        enabledSince: Date.now(),
        stats: { date: today, seconds: totalSeconds }
      });
    } else {
      // turn OFF → finalize total seconds
      if (state.enabledSince) {
        totalSeconds += Math.floor((Date.now() - state.enabledSince) / 1000);
      }
      api.storage.sync.set({
        enabled: false,
        enabledSince: null,
        stats: { date: today, seconds: totalSeconds }
      });
    }
  });
});

/* ---------- start / pause countdown ---------- */
startBtn.addEventListener("click", () => {
  api.storage.sync.get(
    { focusUntil: null, sessionMinutes: null },
    (state) => {
      if (isActive(state)) {
        // stop countdown
        api.storage.sync.set({ focusUntil: null });
        return;
      }

      // resume remaining countdown if session exists
      const now = Date.now();
      let remaining = state.focusUntil ? state.focusUntil - now : null;

      const mins = parseInt(minutesInput.value, 10);
      api.storage.sync.set({
        focusUntil: now + mins * 60000,
        sessionMinutes: mins
      });
    }
  );
});

/* ---------- +5 min (countdown only) ---------- */
extendBtn.addEventListener("click", () => {
  api.storage.sync.get({ focusUntil: null }, (state) => {
    if (!state.focusUntil) return;
    api.storage.sync.set({
      focusUntil: state.focusUntil + 5 * 60000
    });
  });
});

/* ---------- Reset ---------- */
resetBtn.addEventListener("click", () => {
  chrome.storage.sync.clear(() => {
    alert("Storage cleared for this extension!");
    location.reload();
  });
});

/* ---------- Custom spinner ---------- */
document.getElementById('increment').addEventListener('click', () => {
  minutesInput.value = parseInt(minutesInput.value || 0) + 1;
  minutesInput.dispatchEvent(new Event('input'));
});
document.getElementById('decrement').addEventListener('click', () => {
  const newVal = parseInt(minutesInput.value || 0) - 1;
  if (newVal >= 1) {
    minutesInput.value = newVal;
    minutesInput.dispatchEvent(new Event('input'));
  }
});
