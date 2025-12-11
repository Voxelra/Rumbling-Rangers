// ------------------------
// MISC.
// ------------------------

const answerInput = document.getElementById("answerInput");

// ------------------------
// BOT SETTINGS
// ------------------------
const bots = [
  { name: "Bot A", accuracy: 0.55, minTime: 600, maxTime: 1000 },
  { name: "Bot B", accuracy: 0.55, minTime: 600, maxTime: 1000 }
];

let currentCorrectAnswer = null;
let gameOver = false;

// Small debounce to avoid instant multiple question regenerations
let lastQuestionAdvance = 0;
const QUESTION_ADVANCE_DEBOUNCE_MS = 80; // small window

// Utility: tolerance comparison for decimals
function isCorrect(a, b, tolerance = 0.02) {
  if (typeof a !== "number" || typeof b !== "number" || Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) <= tolerance;
}

// ------------------------
// GENERATE QUESTION
// ------------------------
function generateQuestion() {
  if (gameOver) return;

  let x1 = Math.floor(Math.random() * 10);
  let y1 = Math.floor(Math.random() * 10);
  let x2 = Math.floor(Math.random() * 10 + 1);
  let y2 = Math.floor(Math.random() * 10);

  const slope = getSlope(x1, y1, x2, y2);
  currentCorrectAnswer = slope;

  document.getElementById("question").innerHTML =
    `Find the slope between (${x1}, ${y1}) and (${x2}, ${y2})`;
}

// ------------------------
// SLOPE FORMULA
// ------------------------
function getSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
}

// ------------------------
// PLAYER SUBMISSION
// ------------------------
function playerSubmit() {
  if (gameOver) return;

  const val = parseFloat(answerInput.value);
  answerInput.value = "";

  if (isNaN(val)) return; // invalid → ignore

  if (isCorrect(val, currentCorrectAnswer)) {
    moveHorse("Player", 20);
  } else {
    moveHorse("Player", 5);
  }

  checkWin();
  generateQuestion();
}

// ------------------------
// BOT ANSWERS (continuous per-bot loop)
// ------------------------
function startBotLoop(bot) {
  if (gameOver) return;

  const time = Math.random() * (bot.maxTime - bot.minTime) + bot.minTime;

  setTimeout(() => {
    if (gameOver) return;

    handleBotAnswer(bot);
    startBotLoop(bot);

  }, time);
}

function handleBotAnswer(bot) {
  if (gameOver) return;

  // Bot decides whether it gets the answer right
  const correct = Math.random() < bot.accuracy;

  if (correct) {
    moveHorse(bot.name, 15);
  } else {
    moveHorse(bot.name, 4);
  }

  checkWin();
}

// ------------------------
// MOVE HORSES (safe)
// ------------------------
function moveHorse(name, distance) {
  let id;
  if (name === "Player") id = "player";
  if (name === "Bot A") id = "botA";
  if (name === "Bot B") id = "botB";

  const horse = document.getElementById(id);
  if (!horse) return;

  let currentLeft = parseInt(horse.style.left);
  if (isNaN(currentLeft)) currentLeft = 0;

  const newLeft = currentLeft + distance;
  horse.style.left = newLeft + "px";
}

// ------------------------
// CHECK FOR WINNER (use visible positions)
// ------------------------
function checkWin() {
  const track = document.getElementById("track");
  const trackRect = track.getBoundingClientRect();

  const horses = {
    Player: document.getElementById("player"),
    "Bot A": document.getElementById("botA"),
    "Bot B": document.getElementById("botB")
  };

  for (const name in horses) {
    const h = horses[name];
    const rect = h.getBoundingClientRect();

    // check if the horse's front touches or passes the right edge of the visible track
    if (rect.right >= trackRect.right) {
      document.getElementById("status").textContent = `${name} Wins!`;
      gameOver = true;
      return;
    }
  }
}

// ------------------------
// Advance question with a tiny debounce so many answers in same frame don't spam
// ------------------------
function advanceQuestionWithDebounce() {
  const now = Date.now();
  if (now - lastQuestionAdvance < QUESTION_ADVANCE_DEBOUNCE_MS) return;
  lastQuestionAdvance = now;
  generateQuestion();
}

// ------------------------
// Start the game
// ------------------------
document.getElementById("submitBtn").addEventListener("click", playerSubmit);

// initial question then start bots
generateQuestion();
bots.forEach(bot => startBotLoop(bot));
