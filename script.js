// ==========================================================================
// 1. DATASETS & ACHIEVEMENTS
// ==========================================================================
const PASSAGES = {
  easy: [
    "Cat sat on mat.", "Run in the sun.", "A fast red car.", "Dogs like to play.",
    "The blue sky is clear.", "Birds fly high in spring.", "Fresh apples taste very good.",
    "Always try your best today.", "Water flows down the river.", "A soft breeze blows gently.",
    "Reading books helps you learn.", "Small steps lead to progress.", "Kindness brings joy to everyone.",
    "Bright stars shine in the night.", "Practice every day to get better.", "Music makes people feel happy.",
    "Walking outside helps calm your mind.", "Hard work leads to great results.",
    "Positive thinking changes your perspective on life.", "Consistency and quiet focus pave the path toward true mastery."
  ],
  medium: [
    "Simple habits shape daily routines over time.", "Typing speed increases with regular accurate practice.",
    "JavaScript powers interactive features across modern web apps.", "Clean code remains easy to read, test, and maintain.",
    "Understanding basic data structures improves software problem solving.", "Web performance optimization ensures fast page load speeds.",
    "Version control systems help engineering teams collaborate efficiently.", "Responsive design adapts user interfaces smoothly to mobile screens.",
    "Database indexing dramatically speeds up query execution efficiency.", "Modular software architecture enhances code reusability and scalability.",
    "Debugging requires systematically tracking down unexpected runtime errors.", "Continuous integration automates build verification and testing pipelines.",
    "User experience design focuses on intuitive navigation and clarity.", "Object-oriented programming organizes logic around distinct data models.",
    "Functional paradigms emphasize immutable states and pure function calls.", "Robust security practices shield dynamic applications from vulnerability risks.",
    "RESTful API endpoints facilitate flexible client and server communication.", "Cloud infrastructure provides elastic scaling for heavy network traffic.",
    "Algorithmic time complexity analyzes execution efficiency under large datasets.", "Comprehensive full-stack architecture balances server performance, database integrity, and UI state synchronization."
  ],
  hard: [
    "Synchronous execution blocks operations until task completion.", "Cryptographic hashing maps dynamic data into deterministic fixed-length digests.",
    "WebSockets enable bidirectional, persistent TCP communication with ultra-low latency.", "Polymorphism lets child classes override behaviors defined in base interfaces.",
    "Microservice topologies decouple monolithic infrastructure into standalone domain services.", "Distributed database consensus protocols maintain atomic transactional consistency across nodes.",
    "Automated garbage collection reclaims unreferenced heap space without manual deallocation.", "Just-In-Time compilation optimizes dynamic bytecode into native machine instructions on-the-fly.",
    "Domain-Driven Design establishes bounded contexts around complex business logic boundaries.", "Cross-Origin Resource Sharing restricts unauthorized browser requests across distinct origins.",
    "Thread synchronization primitives prevent race conditions in concurrent multi-threaded execution loops.", "Virtual memory abstractions dynamically map logical addresses to physical hardware locations.",
    "Abstract syntax trees structure source code hierarchies for compiler parsing pipelines.", "Containerization encapsulates code dependencies to guarantee consistent execution environments everywhere.",
    "Load balancers distribute incoming network traffic across multiple redundant compute clusters.", "Tail call optimization prevents stack overflow errors during deeply nested recursive function calls.",
    "Event-driven architecture processes system state transitions asynchronously using decoupled messaging queues.", "Content Delivery Networks strategically cache static assets geographically closer to end users.",
    "GraphQL empowers client applications to request precisely structured fields, eliminating over-fetching.", "Static type checking algorithms analyze AST nodes to enforce structural type safety prior to compilation runtime."
  ],
  programming: [
    'console.log("Hello, World!");', 'let count = 0;\ncount += 1;', 'if (age >= 18) {\n  return true;\n}',
    'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}', 'const add = (a, b) => a + b;',
    'const user = { name: "Alice", age: 25 };', 'const nums = [1, 2, 3].map(n => n * 2);',
    'function greet(name = "Guest") {\n  return `Hello, ${name}`;\n}', 'try {\n  JSON.parse(data);\n} catch (e) {\n  console.error(e);\n}',
    'class Car {\n  constructor(brand) {\n    this.brand = brand;\n  }\n}', 'const [first, ...rest] = [10, 20, 30, 40];',
    'const delay = (ms) => new Promise(res => setTimeout(res, ms));', 'async function fetchData(url) {\n  const res = await fetch(url);\n  return res.json();\n}',
    'const sum = numbers.reduce((acc, curr) => acc + curr, 0);', 'def factorial(n):\n    return 1 if n <= 1 else n * factorial(n - 1)',
    'SELECT u.id, u.name FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;', 'const memoize = (fn) => {\n  const cache = {};\n  return (...args) => cache[args] || (cache[args] = fn(...args));\n};',
    'int binarySearch(int arr[], int l, int r, int x) {\n    if (r >= l) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == x) return mid;\n    }\n    return -1;\n}', 'type UserProfile<T> = {\n  id: string;\n  data: T;\n  readonly createdAt: Date;\n};',
    'const mergeSort = (arr) => {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(right));\n  return merge(left, right);\n};'
  ]
};

