// ==========================================================================
// 60-Level Dataset: Clean passages without "Level X:" prefixes
// ==========================================================================
const PASSAGES = {
  easy: [
    "The cat sat on the mat.",
    "A quick brown fox jumps.",
    "Sunlight fills the warm room.",
    "Open the door and step outside.",
    "Birds sing sweet songs in spring.",
    "Fresh rain drops fell on leaves.",
    "Read a good book every evening.",
    "Fresh apples grow on tall trees.",
    "Keep your dreams close to heart.",
    "Smile at the world each morning.",
    "Gentle waves touch the ocean shore.",
    "Clear water flows in the river.",
    "Bright stars light up the dark sky.",
    "Coffee smells great in the morning.",
    "Walk along the scenic mountain path.",
    "Practice brings steady improvement daily.",
    "Learning new skills is always rewarding.",
    "Music brings happiness to every soul.",
    "Believe in yourself and stay focus.",
    "Congratulations! You completed Easy Mode!"
  ],
  medium: [
    "Programming isn't about what you know; it's about what you can figure out.",
    "JavaScript is the language of the web, enabling interactive web experiences.",
    "Success is not final, failure is not fatal: it is the courage to continue.",
    "Clean code always looks like it was written by someone who cares.",
    "Consistency is key when mastering touch typing and speed.",
    "Responsive web design adapts layouts dynamically across all devices.",
    "Modern web browsers process scripts using high-performance engines.",
    "Front-end developers use HTML, CSS, and JavaScript as core building blocks.",
    "Focus on accuracy first, and typing speed will follow naturally over time.",
    "Functions isolate logic, making software easier to test and maintain.",
    "Cascading Style Sheets give web applications their unique visual style.",
    "Event listeners allow web pages to respond dynamically to user input.",
    "LocalStorage offers persistent key-value storage inside user browsers.",
    "Version control systems like Git allow developers to collaborate efficiently.",
    "Asynchronous programming allows long tasks without freezing the UI.",
    "Well-structured DOM manipulation forms the core of modern web apps.",
    "Array operations like map, filter, and reduce yield clean code.",
    "Good keyboard ergonomics prevent physical strain during long sessions.",
    "Debugging requires systematic analysis of error messages and call stacks.",
    "Excellent work! You have conquered all 20 Medium Levels!"
  ],
  hard: [
    "Synchronous execution blocks the thread, whereas asynchronous operations allow non-blocking primitives.",
    "Object-oriented paradigms construct entities with encapsulated state and immutable properties.",
    "Optimizing the critical rendering path reduces layout shifts and improves perceived page load times.",
    "Lexical scoping determines variable access based on physical positioning within source code structures.",
    "Cryptographic hash functions transform arbitrary data streams into fixed-length digest outputs securely.",
    "Polyfills provide modern browser features to legacy runtimes lacking native standard implementations.",
    "WebSockets establish full-duplex persistent TCP socket channels for low-latency bidirectional communication.",
    "Micro-frontend architecture divides monolithic web interfaces into independently deployable units.",
    "Just-In-Time compilation optimizes bytecode execution paths dynamically during runtime operation.",
    "Recursion solves complex computational subproblems through repeated self-referential call stacks.",
    "Document Object Model trees represent XML or HTML structures as node-based object hierarchies.",
    "Memory leaks occur when unreachable references persist without garbage collection reclaiming allocations.",
    "Service Workers intercept network requests to enable offline caching and background synchronization.",
    "Cross-Origin Resource Sharing protocols enforce browser-level security boundaries across domains.",
    "Content Security Policies mitigate injection vectors including cross-site scripting vulnerabilities.",
    "CSS Grid and Flexbox provide powerful two-dimensional and one-dimensional layout systems.",
    "Pure functions always return identical results when passed identical arguments without side effects.",
    "Abstract Syntax Trees represent tokenized code structures visually for compiler optimization steps.",
    "Time complexity analysis using Big-O notation measures algorithm scalability under scaling input sizes.",
    "Master Class Complete! You have mastered all 60 typing speed challenges!"
  ]
};

// ==========================================================================
// State Management
// ==========================================================================
let timer = 60;
let timeRemaining = timer;
let timerInterval = null;
let isTesting = false;
let isLoading = false;
let totalErrors = 0;
let currentPassage = "";

let currentDifficulty = "medium";
let currentSubLevel = 0; // 0 to 19

// ==========================================================================
// DOM Elements
// ==========================================================================
const welcomeScreen = document.getElementById("welcome-screen");
const enterAppBtn = document.getElementById("enter-app-btn");
const mainApp = document.getElementById("main-app");

