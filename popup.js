const api = window.browser || window.chrome;

const toggle = document.getElementById("toggle");
const minutesInput = document.getElementById("minutes");
const slider = document.getElementById("minutes-slider");
const startBtn = document.getElementById("start");
const extendBtn = document.getElementById("extend");
const extendRow = document.getElementById("extendRow");
const status = document.getElementById("status");
const statsEl = document.getElementById("stats");

let interval = null;

/* ---------- helpers ---------- */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function format(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function isActive(state) {
  return state.enabled && state.focusUntil && Date.now() < state.focusUntil;
}

/* ---------- finalize session ---------- */
function finalizeSession(state) {
  if (!state.sessionMinutes) return;

  const today = todayKey();
  const prev =
    state.stats?.date === today ? state.stats.minutes : 0;

  api.storage.sync.set({
    stats: {
      date: today,
      minutes: prev + state.sessionMinutes
    },
    sessionMinutes: 0
  });
}

/* ---------- render ---------- */
function render(state) {
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
}

/* ---------- load ---------- */
api.storage.sync.get(
  { enabled: true, focusUntil: null, stats: {}, sessionMinutes: 0 },
  (state) => {
    toggle.checked = state.enabled;

    const today = todayKey();
    statsEl.textContent =
      state.stats?.date === today ? state.stats.minutes : 0;

    render(state);

    if (isActive(state)) {
      interval = setInterval(() => {
        api.storage.sync.get(
          { enabled: true, focusUntil: null, stats: {}, sessionMinutes: 0 },
          (s) => {
            if (!isActive(s)) {
              clearInterval(interval);
              finalizeSession(s);
              render(s);
            } else {
              render(s);
            }
          }
        );
      }, 1000);
    }
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

/* ---------- toggle ---------- */
toggle.addEventListener("change", () => {
  api.storage.sync.set({ enabled: toggle.checked, focusUntil: null });
});

/* ---------- start / pause ---------- */
startBtn.addEventListener("click", () => {
  api.storage.sync.get(
    { enabled: true, focusUntil: null, stats: {}, sessionMinutes: 0 },
    (state) => {
      if (isActive(state)) {
        api.storage.sync.set({ focusUntil: null });
        clearInterval(interval);
        finalizeSession(state);
        render({ enabled: true, focusUntil: null }); 
        return;
      }

      const mins = parseInt(minutesInput.value, 10);
      api.storage.sync.set({
        enabled: true,
        focusUntil: Date.now() + mins * 60000,
        sessionMinutes: mins
      }, () => location.reload());
    }
  );
});

    // Custom spinner buttons
    document.getElementById('increment').addEventListener('click', () => {
      const input = document.getElementById('minutes');
      input.value = parseInt(input.value || 0) + 1;
      input.dispatchEvent(new Event('input'));
    });

    document.getElementById('decrement').addEventListener('click', () => {
      const input = document.getElementById('minutes');
      const newVal = parseInt(input.value || 0) - 1;
      if (newVal >= 1) {
        input.value = newVal;
        input.dispatchEvent(new Event('input'));
      }
    });

/* ---------- +5 min ---------- */
extendBtn.addEventListener("click", () => {
  api.storage.sync.get({ focusUntil: null, sessionMinutes: 0 }, (state) => {
    if (!state.focusUntil) return;
    api.storage.sync.set({
      focusUntil: state.focusUntil + 5 * 60000,
      sessionMinutes: state.sessionMinutes + 5
    });
  });
});
