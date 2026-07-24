// ==========================================================================
// 1. Passage Dataset (Standard Modes + Programming Mode)
// ==========================================================================
const PASSAGES = {
  easy: [
    "The cat sat on the mat.",
    "A quick brown fox jumps.",
    "Sunlight fills the warm room.",
    "Open the door and step outside.",
    "Birds sing sweet songs in spring."
  ],
  medium: [
    "Programming isn't about what you know; it's about what you can figure out.",
    "JavaScript is the language of the web, enabling interactive web experiences.",
    "Success is not final, failure is not fatal: it is the courage to continue.",
    "Clean code always looks like it was written by someone who cares."
  ],
  hard: [
    "Synchronous execution blocks the thread, whereas asynchronous operations allow non-blocking primitives.",
    "Cryptographic hash functions transform arbitrary data streams into fixed-length digest outputs securely.",
    "WebSockets establish full-duplex persistent TCP socket channels for low-latency bidirectional communication."
  ],
  // NEW FEATURE: Programming Mode dataset
  programming: [
    "public class Main { public static void main(String[] args) { System.out.println(\"Hello World\"); } }",
    "int factorial(int n) { return (n <= 1) ? 1 : n * factorial(n - 1); }",
    "<div class=\"container\"><h1 class=\"title\">Welcome</h1><p>Start typing</p></div>",
    "const fetchData = async (url) => { const res = await fetch(url); return res.json(); };"
  ]
};

// ==========================================================================
// 2. State Management
// ==========================================================================
let timer = 60;
let timeRemaining = timer;
let timerInterval = null;
let isTesting = false;
let isLoading = false;
let totalErrors = 0;
let totalTypedChars = 0;
let currentPassage = "";

let currentDifficulty = "medium";
let currentSubLevel = 0;

// ==========================================================================
// 3. DOM Elements Initialization
// ==========================================================================
const welcomeScreen = document.getElementById("welcome-screen");
const enterAppBtn = document.getElementById("enter-app-btn");
const mainApp = document.getElementById("main-app");

const quoteDisplayEl = document.getElementById("quote-display");
const quoteInputEl = document.getElementById("quote-input");
const progressBarEl = document.getElementById("progress-bar");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const mistakesEl = document.getElementById("mistakes");

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const difficultySelect = document.getElementById("difficulty");
const subLevelSelect = document.getElementById("sub-level");
const prevLevelBtn = document.getElementById("prev-level-btn");
const nextLevelBtn = document.getElementById("next-level-btn");
const currentLevelBadge = document.getElementById("current-level-badge");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Results modal elements
const resultsCard = document.getElementById("results-card");
const finalWpmEl = document.getElementById("final-wpm");
const finalAccuracyEl = document.getElementById("final-accuracy");
const finalTotalCharsEl = document.getElementById("final-total-chars");
const finalCorrectCharsEl = document.getElementById("final-correct-chars");
const finalWrongCharsEl = document.getElementById("final-wrong-chars");
const finalTimeTakenEl = document.getElementById("final-time-taken");
const tryAgainBtn = document.getElementById("try-again-btn");
const nextLevelModalBtn = document.getElementById("next-level-modal-btn");

// History elements
const historyListEl = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingSubtext = document.getElementById("loading-subtext");

// ==========================================================================
// 4. Initial Setup & Event Listeners
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  populateSubLevelDropdown();
  loadHistory();
  loadCurrentLevelPassage();

  enterAppBtn.addEventListener("click", launchAppWithAnimation);
  startBtn.addEventListener("click", startTest);
  resetBtn.addEventListener("click", resetTest);
  tryAgainBtn.addEventListener("click", resetTest);
  quoteInputEl.addEventListener("input", handleTyping);

  // Dropdown listeners
  difficultySelect.addEventListener("change", () => {
    currentDifficulty = difficultySelect.value;
    currentSubLevel = 0;
    populateSubLevelDropdown();
    resetTest();
  });

  subLevelSelect.addEventListener("change", () => {
    currentSubLevel = parseInt(subLevelSelect.value);
    resetTest();
  });

  prevLevelBtn.addEventListener("click", () => changeSubLevel(-1));
  nextLevelBtn.addEventListener("click", () => changeSubLevel(1));
  nextLevelModalBtn.addEventListener("click", () => {
    resultsCard.classList.add("hidden");
    changeSubLevel(1);
  });

  themeToggleBtn.addEventListener("click", toggleTheme);
  clearHistoryBtn.addEventListener("click", clearHistory);
});

