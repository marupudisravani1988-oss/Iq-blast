/* ============================================================
   game.js  –  Brain Blast!
   Core game logic: state management, puzzle flow,
   scoring, timer, level system, UI updates.

   Depends on (loaded before this file):
     puzzles.js  →  PUZZLES, CATS
     monkey.js   →  setMonkey(), showSpeech(), monkeyState()
     effects.js  →  spawnConfetti(), spawnXPBurst(),
                    playCorrectSound(), playWrongSound()
   ============================================================ */


/* ══════════════════════════════════════════════════════════════
   CONFIGURATION  –  tweak gameplay here
   ══════════════════════════════════════════════════════════════ */
const CONFIG = {
  baseXP:          10,    // XP awarded for a correct answer
  streakBonusXP:   2,     // extra XP per current streak length
  speedBonusDivisor: 20,  // timeLeft ÷ this = speed bonus XP

  easyThreshold:   0,     // totalCorrect to stay on Easy
  mediumThreshold: 10,    // totalCorrect to unlock Medium
  hardThreshold:   20,    // totalCorrect to unlock Hard

  timerSteps:      100,   // timer counts from 100 → 0
  timerStepMs:     200,   // ms per step  (100×200 = 20 s total)
  eatTrigger:      40,    // steps elapsed before monkey eats
  dizzyTrigger:    70,    // steps elapsed before monkey goes dizzy

  nextPuzzleDelay: 2000,  // ms after answer before next puzzle
  timeoutDelay:    2200,  // ms after timeout before next puzzle

  storageKey: "bb4_stats",
};

const PUZZLE_TYPES = ["math", "story", "logic", "emotion"];

/* ══════════════════════════════════════════════════════════════
   GAME STATE
   ══════════════════════════════════════════════════════════════ */
let xp       = 0;
let streak   = 0;
let playerName = "";
let current  = null;       // current puzzle object
let timeLeft = CONFIG.timerSteps;
let timerInterval = null;

/** Per-category correct / wrong tallies */
let stats = {
  math:    { c: 0, w: 0 },
  story:   { c: 0, w: 0 },
  logic:   { c: 0, w: 0 },
  emotion: { c: 0, w: 0 },
};

/** Track which puzzle indices have been used (avoid repeats) */
let usedIdx = {
  math:    { easy: [], medium: [], hard: [] },
  story:   { easy: [], medium: [], hard: [] },
  logic:   { easy: [], medium: [], hard: [] },
  emotion: { easy: [], medium: [], hard: [] },
};

/* ── Load saved stats ───────────────────────────────────────── */
(function loadStats() {
  try {
    const saved = localStorage.getItem(CONFIG.storageKey);
    if (saved) stats = JSON.parse(saved);
  } catch (e) { /* ignore */ }
})();


/* ══════════════════════════════════════════════════════════════
   LEVEL SYSTEM
   ══════════════════════════════════════════════════════════════ */
function totalCorrect() {
  return Object.values(stats).reduce((sum, v) => sum + v.c, 0);
}

function getLevel() {
  const c = totalCorrect();
  if (c >= CONFIG.hardThreshold)   return { label: "🏆 Champion", diff: "hard"   };
  if (c >= CONFIG.mediumThreshold) return { label: "🚀 Explorer",  diff: "medium" };
  return                                   { label: "⭐ Starter",   diff: "easy"   };
}


/* ══════════════════════════════════════════════════════════════
   PUZZLE SELECTION  (no-repeat pool)
   ══════════════════════════════════════════════════════════════ */
function pickPuzzle(type) {
  const diff  = getLevel().diff;
  const pool  = PUZZLES[type][diff];
  const used  = usedIdx[type][diff];

  let available = pool.map((_, i) => i).filter(i => !used.includes(i));

  // Reset pool when exhausted
  if (!available.length) {
    usedIdx[type][diff] = [];
    available = pool.map((_, i) => i);
  }

  const idx = available[Math.floor(Math.random() * available.length)];
  usedIdx[type][diff].push(idx);

  return { ...pool[idx], concept: type };
}

