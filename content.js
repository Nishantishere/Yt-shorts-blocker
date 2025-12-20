const STYLE_ID = "yt-shorts-blocker-style";

/* ---------- CSS BLOCKING ---------- */
function addBlockStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* Shorts shelves */
    ytd-rich-shelf-renderer[is-shorts],
    ytd-reel-shelf-renderer {
      display: none !important;
    }

    /* Shorts links (cards, videos, etc.) */
    a[href^="/shorts"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

function removeBlockStyle() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}

/* ---------- SIDEBAR HANDLING ---------- */
function removeSidebarShorts() {
  // Handle collapsed sidebar (mini guide)
  document.querySelectorAll("ytd-guide-entry-renderer").forEach(entry => {
    const title = entry.querySelector("yt-formatted-string.title");
    if (title && title.textContent.trim() === "Shorts") {
      entry.style.display = "none";
      entry.setAttribute("data-shorts-blocked", "true");
    }
  });

  // Handle expanded sidebar (mini guide items)
  document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(entry => {
    const title = entry.querySelector("yt-formatted-string");
    if (title && title.textContent.trim() === "Shorts") {
      entry.style.display = "none";
      entry.setAttribute("data-shorts-blocked", "true");
    }
  });

  // Handle expanded sidebar (guide section items)
  document.querySelectorAll("ytd-guide-section-renderer").forEach(section => {
    section.querySelectorAll("ytd-guide-entry-renderer, ytd-guide-collapsible-entry-renderer").forEach(entry => {
      const title = entry.querySelector("yt-formatted-string");
      if (title && title.textContent.trim() === "Shorts") {
        entry.style.display = "none";
        entry.setAttribute("data-shorts-blocked", "true");
      }
    });
  });
}

function restoreSidebarShorts() {
  // Restore all blocked items
  document
    .querySelectorAll('[data-shorts-blocked="true"]')
    .forEach(entry => {
      entry.style.display = "";
      entry.removeAttribute("data-shorts-blocked");
    });
}

/* ---------- APPLY SETTINGS ---------- */
function applySetting(enabled) {
  if (enabled) {
    addBlockStyle();
    removeSidebarShorts();
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    removeBlockStyle();
    restoreSidebarShorts();
    observer.disconnect();
  }
}

/* ---------- OBSERVER ---------- */
const observer = new MutationObserver(() => {
  removeSidebarShorts();
});

/* ---------- INIT ---------- */
chrome.storage.sync.get({ blockShorts: true }, data => {
  applySetting(data.blockShorts);
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.blockShorts) {
    applySetting(changes.blockShorts.newValue);
  }
});