const ACHIEVEMENTS = [
  { id: "first_test", title: "First Test", desc: "Complete 1 test", icon: "🏆", check: (s) => s.totalTests >= 1 },
  { id: "wpm_50", title: "Speed Demon", desc: "Achieve 50 WPM", icon: "🔥", check: (s) => s.bestWpm >= 50 },
  { id: "wpm_100", title: "Lightning Fast", desc: "Achieve 100 WPM", icon: "⚡", check: (s) => s.bestWpm >= 100 },
  { id: "acc_99", title: "Sniper", desc: "Achieve 99% accuracy", icon: "🎯", check: (s) => s.bestAcc >= 99 },
  { id: "code_10", title: "Pro Coder", desc: "Complete 10 tests", icon: "💻", check: (s) => s.totalTests >= 10 }
];

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================
let timer = 60;
let timeRemaining = timer;
let timerInterval = null;
let isTesting = false;
let totalTypedChars = 0;
let currentPassage = "";
let username = "";

let currentCategory = "medium";
let currentSubLevel = 0;
let currentModeType = "time";
let currentSubOption = 60;

let userStats = { bestWpm: 0, bestAcc: 0, totalTests: 0, totalWpmSum: 0, totalAccSum: 0 };
let chartInstance = null;

// ==========================================================================
// 3. DOM ELEMENTS
// ==========================================================================
const loginOverlay = document.getElementById("login-overlay");
const loginForm = document.getElementById("login-form");
const loginLoading = document.getElementById("login-loading");
const loginProgressBar = document.getElementById("login-progress-bar");
const loadingText = document.getElementById("loading-text");
const usernameInput = document.getElementById("username-input");
const mainApp = document.getElementById("main-app");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const categorySelect = document.getElementById("category-select");
const subLevelSelect = document.getElementById("sub-level-select");
const prevLevelBtn = document.getElementById("prev-level-btn");
const nextLevelBtn = document.getElementById("next-level-btn");

const modeTypeSelect = document.getElementById("mode-type-select");
const subOptionSelect = document.getElementById("mode-sub-option");
const subOptionLabel = document.getElementById("sub-option-label");

const timerEl = document.getElementById("timer");
const timerLabel = document.getElementById("timer-label");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");

const quoteDisplayEl = document.getElementById("quote-display");
const lineNumbersEl = document.getElementById("line-numbers");
const quoteInputEl = document.getElementById("quote-input");
const progressBarEl = document.getElementById("progress-bar");
const modeBadgeEl = document.getElementById("mode-badge");

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

const resultModal = document.getElementById("result-modal");
const resultLevelBadge = document.getElementById("result-level-badge");
const resWpmEl = document.getElementById("res-wpm");
const resAccEl = document.getElementById("res-accuracy");
const resTotalCharsEl = document.getElementById("res-total-chars");
const resCorrectCharsEl = document.getElementById("res-correct-chars");
const resWrongCharsEl = document.getElementById("res-wrong-chars");
const resTimeTakenEl = document.getElementById("res-time-taken");
const retryBtn = document.getElementById("retry-btn");
const nextLevelModalBtn = document.getElementById("next-level-modal-btn");
const shareBtn = document.getElementById("share-btn");
const deltaSummaryEl = document.getElementById("delta-summary");

