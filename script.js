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
// GENERATE QUESTION FUNCTIONS
// ------------------------

/**
 * Generates simple equations: a + b, a - b, a * b, a / b
 */
function generateSimpleEquation() {
  // Random integers including negatives
  const a = Math.floor(Math.random() * 21) - 10; // -10 to 10
  const b = Math.floor(Math.random() * 21) - 10; // -10 to 10

  // Random operator
  const operators = ["+", "-", "*", "/"];
  const op = operators[Math.floor(Math.random() * operators.length)];

  let answer;
  let expression = `${a} ${op} ${b}`;

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
      // Handle division by zero
      if (b === 0) return generateSimpleEquation();
      answer = a / b;
      break;
  }

  return { expression: expression, answer: answer };
}

/**
 * Generates complex equations with parentheses: a + b + (c * d)
 * Uses eval() to compute the result based on the order of operations (PEMDAS/BODMAS).
 */
function generateComplexEquation() {
  const a = Math.floor(Math.random() * 11) - 5; // -5 to 5
  const b = Math.floor(Math.random() * 11) - 5; // -5 to 5
  const c = Math.floor(Math.random() * 6); // 0 to 5
  const d = Math.floor(Math.random() * 6); // 0 to 5

  const expression = `${a} + ${b} + (${c} * ${d})`;
  
  // Use eval() to safely compute the answer for the complex string expression.
  const answer = eval(expression); 

  return { expression: expression, answer: answer };
}

// ------------------------
// MAIN GENERATE QUESTION
// ------------------------
function generateQuestion() {
  if (gameOver) return;

  // Array of question-generating functions (the question bank)
  const questionBank = [
    generateSimpleEquation, 
    generateComplexEquation
  ];

  // Randomly pick one generator
  const generatorIndex = Math.floor(Math.random() * questionBank.length);
  const generator = questionBank[generatorIndex];

  // Generate the question data
  let qData = generator();

  // Handle potential division results (only division needs rounding)
  let finalAnswer = qData.answer;
  if (qData.expression.includes('/')) {
    finalAnswer = roundToTwo(finalAnswer); 
  }

  // Display expression
  document.getElementById("question").innerHTML = `Solve: ${qData.expression}`;

  // Set the correct answer
  currentCorrectAnswer = finalAnswer;
}

function isCorrect(player, actual) {
  // Use a small tolerance for floating point comparisons
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
    moveHorse("Player", 20); // Move forward on correct answer
  } else {
    moveHorse("Player", -10); // Move backward on incorrect answer
    console.log("Player: Answer Incorrect! Moving backwards.");
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
    moveHorse(bot.name, -5); // Bots also move backward on wrong answers
  }

  checkWin();
}

// ------------------------
// MOVE HORSES
// ------------------------
function moveHorse(name, distance) {
  let id;
  if (name === "Player") id = "player";
  else if (name === "Bot A") id = "botA";
  else if (name === "Bot B") id = "botB";

  const horse = document.getElementById(id);
  if (!horse) return;

  let currentLeft = parseInt(horse.style.left);
  if (isNaN(currentLeft)) currentLeft = 0;

  let newLeft = currentLeft + distance;
  
  // Boundary check: prevent horse from moving past the start line (0px)
  if (newLeft < 0) {
    newLeft = 0;
  }

  horse.style.left = newLeft + "px";
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
    if (!h) continue; // Check if element exists
    
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