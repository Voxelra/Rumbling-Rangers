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
// ------------------------
// GENERATE BASIC MATH QUESTION
// ------------------------
function generateQuestion() {
  if (gameOver) return;

  // Random integers including negatives
  const a = Math.floor(Math.random() * 21) - 10; // -10 to 10
  const b = Math.floor(Math.random() * 21) - 10; // -10 to 10

  // Random operator
  const operators = ["+", "-", "*", "/"];
  const op = operators[Math.floor(Math.random() * operators.length)];

  // Build expression string
  document.getElementById("question").innerHTML =
    `Solve: ${a} ${op} ${b}`;

  // Compute correct answer
  let answer;

  switch (op) {
    case "+":
      answer = a + b;
      break;

    case "-":
      answer = a - b;
      break;

    case "*":
      answer = a * b;
      break;

    case "/":
      // Avoid division by zero
      if (b === 0) {
        generateQuestion();
        return;
      }
      answer = parseFloat((a / b).toFixed(2)); // round to 2 decimals
      break;
  }

  currentCorrectAnswer = answer;
}

function isCorrect(player, actual) {
  return Math.abs(player - actual) < 0.01; 
}

// ------------------------
// PLAYER SUBMISSION
// ------------------------
function playerSubmit() {
  if (gameOver) return;

  const val = parseFloat(answerInput.value);
  answerInput.value = "";

  if (isNaN(val)) return;

  if (isCorrect(val, currentCorrectAnswer)) {
    moveHorse("Player", 20);
  } else {
    moveHorse("Player", -5);
    console.log("Answer Incorrect: Horse move backwards!")
  } // Hope this works

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
    moveHorse(bot.name, -4);
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
