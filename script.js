// ------------------------
// BOT SETTINGS
// ------------------------
const bots = [
  { name: "Bot A", accuracy: 0.45, minTime: 1500, maxTime: 3500 },
  { name: "Bot B", accuracy: 0.55, minTime: 1800, maxTime: 3200 }
];

let currentCorrectAnswer = null;
let gameOver = false;

// ------------------------
// GENERATE QUESTION
// ------------------------
function generateQuestion() {
  if (gameOver) return;

  // Random points for slope
  let x1 = Math.floor(Math.random() * 10);
  let y1 = Math.floor(Math.random() * 10);
  let x2 = Math.floor(Math.random() * 10 + 1);
  let y2 = Math.floor(Math.random() * 10);

  const slope = getSlope(x1, y1, x2, y2);
  currentCorrectAnswer = slope;

  document.getElementById("question").innerHTML =
    `Find the slope between (${x1}, ${y1}) and (${x2}, ${y2})`;

  askBots(slope);
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
function askBots(correctAnswer) {
  bots.forEach(bot => {
    const time = Math.random() * (bot.maxTime - bot.minTime) + bot.minTime;

    setTimeout(() => {
      if (gameOver) return;

      let botAnswer;

      if (Math.random() < bot.accuracy) {
        botAnswer = correctAnswer;
      } else {
        botAnswer = correctAnswer + (Math.floor(Math.random() * 5) - 2);
      }

      handleBotAnswer(bot, botAnswer);

    }, time);
  });
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
  const currentLeft = parseInt(horse.style.left || "0");
  horse.style.left = (currentLeft + distance) + "px";
}

// ------------------------
// CHECK FOR WINNER
// ------------------------
function checkWin() {
  const track = document.getElementById("track");

  // Width of the track including borders
  const trackWidth = track.offsetWidth;

  // Horse width is 50px
  const horseWidth = 50;

  // Correct finish line inside track
  const finish = trackWidth - horseWidth - 10; // 10px padding so it looks clean

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