const usernameDisplay = document.getElementById("username-display");
const editUsernameBtn = document.getElementById("edit-username-btn");
const historyListEl = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");

// ==========================================================================
// 4. INITIALIZATION & LOGIN TRANSITION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  checkExistingUser();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredName = usernameInput.value.trim();
    if (enteredName) {
      username = enteredName;
      localStorage.setItem("tm_username", username);
      triggerLoginLoading();
    }
  });

  setupEventListeners();
});

function checkExistingUser() {
  const savedUser = localStorage.getItem("tm_username");
  if (savedUser) {
    username = savedUser;
    enterMainAppDirectly();
  }
}

function triggerLoginLoading() {
  loginForm.classList.add("hidden");
  loginLoading.classList.remove("hidden");

  let progress = 0;
  const messages = ["Initializing profile...", "Loading typing levels...", "Preparing workspace..."];

  const interval = setInterval(() => {
    progress += 25;
    loginProgressBar.style.width = `${progress}%`;

    if (progress === 50) loadingText.innerText = messages[1];
    if (progress === 75) loadingText.innerText = messages[2];

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loginLoading.classList.add("hidden");
        loginForm.classList.remove("hidden");
        enterMainApp();
      }, 300);
    }
  }, 200);
}

function enterMainAppDirectly() {
  loginOverlay.classList.add("hidden");
  mainApp.classList.remove("hidden");
  usernameDisplay.innerText = username;
  populateSubLevels();
  loadUserData();
  loadPassage();
}

function enterMainApp() {
  loginOverlay.classList.add("hidden");
  mainApp.classList.remove("hidden");
  usernameDisplay.innerText = username;
  populateSubLevels();
  loadUserData();
  loadPassage();
}

function populateSubLevels() {
  subLevelSelect.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerText = `Level ${i + 1}`;
    subLevelSelect.appendChild(opt);
  }
  subLevelSelect.value = currentSubLevel;
}

function setupEventListeners() {
  categorySelect.addEventListener("change", () => {
    currentCategory = categorySelect.value;
    currentSubLevel = 0;
    subLevelSelect.value = 0;
    resetTest();
  });

  subLevelSelect.addEventListener("change", () => {
    currentSubLevel = parseInt(subLevelSelect.value);
    resetTest();
  });

  prevLevelBtn.addEventListener("click", () => changeSubLevel(-1));
  nextLevelBtn.addEventListener("click", () => changeSubLevel(1));
  nextLevelModalBtn.addEventListener("click", () => {
    resultModal.classList.add("hidden");
    changeSubLevel(1);
  });

  modeTypeSelect.addEventListener("change", () => {
    currentModeType = modeTypeSelect.value;
    populateSubOptions();
    resetTest();
  });

  subOptionSelect.addEventListener("change", () => {
    currentSubOption = parseInt(subOptionSelect.value);
    resetTest();
  });

  startBtn.addEventListener("click", startTest);
  resetBtn.addEventListener("click", resetTest);
  retryBtn.addEventListener("click", resetTest);
  shareBtn.addEventListener("click", shareResult);
  quoteInputEl.addEventListener("input", handleTyping);
  themeToggleBtn.addEventListener("click", toggleTheme);
  clearHistoryBtn.addEventListener("click", clearHistory);
  editUsernameBtn.addEventListener("click", switchUser);
}

function changeSubLevel(delta) {
  let newLevel = currentSubLevel + delta;
  if (newLevel >= 0 && newLevel < 20) {
    currentSubLevel = newLevel;
    subLevelSelect.value = currentSubLevel;
    resetTest();
  }
}

function populateSubOptions() {
  subOptionSelect.innerHTML = "";
  if (currentModeType === "time") {
    subOptionLabel.innerText = "Limit:";
    timerLabel.innerText = "Time Remaining";
    [15, 30, 60, 120].forEach(sec => {
      const opt = document.createElement("option");
      opt.value = sec;
      opt.innerText = `${sec} Seconds`;
      if (sec === 60) opt.selected = true;
      subOptionSelect.appendChild(opt);
    });
  } else {
    subOptionLabel.innerText = "Words:";
    timerLabel.innerText = "Time Elapsed";
    [10, 50, 100].forEach(w => {
      const opt = document.createElement("option");
      opt.value = w;
      opt.innerText = `${w} Words`;
      if (w === 10) opt.selected = true;
      subOptionSelect.appendChild(opt);
    });
  }
  currentSubOption = parseInt(subOptionSelect.value);
}

