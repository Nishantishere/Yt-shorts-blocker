# Yt-shorts-blocker
A productivity-focused Chrome extension that blocks YouTube Shorts and adds a focus timer to reduce distractions.

YouTube Focus is a lightweight Chrome extension designed to reduce distractions by blocking YouTube Shorts and helping users stay focused with a configurable timer.

---

## Features

- 🚫 Block YouTube Shorts (home feed, sidebar, and links)  
- ⏱ Focus timer with adjustable duration  
- ➕ Extend focus sessions (+5 minutes)  
- 📊 Daily focus statistics  
- 💾 Settings persist using Chrome storage  
- ⚡ Works with YouTube’s dynamic layout (SPA)

---

## How It Works

- Uses **Manifest V3** and **content scripts** to modify YouTube’s UI  
- Dynamically removes Shorts elements, even when YouTube updates the page  
- Stores user preferences and session data using `chrome.storage.sync`  
- Provides a popup with:
  - Toggle to enable/disable Shorts blocking  
  - Number input / slider for focus duration  
  - Extend session button  
  - Daily focus stats  

---

## Installation (Developer Mode)

1. Clone this repository:

```bash
git clone https://github.com/YOUR_USERNAME/youtube-focus.git


