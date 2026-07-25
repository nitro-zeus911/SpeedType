# ⌨️ TypeMaster Pro

> **A feature-rich, interactive web application to elevate your typing speed, coding accuracy, and muscle memory.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tech Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Chart.js-orange.svg)

---

## 📌 Overview

**TypeMaster Pro** is a modern, responsive typing application designed for both general typists and software developers. It offers multi-mode practice sessions, real-time typing metrics, a dynamic virtual keyboard visualizer, level-based progression, and persistent analytics to help users track speed (WPM) and accuracy growth over time.

---

## ✨ Key Features

* 🎯 **Multi-Category Practice Modes**:
  * **Easy / Medium / Hard**: Real-world prose passages tailored to different skill levels.
  * **Programming Mode**: Real code snippets (JavaScript, Python, C++, SQL, TypeScript) complete with syntax layout and line numbers.
* ⏱️ **Flexible Test Modes**:
  * **Time Mode**: Timed sessions (15s, 30s, 60s, 120s).
  * **Word Mode**: Fixed word length targets (10, 50, 100 words).
* 🎹 **Live Virtual Keyboard Visualizer**: Visual feedback highlighting keypresses with instant right/wrong indicator colors.
* 📊 **Real-Time HUD & Analytics**:
  * Live tracking for **WPM (Words Per Minute)**, **Accuracy %**, **Mistakes**, and **Time Elapsed/Remaining**.
  * Dynamic level progress charts powered by **Chart.js**.
  * **Delta Comparison Box**: Direct feedback comparing your current attempt with previous runs on the same level.
* 🏆 **Gamification & Achievements**:
  * Unlock badges for reaching milestones (Speed Demon, Sniper, Pro Coder, etc.).
  * Session history logged locally across user profiles.
* 🌓 **Dark & Light Mode Support**: Seamless toggle with full theme persistence.
* 💾 **Local Persistence**: Tracks user profiles, historical tests, high scores, and theme preferences via `localStorage`.

---

## 🛠️ Tech Stack

* **Frontend**: Vanilla HTML5, Modern CSS3 (Variables, Flexbox, Grid, Animations), Pure JavaScript (ES6+)
* **Data Visualization**: [Chart.js](https://www.chartjs.org/) (via CDN)
* **Storage**: Browser `localStorage` API

---

## 📂 Repository Structure

```text
typemaster-pro/
├── index.html        # Main app structure & modals
├── style.css         # Complete app styling & themes
├── script.js        # Core logic, timers, stats & charts
├── assets/           # Dynamic media & screenshots
├── LICENSE
└── README.md