const quoteDisplayEl = document.getElementById("quote-display");
const quoteInputEl = document.getElementById("quote-input");
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
const resultsCard = document.getElementById("results-card");
const finalWpmEl = document.getElementById("final-wpm");
const finalAccuracyEl = document.getElementById("final-accuracy");
const finalMistakesEl = document.getElementById("final-mistakes");
const nextLevelModalBtn = document.getElementById("next-level-modal-btn");
const historyListEl = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingSubtext = document.getElementById("loading-subtext");

// ==========================================================================
// Initialization & Landing Screen Transition
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  populateSubLevelDropdown();
  loadHistory();
  loadCurrentLevelPassage();

  // Landing page start button -> Triggers login loading sequence
  enterAppBtn.addEventListener("click", launchAppWithAnimation);

  // Event Listeners
  startBtn.addEventListener("click", startTest);
  resetBtn.addEventListener("click", resetTest);
  quoteInputEl.addEventListener("input", handleTyping);
  
  difficultySelect.addEventListener("change", () => {
    currentDifficulty = difficultySelect.value;
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
    resultsCard.classList.add("hidden");
    changeSubLevel(1);
  });

  themeToggleBtn.addEventListener("click", toggleTheme);
  clearHistoryBtn.addEventListener("click", clearHistory);
});

// Launch app: Hides welcome screen -> Plays Loading Animation -> Reveals Typing Page
function launchAppWithAnimation() {
  welcomeScreen.classList.add("hidden");
  loadingOverlay.classList.remove("hidden");
  loadingSubtext.innerText = "Authenticating session & loading dataset...";

  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
    mainApp.classList.remove("hidden");
  }, 1800);
}

function populateSubLevelDropdown() {
  subLevelSelect.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerText = `Level ${i + 1}`;
    subLevelSelect.appendChild(opt);
  }
  subLevelSelect.value = currentSubLevel;
}

function changeSubLevel(delta) {
  let newLevel = currentSubLevel + delta;
  if (newLevel >= 0 && newLevel < 20) {
    currentSubLevel = newLevel;
    subLevelSelect.value = currentSubLevel;
    resetTest();
  }
}

function loadCurrentLevelPassage() {
  currentPassage = PASSAGES[currentDifficulty][currentSubLevel];

  const difficultyTitle = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  currentLevelBadge.innerText = `${difficultyTitle} • Level ${currentSubLevel + 1} / 20`;

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
// Typing Test Functions
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

function handleTyping() {
  if (!isTesting) return;

  const arrayQuote = quoteDisplayEl.querySelectorAll(".char");
  const arrayValue = quoteInputEl.value.split("");

  let errorsThisFrame = 0;

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

  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  totalErrors = errorsThisFrame;
  mistakesEl.innerText = totalErrors;

  calculateLiveStats();

  if (arrayValue.length >= currentPassage.length) {
    endTest();
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

function endTest() {
  clearInterval(timerInterval);
  isTesting = false;
  quoteInputEl.disabled = true;
  startBtn.disabled = false;
  startBtn.innerText = "Start Test";

  const finalWpm = wpmEl.innerText;
  const finalAccuracy = accuracyEl.innerText;
  const finalMistakes = mistakesEl.innerText;

  finalWpmEl.innerText = finalWpm;
  finalAccuracyEl.innerText = finalAccuracy;
  finalMistakesEl.innerText = finalMistakes;
  resultsCard.classList.remove("hidden");

  saveScore(finalWpm, finalAccuracy);
}

function resetTest() {
  clearInterval(timerInterval);
  isTesting = false;
  isLoading = false;
  quoteInputEl.disabled = true;
  quoteInputEl.value = "";
  
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
}

// ==========================================================================
// LocalStorage History
// ==========================================================================
function saveScore(wpm, accuracy) {
  const history = JSON.parse(localStorage.getItem("typingHistory60")) || [];
  const difficultyTitle = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
  
  const newEntry = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    wpm: wpm,
    accuracy: accuracy,
    levelInfo: `${difficultyTitle} Lvl ${currentSubLevel + 1}`
  };

  history.unshift(newEntry);
  if (history.length > 10) history.pop();

  localStorage.setItem("typingHistory60", JSON.stringify(history));
  renderHistory(history);
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("typingHistory60")) || [];
  renderHistory(history);
}

function renderHistory(history) {
  historyListEl.innerHTML = "";

  if (history.length === 0) {
    historyListEl.innerHTML = `<li class="history-item">No past attempts recorded.</li>`;
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("history-item");
    li.innerHTML = `
      <span><strong>${item.wpm} WPM</strong> (${item.accuracy})</span>
      <span style="color: var(--text-secondary);">${item.levelInfo} • ${item.date}</span>
    `;
    historyListEl.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("typingHistory60");
  loadHistory();
}

// ==========================================================================
// Theme Toggle
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