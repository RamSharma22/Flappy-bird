const bird = document.getElementById("bird");
const pipesContainer = document.getElementById("pipes");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const gameOverPanel = document.getElementById("game-over-panel");
const scoreDisplay = document.getElementById("score-display");
const finalScore = document.getElementById("final-score");

let birdTop = 250;
let gravity = 2;
let poleSpeed = 3;
let score = 0;
let gameInterval;
let poleGenerationInterval;
let isGameOver = false;

// Make the bird flap
function flap() {
  birdTop -= 50;
  bird.style.top = birdTop + "px";
}

// Event listeners for controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.key === "ArrowUp") {
    flap();
  }
});

document.addEventListener("touchstart", () => {
  flap();
});

// Generate poles
function generatePole() {
  const poleGap = 150;
  const poleHeight = Math.floor(Math.random() * 300) + 100;

  const topPole = document.createElement("div");
  topPole.classList.add("pipe");
  topPole.style.height = poleHeight + "px";
  topPole.style.top = "0";

  const bottomPole = document.createElement("div");
  bottomPole.classList.add("pipe", "bottom");
  bottomPole.style.height = 600 - poleHeight - poleGap + "px";
  bottomPole.style.bottom = "0";

  pipesContainer.appendChild(topPole);
  pipesContainer.appendChild(bottomPole);

  // Move poles
  let polePosition = 400;
  let scored = false;
  const poleInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(poleInterval);
      return;
    }
    polePosition -= poleSpeed;
    topPole.style.right = polePosition + "px";
    bottomPole.style.right = polePosition + "px";

    // Check for collision
    if (
      (polePosition < 90 && polePosition > 50) &&
      (birdTop < poleHeight || birdTop > poleHeight + poleGap - 40)
    ) {
      endGame();
    }

    // Increase score when the bird passes a pole
    if (polePosition < 50 && !scored) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      scored = true;
    }

    // Remove poles when they go off screen
    if (polePosition < -60) {
      clearInterval(poleInterval);
      pipesContainer.removeChild(topPole);
      pipesContainer.removeChild(bottomPole);
    }
  }, 20);
}

// Apply gravity to the bird
function applyGravity() {
  if (isGameOver) return;
  birdTop += gravity;
  bird.style.top = birdTop + "px";

  // Check for ground collision
  if (birdTop > 560) {
    endGame();
  }
}

// Start the game
function startGame() {
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  gameOverPanel.style.display = "none";
  birdTop = 250;
  bird.style.top = birdTop + "px";
  gameInterval = setInterval(applyGravity, 20);
  poleGenerationInterval = setInterval(generatePole, 2000);
}

// End the game
function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  clearInterval(poleGenerationInterval);
  finalScore.textContent = score;
  gameOverPanel.style.display = "block";
}

// Event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);