// Smooth intro animation transition
function launchAppWithAnimation() {
  welcomeScreen.classList.add("hidden");
  loadingOverlay.classList.remove("hidden");
  loadingSubtext.innerText = "Loading modules & visualizer...";

  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
    mainApp.classList.remove("hidden");
  }, 1200);
}

function populateSubLevelDropdown() {
  subLevelSelect.innerHTML = "";
  const totalLevels = PASSAGES[currentDifficulty].length;
  
  for (let i = 0; i < totalLevels; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerText = `Level ${i + 1}`;
    subLevelSelect.appendChild(opt);
  }
  subLevelSelect.value = currentSubLevel;
}

function changeSubLevel(delta) {
  const maxLevels = PASSAGES[currentDifficulty].length;
  let newLevel = currentSubLevel + delta;
  if (newLevel >= 0 && newLevel < maxLevels) {
    currentSubLevel = newLevel;
    subLevelSelect.value = currentSubLevel;
    resetTest();
  }
}

function loadCurrentLevelPassage() {
  currentPassage = PASSAGES[currentDifficulty][currentSubLevel];
  const maxLevels = PASSAGES[currentDifficulty].length;

  const difficultyTitle = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  currentLevelBadge.innerText = `${difficultyTitle} • Level ${currentSubLevel + 1} / ${maxLevels}`;

  // Break passage into individual char spans for live tracking
  quoteDisplayEl.innerHTML = "";
  currentPassage.split("").forEach((char, index) => {
    const charSpan = document.createElement("span");
    charSpan.classList.add("char");
    if (index === 0) charSpan.classList.add("current");
    charSpan.innerText = char;
    quoteDisplayEl.appendChild(charSpan);
  });

  resetStats();
}

// ==========================================================================
// 5. Live Typing Analysis & Visualizer Logic
// ==========================================================================
function startTest() {
  if (isTesting || isLoading) return;

  isTesting = true;
  startBtn.disabled = true;
  startBtn.innerText = "Test Active";
  
  quoteInputEl.disabled = false;
  quoteInputEl.value = "";
  quoteInputEl.focus();

  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.innerText = `${timeRemaining}s`;

    if (timeRemaining > 0) {
      calculateLiveStats();
    } else {
      endTest();
    }
  }, 1000);
}

function handleTyping(e) {
  if (!isTesting) return;

  const arrayQuote = quoteDisplayEl.querySelectorAll(".char");
  const arrayValue = quoteInputEl.value.split("");

  let errorsThisFrame = 0;
  totalTypedChars = arrayValue.length;

  // Real-time character highlighting
  arrayQuote.forEach((characterSpan, index) => {
    const typedChar = arrayValue[index];

    characterSpan.classList.remove("current");

    if (typedChar == null) {
      characterSpan.classList.remove("correct", "incorrect");
    } else if (typedChar === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      errorsThisFrame++;
    }
  });

  // Set current cursor indicator
  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  // Update progress bar percentage
  const progressPercent = Math.min((arrayValue.length / currentPassage.length) * 100, 100);
  progressBarEl.style.width = `${progressPercent}%`;

  totalErrors = errorsThisFrame;
  mistakesEl.innerText = totalErrors;

  // Trigger Keyboard Visualizer Feedback
  if (e.inputType !== "deleteContentBackward" && arrayValue.length > 0) {
    const lastTypedChar = arrayValue[arrayValue.length - 1];
    const targetChar = currentPassage[arrayValue.length - 1];
    highlightVirtualKey(lastTypedChar, lastTypedChar === targetChar);
  }

  calculateLiveStats();

  // End test early if completed full snippet
  if (arrayValue.length >= currentPassage.length) {
    endTest();
  }
}

