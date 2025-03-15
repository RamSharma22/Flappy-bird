// JavaScript Game Logic
const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

let birdTop = 250;
let gravity = 2;
let score = 0;
let gameInterval;
let poleInterval;
let isGameRunning = false;

// Function to create poles
function createPole() {
    const poleGap = 150; // Gap between top and bottom poles
    const poleWidth = 60;
    const poleLeft = 400; // Start position for poles

    // Random height for the top pole
    const poleTopHeight = Math.random() * (gameContainer.offsetHeight - poleGap - 100) + 50;

    // Create top pole
    const poleTop = document.createElement('div');
    poleTop.classList.add('obstacle');
    poleTop.style.left = poleLeft + 'px';
    poleTop.style.top = '0';
    poleTop.style.height = poleTopHeight + 'px';
    poleTop.style.width = poleWidth + 'px';
    gameContainer.appendChild(poleTop);

    // Create bottom pole
    const poleBottom = document.createElement('div');
    poleBottom.classList.add('obstacle');
    poleBottom.style.left = poleLeft + 'px';
    poleBottom.style.bottom = '0';
    poleBottom.style.height = (gameContainer.offsetHeight - poleTopHeight - poleGap) + 'px';
    poleBottom.style.width = poleWidth + 'px';
    gameContainer.appendChild(poleBottom);

    // Move poles
    let poleLeftPosition = poleLeft;
    const poleMoveInterval = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(poleMoveInterval);
            return;
        }

        poleLeftPosition -= 2;
        poleTop.style.left = poleLeftPosition + 'px';
        poleBottom.style.left = poleLeftPosition + 'px';

        // Remove poles when they go off-screen
        if (poleLeftPosition < -poleWidth) {
            clearInterval(poleMoveInterval);
            gameContainer.removeChild(poleTop);
            gameContainer.removeChild(poleBottom);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        }

        // Check for collision
        if (
            poleLeftPosition < 90 && poleLeftPosition > 50 &&
            (birdTop < poleTopHeight || birdTop > poleTopHeight + poleGap)
        ) {
            endGame();
        }
    }, 20);
}

// Function to end the game
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(poleInterval);
    restartButton.style.display = 'block';
    alert('Game Over! Your score: ' + score);
}

// Function to update the game state
function startGame() {
    if (!isGameRunning) return;

    birdTop += gravity;
    bird.style.top = birdTop + 'px';

    // Check for collision with ground or sky
    if (birdTop > 560 || birdTop < 0) {
        endGame();
    }
}

// Function to make the bird jump
function jump() {
    if (!isGameRunning) return;
    birdTop -= 60;
    bird.style.top = birdTop + 'px';
}

// Event listener for spacebar or up arrow to make the bird jump
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
    }
});

// Event listener for touch events (mobile)
document.addEventListener('touchstart', function() {
    jump();
});

// Start the game
startButton.addEventListener('click', function() {
    isGameRunning = true;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    birdTop = 250;
    bird.style.top = birdTop + 'px';
    gameInterval = setInterval(startGame, 20);
    poleInterval = setInterval(createPole, 2000);
});

// Restart the game
restartButton.addEventListener('click', function() {
    location.reload();
});