function randomType() {
  return PUZZLE_TYPES[Math.floor(Math.random() * PUZZLE_TYPES.length)];
}


/* ══════════════════════════════════════════════════════════════
   TIMER
   ══════════════════════════════════════════════════════════════ */
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = CONFIG.timerSteps;
  renderTimerBar();

  let elapsed = 0;

  timerInterval = setInterval(() => {
    elapsed++;
    timeLeft = Math.max(0, CONFIG.timerSteps - elapsed);
    renderTimerBar();

    // Monkey reacts to slow answering
    if (elapsed === CONFIG.eatTrigger && monkeyState() === "idle") {
      setMonkey("eating");
      showSpeech("Hmm, snack time! 🍌", "#a05010", 3000);
    }
    if (elapsed === CONFIG.dizzyTrigger && monkeyState() === "eating") {
      setMonkey("dizzy");
      showSpeech("Take your time! 😵", "#7030cc", 3000);
    }

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, CONFIG.timerStepMs);
}

function renderTimerBar() {
  const bar = document.getElementById("timer-bar");
  if (bar) bar.style.width = timeLeft + "%";
}

function handleTimeout() {
  // Disable all buttons and reveal correct answer
  document.querySelectorAll(".opt-btn").forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.trim() === current.a) btn.classList.add("correct");
  });

  document.getElementById("feedback").innerHTML =
    `<span style="color:#cc4010">⏰ Time's up! Answer: <b>${current.a}</b></span>`;

  streak = 0;
  stats[current.concept].w++;

  setMonkey("sad", 1800);
  showSpeech("Oops! Next one! 💪", "#cc4010", 2000);

  saveStats();
  updateUI();
  setTimeout(showPuzzle, CONFIG.timeoutDelay);
}


/* ══════════════════════════════════════════════════════════════
   PUZZLE RENDER
   ══════════════════════════════════════════════════════════════ */
function showPuzzle() {
  clearInterval(timerInterval);

  const type = randomType();
  current    = pickPuzzle(type);
  const cat  = CATS[type];

  // Update level badge
  document.getElementById("level-text").textContent = getLevel().label;

  // Reset monkey
  setMonkey("idle");

  // Shuffle answer options
  const opts = [...current.o].sort(() => Math.random() - 0.5);
  const gridClass = opts.length > 3 ? "" : "cols3";

  document.getElementById("game").innerHTML = `
    <div class="cat-badge"
         style="color:${cat.color};background:${cat.bg};border-color:${cat.color}55">
      ${cat.icon} ${cat.label}
    </div>
    <div class="puzzle-card ${type}">
      <div class="puzzle-q">${current.q}</div>
      <div class="options-grid ${gridClass}">
        ${opts.map(o =>
          `<button class="opt-btn"
                   onclick="checkAnswer(this,'${o.replace(/'/g,"\\'")}','${type}')">
             ${o}
           </button>`
        ).join("")}
      </div>
      <div id="feedback"></div>
    </div>
  `;

  startTimer();
}


/* ══════════════════════════════════════════════════════════════
   ANSWER CHECKING
   ══════════════════════════════════════════════════════════════ */
