const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let score = 0;

function gameLoop() {
  update();
  draw();
}

function update() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // Wall collision
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    alert("Game Over! Score: " + score);
    resetGame();
    return;
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(
    food.x * gridSize,
    food.y * gridSize,
    gridSize - 1,
    gridSize - 1
  );
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  if (snake.some(s => s.x === food.x && s.y === food.y)) {
    placeFood();
  }
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  placeFood();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -1;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = 1;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = 1; dy = 0;
  }
});

setInterval(gameLoop, 120);
