// ------------------------
// MISC.
// ------------------------

const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", playerSubmit);

// ------------------------
// BOT SETTINGS
// ------------------------
const bots = [
  { name: "Bot A", accuracy: 0.55, minTime: 600, maxTime: 1000 },
  { name: "Bot B", accuracy: 0.55, minTime: 600, maxTime: 1000 }
];

let currentCorrectAnswer = null;
let gameOver = false;

// ------------------------
// HELPER: ROUND NUMBERS
// ------------------------
function roundToTwo(num) {
  return parseFloat(num.toFixed(2));
}

// ------------------------
// GENERATE QUESTION
// ------------------------
function generateQuestion() {
  if (gameOver) return;

  const x1 = Math.floor(Math.random() * 10);
  const y1 = Math.floor(Math.random() * 10);
  const x2 = Math.floor(Math.random() * 10 + 1);
  const y2 = Math.floor(Math.random() * 10);

  const slope = getSlope(x1, y1, x2, y2);
  currentCorrectAnswer = roundToTwo(slope); // rounded to 2 decimals

  document.getElementById("question").innerHTML =
    `Find the slope between (${x1}, ${y1}) and (${x2}, ${y2}) (round to 2 decimals)`;
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

  if (val === currentCorrectAnswer) {
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
// MOVE HORSES
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

  horse.style.left = currentLeft + distance + "px";
}

// ------------------------
// CHECK FOR WINNER
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

    if (rect.right >= trackRect.right) {
      document.getElementById("status").textContent = `${name} Wins!`;
      gameOver = true;
      return;
    }
  }
}

// ------------------------
// START GAME
// ------------------------
generateQuestion();
bots.forEach(bot => startBotLoop(bot));