// ==========================================================================
// 5. PASSAGE RENDER & TYPING SYSTEM
// ==========================================================================
function loadPassage() {
  currentPassage = PASSAGES[currentCategory][currentSubLevel];

  if (currentModeType === "word") {
    const words = currentPassage.split(" ");
    currentPassage = words.slice(0, currentSubOption).join(" ");
  }

  const catTitle = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
  modeBadgeEl.innerText = `${catTitle} • Level ${currentSubLevel + 1} / 20`;

  if (currentCategory === "programming") {
    lineNumbersEl.classList.remove("hidden");
    const lines = currentPassage.split("\n").length;
    lineNumbersEl.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
  } else {
    lineNumbersEl.classList.add("hidden");
  }

  quoteDisplayEl.innerHTML = "";
  currentPassage.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.classList.add("char");
    if (index === 0) span.classList.add("current");
    span.innerText = char;
    quoteDisplayEl.appendChild(span);
  });

  resetStatsDisplay();
}

function startTest() {
  if (isTesting) return;

  isTesting = true;
  startBtn.disabled = true;
  quoteInputEl.disabled = false;
  quoteInputEl.value = "";
  quoteInputEl.focus();

  if (currentModeType === "time") {
    timeRemaining = currentSubOption;
    timerEl.innerText = `${timeRemaining}s`;

    timerInterval = setInterval(() => {
      timeRemaining--;
      timerEl.innerText = `${timeRemaining}s`;
      calculateLiveStats();
      if (timeRemaining <= 0) endTest();
    }, 1000);
  } else {
    timeRemaining = 0;
    timerEl.innerText = `0s`;

    timerInterval = setInterval(() => {
      timeRemaining++;
      timerEl.innerText = `${timeRemaining}s`;
      calculateLiveStats();
    }, 1000);
  }
}

function handleTyping() {
  if (!isTesting) return;

  const arrayQuote = quoteDisplayEl.querySelectorAll(".char");
  const arrayValue = quoteInputEl.value.split("");

  let mistakes = 0;
  totalTypedChars = arrayValue.length;

  arrayQuote.forEach((charSpan, index) => {
    const typedChar = arrayValue[index];
    charSpan.classList.remove("current");

    if (typedChar == null) {
      charSpan.classList.remove("correct", "incorrect");
    } else if (typedChar === charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
      mistakes++;
    }
  });

  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  if (arrayValue.length > currentPassage.length) {
    quoteInputEl.value = quoteInputEl.value.substring(0, currentPassage.length);
  }

  const progressPercent = Math.min((arrayValue.length / currentPassage.length) * 100, 100);
  progressBarEl.style.width = `${progressPercent}%`;

  mistakesEl.innerText = mistakes;
  calculateLiveStats();

  if (arrayValue.length > 0) {
    const lastChar = arrayValue[arrayValue.length - 1];
    const targetChar = currentPassage[arrayValue.length - 1];
    highlightVirtualKey(lastChar, lastChar === targetChar);
  }

  if (arrayValue.length >= currentPassage.length) endTest();
}

function highlightVirtualKey(char, isCorrect) {
  const keyChar = char === " " ? " " : char.toLowerCase();
  const keyEl = document.querySelector(`.key[data-key="${keyChar}"]`);
  if (keyEl) {
    const cls = isCorrect ? "key-correct" : "key-incorrect";
    keyEl.classList.add(cls);
    setTimeout(() => keyEl.classList.remove("key-correct", "key-incorrect"), 150);
  }
}

function calculateLiveStats() {
  const elapsed = currentModeType === "time" ? (currentSubOption - timeRemaining) : timeRemaining;
  const typedCharsCount = quoteInputEl.value.length;

  let wpm = 0;
  if (elapsed > 0) wpm = Math.round((typedCharsCount / 5) / (elapsed / 60));
  wpmEl.innerText = isNaN(wpm) || wpm < 0 || wpm === Infinity ? 0 : wpm;

  const mistakes = parseInt(mistakesEl.innerText);
  let accuracy = 100;
  if (typedCharsCount > 0) {
    accuracy = Math.round(((typedCharsCount - mistakes) / typedCharsCount) * 100);
  }
  accuracyEl.innerText = `${Math.max(0, accuracy)}%`;
}