// Keyboard Visualizer: Highlights pressed key green/red
function highlightVirtualKey(char, isCorrect) {
  const keyClass = isCorrect ? "key-correct" : "key-incorrect";
  const searchChar = char.toLowerCase();
  
  const keyEl = document.querySelector(`.key[data-key="${searchChar}"]`);
  if (keyEl) {
    keyEl.classList.add(keyClass);
    setTimeout(() => {
      keyEl.classList.remove("key-correct", "key-incorrect");
    }, 200);
  }
}

function calculateLiveStats() {
  const timeElapsed = timer - timeRemaining;
  const typedText = quoteInputEl.value;
  const typedCharsCount = typedText.length;

  let wpm = 0;
  if (timeElapsed > 0) {
    wpm = Math.round((typedCharsCount / 5) / (timeElapsed / 60));
  }
  wpmEl.innerText = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

  let accuracy = 100;
  if (typedCharsCount > 0) {
    const correctChars = typedCharsCount - totalErrors;
    accuracy = Math.round((correctChars / typedCharsCount) * 100);
  }
  accuracyEl.innerText = `${accuracy < 0 ? 0 : accuracy}%`;
}

// ==========================================================================
// 6. Results & Score History Handling
// ==========================================================================
function endTest() {
  clearInterval(timerInterval);
  isTesting = false;
  quoteInputEl.disabled = true;
  startBtn.disabled = false;
  startBtn.innerText = "Start Test";

  const timeTaken = timer - timeRemaining;
  const finalWpm = wpmEl.innerText;
  const finalAccuracy = accuracyEl.innerText;
  const correctChars = Math.max(0, totalTypedChars - totalErrors);

  // Populate Result Card Dashboard
  finalWpmEl.innerText = finalWpm;
  finalAccuracyEl.innerText = finalAccuracy;
  finalTotalCharsEl.innerText = totalTypedChars;
  finalCorrectCharsEl.innerText = correctChars;
  finalWrongCharsEl.innerText = totalErrors;
  finalTimeTakenEl.innerText = `${timeTaken}s`;

  resultsCard.classList.remove("hidden");
  saveScore(finalWpm, finalAccuracy, totalErrors);
}

function resetTest() {
  clearInterval(timerInterval);
  isTesting = false;
  isLoading = false;
  quoteInputEl.disabled = true;
  quoteInputEl.value = "";
  progressBarEl.style.width = "0%";
  
  startBtn.disabled = false;
  startBtn.innerText = "Start Test";
  
  resultsCard.classList.add("hidden");
  loadCurrentLevelPassage();
}

function resetStats() {
  timeRemaining = timer;
  timerEl.innerText = `${timer}s`;
  wpmEl.innerText = "0";
  accuracyEl.innerText = "100%";
  mistakesEl.innerText = "0";
  totalErrors = 0;
  totalTypedChars = 0;
}

// LocalStorage Persistence
function saveScore(wpm, accuracy, mistakes) {
  const history = JSON.parse(localStorage.getItem("typingHistoryAdvanced")) || [];
  
  const now = new Date();
  const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}`;
  
  const newEntry = {
    date: formattedDate,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    wpm: wpm,
    accuracy: accuracy,
    mistakes: mistakes
  };

  history.unshift(newEntry);
  if (history.length > 10) history.pop();

  localStorage.setItem("typingHistoryAdvanced", JSON.stringify(history));
  renderHistory(history);
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("typingHistoryAdvanced")) || [];
  renderHistory(history);
}

function renderHistory(history) {
  historyListEl.innerHTML = "";

  if (history.length === 0) {
    historyListEl.innerHTML = `<li class="history-item">No past attempts recorded yet.</li>`;
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("history-item");
    li.innerHTML = `
      <span><strong>${item.date}</strong></span>
      <span><strong>${item.wpm} WPM</strong> | ${item.accuracy} Accuracy</span>
    `;
    historyListEl.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("typingHistoryAdvanced");
  loadHistory();
}

// ==========================================================================
// 7. Theme Control
// ==========================================================================
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("typingTheme", newTheme);
  updateThemeIcon(newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("typingTheme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  themeIcon.innerText = theme === "dark" ? "☀️" : "🌙";
}
