const api = window.browser || window.chrome;

function getState(cb) {
  api.storage.sync.get({ enabled: true, focusUntil: null }, cb);
}

function isSearchPage() {
  return location.pathname === "/results";
}

function shouldBlock(state) {
  if (!state.enabled) return false;

  if (state.focusUntil && Date.now() > state.focusUntil) {
    api.storage.sync.set({ enabled: false, focusUntil: null });
    return false;
  }
  return !isSearchPage();
}

function redirectShorts(state) {
  if (
    state.enabled &&
    !isSearchPage() &&
    location.pathname.startsWith("/shorts")
  ) {
    const id = location.pathname.split("/")[2];
    if (id) location.replace(`/watch?v=${id}`);
  }
}

function removeShorts() {
  getState((state) => {
    if (!shouldBlock(state)) return;

    document.querySelectorAll("ytd-rich-section-renderer").forEach(el => {
      if (el.innerText.toLowerCase().includes("shorts")) el.remove();
    });

    document.querySelectorAll("a[href^='/shorts']").forEach(a => {
      const card = a.closest(
        "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer"
      );
      if (card) card.remove();
    });

    // Handle collapsed sidebar
    document.querySelectorAll("ytd-guide-entry-renderer").forEach(el => {
      if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
    });

    // Handle mini guide (partially expanded view)
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(el => {
      if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
    });

    // Handle expanded sidebar sections
    document.querySelectorAll("ytd-guide-section-renderer").forEach(section => {
      section.querySelectorAll("ytd-guide-entry-renderer, ytd-guide-collapsible-entry-renderer").forEach(el => {
        if (el.innerText.trim().toLowerCase() === "shorts") el.remove();
      });
    });

    document.querySelectorAll("tp-yt-paper-tab").forEach(tab => {
      if (tab.innerText.trim().toLowerCase() === "shorts") tab.remove();
    });

    document.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => {
      el.remove();
    });
  });
}

getState(redirectShorts);
removeShorts();

new MutationObserver(removeShorts).observe(document.body, {
  childList: true,
  subtree: true
});