// ==========================================================================
// 6. RESULTS, DELTA COMPARISON & CHART.JS
// ==========================================================================
function endTest() {
  clearInterval(timerInterval);
  isTesting = false;
  quoteInputEl.disabled = true;
  startBtn.disabled = false;

  const timeTaken = currentModeType === "time" ? (currentSubOption - timeRemaining) : timeRemaining;
  const finalWpm = parseInt(wpmEl.innerText) || 0;
  const finalAcc = parseInt(accuracyEl.innerText) || 0;
  const mistakes = parseInt(mistakesEl.innerText) || 0;

  resultLevelBadge.innerText = `${currentCategory.toUpperCase()} • LEVEL ${currentSubLevel + 1}`;
  resWpmEl.innerText = finalWpm;
  resAccEl.innerText = `${finalAcc}%`;
  resTotalCharsEl.innerText = totalTypedChars;
  resCorrectCharsEl.innerText = Math.max(0, totalTypedChars - mistakes);
  resWrongCharsEl.innerText = mistakes;
  resTimeTakenEl.innerText = `${timeTaken}s`;

  processLevelAttempt(currentCategory, currentSubLevel, finalWpm, finalAcc);

  resultModal.classList.remove("hidden");

  saveAttempt(finalWpm, finalAcc, mistakes);
  updateGlobalStats(finalWpm, finalAcc);
}

function processLevelAttempt(category, levelIndex, wpm, accuracy) {
  const levelKey = `tm_level_${category}_${levelIndex}`;
  let history = JSON.parse(localStorage.getItem(levelKey)) || [];

  const previousAttempt = history.length > 0 ? history[history.length - 1] : null;

  const currentRun = { wpm, accuracy, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
  history.push(currentRun);
  localStorage.setItem(levelKey, JSON.stringify(history));

  if (previousAttempt) {
    const wpmDelta = wpm - previousAttempt.wpm;
    const accDelta = accuracy - previousAttempt.accuracy;

    const wpmSymbol = wpmDelta >= 0 ? "📈 +" : "📉 ";
    const accSymbol = accDelta >= 0 ? "🎯 +" : "⚠️ ";
    const wpmColor = wpmDelta >= 0 ? "var(--accent-color)" : "var(--danger-color)";
    const accColor = accDelta >= 0 ? "var(--accent-color)" : "var(--danger-color)";

    deltaSummaryEl.innerHTML = `
      <p>Compared to Last Retry (Level ${levelIndex + 1}):</p>
      <span class="delta-stat" style="color: ${wpmColor}">${wpmSymbol}${wpmDelta} WPM</span> | 
      <span class="delta-stat" style="color: ${accColor}">${accSymbol}${accDelta}% Acc</span>
    `;
  } else {
    deltaSummaryEl.innerHTML = `<p>🚀 <strong>First attempt</strong> on this level! Retry to track progress.</p>`;
  }

  renderLevelChart(history);
}

function renderLevelChart(history) {
  const ctx = document.getElementById("levelChart").getContext("2d");

  const labels = history.map((_, i) => `Try #${i + 1}`);
  const wpmData = history.map(item => item.wpm);
  const accData = history.map(item => item.accuracy);

  if (chartInstance) chartInstance.destroy();

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "WPM",
          data: wpmData,
          borderColor: "#3a86ff",
          backgroundColor: "rgba(58, 134, 255, 0.15)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Accuracy (%)",
          data: accData,
          borderColor: "#10b981",
          borderDash: [4, 4],
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: textColor, font: { size: 10 } } }
      },
      scales: {
        x: { ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor } },
        y: { beginAtZero: true, ticks: { color: textColor, font: { size: 9 } }, grid: { color: gridColor } }
      }
    }
  });
}

