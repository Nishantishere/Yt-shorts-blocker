# 🚫 Yt-shorts-blocker 2.0.0

A productivity-focused Chrome extension that **blocks YouTube Shorts** and provides an **interactive focus timer popup** to reduce distractions and improve concentration.

**YouTube Focus** is a lightweight Chrome extension designed to help users stay focused by removing Shorts content from YouTube and offering a simple, interactive control panel.

---

## ✨ **What’s New in 2.0.0**

* 🎨 Improved **interactive popup UI**
* 🔘 One-click **toggle button** to enable/disable Shorts blocking
* 🪟 Clean glass-style popup design
* ⚡ Faster and more reliable Shorts detection
* 🧠 Better state persistence using Chrome storage

---

## 🚀 Features

* 🚫 Blocks YouTube Shorts:

  * Home feed
  * Sidebar
  * Shorts links & redirects
* 🔘 Toggle button to turn blocking ON / OFF instantly
* ⏱ Focus timer with adjustable duration
* ➕ Extend focus session (+5 minutes)
* 📊 Daily focus statistics
* 💾 Settings persist using `chrome.storage.sync`
* ⚡ Works with YouTube’s dynamic SPA layout
* 🧩 Lightweight & privacy-friendly

<img width="300" height="400"  alt="image" src="https://github.com/user-attachments/assets/66f41397-e552-4de1-8ac6-277b84a4079e" />

---

## 🧠 How It Works

* Built using **Manifest V3**
* Uses **content scripts** to detect and remove Shorts elements
* Observes DOM changes to handle YouTube’s dynamic updates
* Popup provides:

  * Toggle switch for Shorts blocking
  * Focus timer controls
  * Extend session button
  * Daily focus stats display
* User preferences and stats are saved using Chrome storage

---

## 🪟 Popup Preview (Concept)

* Toggle Shorts blocking 🔘
* Set focus duration ⏱
* Extend focus time ➕
* View daily stats 📊

Simple, interactive, and distraction-free.

---

## 🛠 Installation (Developer Mode)

1. Clone this repository:

   ```bash
   git clone https://github.com/Nishantishere/Yt-shorts-blocker.git
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions
   ```

3. Enable **Developer mode** (top right)

4. Click **Load unpacked**

5. Select the project folder

6. Open YouTube — Shorts are now blocked 🚫

---

## 📁 Project Structure

```
Yt-shorts-blocker/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
├── assets/
│   └── logo.png
└── README.md
```

---

## 🔒 Privacy

* No data collection
* No external requests
* All settings stored locally using Chrome storage

---

## ⭐ Support the Project

If you find this extension helpful:

👉 **Give a star ⭐ on GitHub** 👈
It really helps and motivates further development!

Follow on LinkedIn
https://www.linkedin.com/in/nishant-yadav3338

---

## 📜 License

MIT License — free to use, modify, and distribute.
