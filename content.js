const api = window.browser || window.chrome;

function getState(cb) {
  api.storage.sync.get({ enabled: true, focusUntil: null }, cb);
}

function isSearchPage() {
  return location.pathname === "/results";
}

// Check if Shorts URL should redirect
function redirectShorts(state) {
  if (state.enabled && !isSearchPage() && location.pathname.startsWith("/shorts")) {
    const id = location.pathname.split("/")[2];
    if (id) {
      // Use replaceState + reload to handle SPA
      window.history.replaceState({}, "", `/watch?v=${id}`);
      location.reload(); // forces actual redirect
    }
  }
}

// Remove Shorts cards from pages except search page
function removeShorts() {
  getState((state) => {
    if (!state.enabled || isSearchPage()) return;

    // Remove shorts sections/cards
    document.querySelectorAll("ytd-rich-section-renderer").forEach(el => {
      if (el.innerText.toLowerCase().includes("shorts")) el.remove();
    });

    document.querySelectorAll("a[href^='/shorts']").forEach(a => {
      const card = a.closest(
        "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer"
      );
      if (card) card.remove();
    });

    document.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => el.remove());

    // Sidebar handling
    document.querySelectorAll("ytd-guide-entry-renderer").forEach(el => {
      if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
    });
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(el => {
      if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
    });
    document.querySelectorAll("ytd-guide-section-renderer").forEach(section => {
      section.querySelectorAll("ytd-guide-entry-renderer, ytd-guide-collapsible-entry-renderer").forEach(el => {
        if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
      });
    });
    document.querySelectorAll("tp-yt-paper-tab").forEach(tab => {
      if (tab.innerText.trim().toLowerCase() === "shorts") tab.remove();
    });
  });
}

// Initial run
getState((state) => {
  redirectShorts(state);
  removeShorts();
});

// Observe DOM changes dynamically
new MutationObserver(removeShorts).observe(document.body, {
  childList: true,
  subtree: true
});

// Detect SPA navigation (YouTube changes URL without reload)
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    getState(redirectShorts);
    removeShorts();
  }
}).observe(document.body, { childList: true, subtree: true });