function resetTest() {
  clearInterval(timerInterval);
  isTesting = false;
  quoteInputEl.disabled = true;
  quoteInputEl.value = "";
  progressBarEl.style.width = "0%";
  startBtn.disabled = false;
  resultModal.classList.add("hidden");
  loadPassage();
}

function resetStatsDisplay() {
  timeRemaining = currentModeType === "time" ? currentSubOption : 0;
  timerEl.innerText = `${timeRemaining}s`;
  wpmEl.innerText = "0";
  accuracyEl.innerText = "100%";
  mistakesEl.innerText = "0";
}

function shareResult() {
  const text = `🎮 I cleared ${currentCategory} Level ${currentSubLevel + 1} with ${resWpmEl.innerText} WPM and ${resAccEl.innerText} accuracy on TypeMaster Pro!`;
  navigator.clipboard.writeText(text);
  shareBtn.innerText = "✅ Copied!";
  setTimeout(() => shareBtn.innerText = "📋 Share", 2000);
}

function saveAttempt(wpm, accuracy, mistakes) {
  const history = JSON.parse(localStorage.getItem("tm_history")) || [];
  const now = new Date();
  const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}`;

  history.unshift({ date: dateStr, wpm, accuracy: `${accuracy}%`, mistakes });
  if (history.length > 10) history.pop();

  localStorage.setItem("tm_history", JSON.stringify(history));
  renderHistory(history);
}

function updateGlobalStats(wpm, acc) {
  userStats.totalTests++;
  userStats.totalWpmSum += wpm;
  userStats.totalAccSum += acc;
  if (wpm > userStats.bestWpm) userStats.bestWpm = wpm;
  if (acc > userStats.bestAcc) userStats.bestAcc = acc;

  localStorage.setItem("tm_stats", JSON.stringify(userStats));
  renderStats();
  renderAchievements();
}

function loadUserData() {
  const savedStats = localStorage.getItem("tm_stats");
  if (savedStats) userStats = JSON.parse(savedStats);

  const history = JSON.parse(localStorage.getItem("tm_history")) || [];
  renderHistory(history);
  renderStats();
  renderAchievements();
}

function renderStats() {
  document.getElementById("stat-best-wpm").innerText = `${userStats.bestWpm} WPM`;
  const avgWpm = userStats.totalTests > 0 ? Math.round(userStats.totalWpmSum / userStats.totalTests) : 0;
  document.getElementById("stat-avg-wpm").innerText = `${avgWpm} WPM`;
  const avgAcc = userStats.totalTests > 0 ? Math.round(userStats.totalAccSum / userStats.totalTests) : 0;
  document.getElementById("stat-avg-acc").innerText = `${avgAcc}%`;
  document.getElementById("stat-total-tests").innerText = userStats.totalTests;
}

function renderAchievements() {
  const container = document.getElementById("achievements-list");
  container.innerHTML = "";
  ACHIEVEMENTS.forEach(ach => {
    const isUnlocked = ach.check(userStats);
    const card = document.createElement("div");
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <span class="badge-icon">${ach.icon}</span>
      <div class="badge-info">
        <h4>${ach.title}</h4>
        <p>${ach.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderHistory(history) {
  historyListEl.innerHTML = "";
  if (history.length === 0) {
    historyListEl.innerHTML = `<li class="history-item">No past attempts recorded.</li>`;
    return;
  }
  history.forEach(item => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
      <span><strong>${item.date}</strong></span>
      <span><strong>${item.wpm} WPM</strong> | ${item.accuracy} Acc | ${item.mistakes} Mistakes</span>
    `;
    historyListEl.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("tm_history");
  renderHistory([]);
}

function switchUser() {
  localStorage.removeItem("tm_username");
  mainApp.classList.add("hidden");
  loginOverlay.classList.remove("hidden");
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("tm_theme", next);
  themeIcon.innerText = next === "dark" ? "☀️" : "🌙";
  
  if (!resultModal.classList.contains("hidden")) {
    const levelKey = `tm_level_${currentCategory}_${currentSubLevel}`;
    const history = JSON.parse(localStorage.getItem(levelKey)) || [];
    if (history.length > 0) renderLevelChart(history);
  }
}

function loadTheme() {
  const saved = localStorage.getItem("tm_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  themeIcon.innerText = saved === "dark" ? "☀️" : "🌙";
}
