const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverDisplay = document.getElementById("gameOver");

const eatRedSound = document.getElementById("eatRedSound");
const eatYellowSound = document.getElementById("eatYellowSound");
const deathSound = document.getElementById("deathSound");

const box = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [];
let score = 0;
let highScore = 0;
let d = "RIGHT";
let food = generateFood();
let specialFood = null;

function initializeGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    score = 0;
    d = "RIGHT";
    food = generateFood();
    specialFood = null;
    scoreDisplay.innerHTML = "Score: " + score;
    gameOverDisplay.innerHTML = `Your Current Score: ${highScore}`;
    gameOverDisplay.style.display = 'none';
}

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key === 37 && d !== "RIGHT") d = "LEFT";
    else if (key === 38 && d !== "DOWN") d = "UP";
    else if (key === 39 && d !== "LEFT") d = "RIGHT";
    else if (key === 40 && d !== "UP") d = "DOWN";
    else if (key === 65 && d !== "RIGHT") d = "LEFT"; 
    else if (key === 87 && d !== "DOWN") d = "UP"; 
    else if (key === 68 && d !== "LEFT") d = "RIGHT"; 
    else if (key === 83 && d !== "UP") d = "DOWN"; 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    if (specialFood) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(specialFood.x, specialFood.y, box, box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score += 5;
        eatRedSound.play();
        scoreDisplay.innerHTML = "Score: " + score;
        food = generateFood();
        if (Math.random() < 0.1) {
            specialFood = generateSpecialFood();
        }
    } else if (specialFood && snakeX === specialFood.x && snakeY === specialFood.y) {
        score += 15;
        eatYellowSound.play();
        scoreDisplay.innerHTML = "Score: " + score;
        specialFood = null;

        
        for (let i = 0; i < 3; i++) {
            snake.unshift({ x: snake[0].x, y: snake[0].y });
        }
    } else {
        snake.pop();
    }

    if (snakeX >= canvasSize) snakeX = 0;
    if (snakeX < 0) snakeX = canvasSize - box;
    if (snakeY >= canvasSize) snakeY = 0;
    if (snakeY < 0) snakeY = canvasSize - box;

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (collision(newHead, snake)) {
        clearInterval(game);
        deathSound.play();
        gameOver();
        setTimeout(() => {
            initializeGame();
            game = setInterval(draw, 100);
        }, 3000);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    let foodX, foodY;
    while (true) {
        foodX = Math.floor(Math.random() * 19 + 1) * box;
        foodY = Math.floor(Math.random() * 19 + 1) * box;
        if (!snake.some(segment => segment.x === foodX && segment.y === foodY)) {
            return { x: foodX, y: foodY };
        }
    }
}

function generateSpecialFood() {
    let foodX, foodY;
    while (true) {
        foodX = Math.floor(Math.random() * 19 + 1) * box;
        foodY = Math.floor(Math.random() * 19 + 1) * box;
        if (!snake.some(segment => segment.x === foodX && segment.y === foodY) && (foodX !== food.x || foodY !== food.y)) {
            return { x: foodX, y: foodY };
        }
    }
}

function gameOver() {
    highScore = score > highScore ? score : highScore;
    gameOverDisplay.innerHTML = `Your Current Score: ${highScore}`;
    gameOverDisplay.style.display = 'block';
}

let game = setInterval(draw, 100);
initializeGame();