function checkAnswer(btn, ans, type) {
  clearInterval(timerInterval);

  const correct = ans === current.a;
  document.querySelectorAll(".opt-btn").forEach(b => (b.disabled = true));

  const fb = document.getElementById("feedback");

  if (correct) {
    btn.classList.add("correct");

    // XP calculation
    const speedBonus = Math.floor(timeLeft / CONFIG.speedBonusDivisor);
    const gained     = CONFIG.baseXP + streak * CONFIG.streakBonusXP + speedBonus;
    xp     += gained;
    streak++;
    stats[type].c++;

    // Feedback text
    const messages = ["🎉 Amazing!", "⭐ Brilliant!", "🚀 Superstar!",
                      "🏆 Perfect!", "💥 Incredible!", "🌈 Awesome!"];
    fb.innerHTML = `<span style="color:#1a8a40">
      ${messages[Math.floor(Math.random() * messages.length)]} +${gained} XP
    </span>`;

    // Monkey & speech
    setMonkey("happy", 1600);
    const cheers = ["Yeahhh! 🎉", "You rock! ⭐", "WOW! 🚀", "PERFECT! 🏆", "BOOM! 💥"];
    showSpeech(cheers[Math.floor(Math.random() * cheers.length)], "#1a6030", 1800);

    // Visual & audio effects
    spawnConfetti(btn);
    spawnXPBurst(btn, `+${gained} XP`);
    popChip("xp-chip");
    popChip("streak-chip");
    playCorrectSound();

  } else {
    btn.classList.add("wrong");

    // Highlight correct answer in green
    document.querySelectorAll(".opt-btn").forEach(b => {
      if (b.textContent.trim() === current.a) b.classList.add("correct");
    });

    streak = 0;
    stats[type].w++;

    const sadMsgs = ["Almost! 💪", "Not quite! 🤔", "Keep going! 🌈", "You got this! 😄"];
    fb.innerHTML = `<span style="color:#cc4010">
      ${sadMsgs[Math.floor(Math.random() * sadMsgs.length)]} Answer: <b>${current.a}</b>
    </span>`;

    setMonkey("sad", 1800);
    const sadSpeech = ["Aww, it's ok! 😢", "Don't give up! 💪", "I believe in you! 🌟"];
    showSpeech(sadSpeech[Math.floor(Math.random() * sadSpeech.length)], "#cc4010", 2000);

    playWrongSound();
  }

  saveStats();
  updateUI();
  setTimeout(showPuzzle, CONFIG.nextPuzzleDelay);
}


/* ══════════════════════════════════════════════════════════════
   UI UPDATES
   ══════════════════════════════════════════════════════════════ */
function updateUI() {
  document.getElementById("xp-val").textContent     = xp;
  document.getElementById("streak-val").textContent = streak;
  document.getElementById("level-text").textContent  = getLevel().label;
  renderReport();
}

function renderReport() {
  const barGradients = {
    math:    "linear-gradient(90deg,#FFD93D,#ff9f43)",
    story:   "linear-gradient(90deg,#5ecb6e,#78d6f7)",
    logic:   "linear-gradient(90deg,#b97dff,#5b7fff)",
    emotion: "linear-gradient(90deg,#FF6B6B,#ff9f43)",
  };

  document.getElementById("report").innerHTML =
    Object.entries(stats).map(([key, val]) => {
      const cat  = CATS[key];
      const done = val.c + val.w;
      const pct  = done ? Math.round((val.c / done) * 100) : 0;

      return `
        <div class="stat-row">
          <div class="stat-icon">${cat.icon}</div>
          <div class="stat-label">${cat.label}</div>
          <div class="mini-bar-wrap">
            <div class="mini-bar"
                 style="width:${pct}%;background:${barGradients[key]}">
            </div>
          </div>
          <div class="stat-nums">✅${val.c} &nbsp;❌${val.w}</div>
        </div>`;
    }).join("");
}

function popChip(id) {
  const el = document.getElementById(id);
  el.classList.remove("pop");
  void el.offsetWidth; // force reflow so animation re-triggers
  el.classList.add("pop");
}

function saveStats() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(stats));
  } catch (e) { /* storage not available */ }
}


/* ══════════════════════════════════════════════════════════════
   WELCOME / START GAME
   ══════════════════════════════════════════════════════════════ */
function startGame() {
  const nameInput = document.getElementById("name-input");
  playerName = nameInput.value.trim() || "Friend";

  // Switch screens
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("topbar").style.display         = "flex";
  document.getElementById("app").style.display            = "block";

  document.getElementById("player-name-display").textContent =
    `Hi, ${playerName}! 👋`;

  renderReport();
  showPuzzle();

  // Welcome speech after a short delay
  setTimeout(() => showSpeech(`Hi ${playerName}! Let's go! 🚀`, "#1a6030", 2500), 900);
}

/* Allow Enter key on name input */
document.getElementById("name-input")
  .addEventListener("keydown", e => { if (e.key === "Enter") startGame(); });
