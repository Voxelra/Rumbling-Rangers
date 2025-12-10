// ------------------------
// BOT SETTINGS
// ------------------------
const bots = [
  { name: "Bot A", accuracy: 0.25, minTime: 500, maxTime: 1000 },
  { name: "Bot B", accuracy: 0.55, minTime: 600, maxTime: 1200 }
];

let currentCorrectAnswer = null;
let gameOver = false;

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

  const input = parseFloat(document.getElementById("answerInput").value);

  if (input === currentCorrectAnswer) {
    moveHorse("Player", 20);
  } else {
    moveHorse("Player", 5);
  }

  checkWin();
  generateQuestion();
}

// ------------------------
// BOT ANSWERS
// ------------------------
function startBotLoop(bot) {
  if (gameOver) return;

  const time = Math.random() * (bot.maxTime - bot.minTime) + bot.minTime;

  setTimeout(() => {
    if (gameOver) return;

    let botAnswer;
    if (Math.random() < bot.accuracy) {
      botAnswer = currentCorrectAnswer;
    } else {
      botAnswer = currentCorrectAnswer + (Math.floor(Math.random() * 5) - 2);
    }

    handleBotAnswer(bot, botAnswer);

    startBotLoop(bot);

  }, time);
}

function handleBotAnswer(bot, answer) {
  if (answer === currentCorrectAnswer) {
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

  let currentLeft = parseInt(horse.style.left);
  if (isNaN(currentLeft)) currentLeft = 0;

  const newLeft = currentLeft + distance;
  horse.style.left = newLeft + "px";
}

// ------------------------
// CHECK FOR WINNER
// ------------------------
function checkWin() {
  const track = document.getElementById("track");

  // Get the *internal* width of the track
  const trackWidth = track.clientWidth;

  // Horses are 50px wide
  const horseWidth = 50;

  const finish = trackWidth - horseWidth;

  // Get current horse positions (relative to track)
  const positions = {
    Player: parseInt(document.getElementById("player").style.left || "0"),
    "Bot A": parseInt(document.getElementById("botA").style.left || "0"),
    "Bot B": parseInt(document.getElementById("botB").style.left || "0")
  };

  for (const name in positions) {
    if (positions[name] >= finish) {
      document.getElementById("status").innerHTML = `${name} Wins!`;
      gameOver = true;
      return;
    }
  }
}

// Start the game
generateQuestion();
bots.forEach(bot => startBotLoop(bot));
