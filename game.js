// ---------- SCREENS ----------
const screens = {
  home: document.getElementById("home"),
  levels: document.getElementById("levels"),
  game: document.getElementById("gameScreen")
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const modeText = document.getElementById("modeText");
const leaderboardEl = document.getElementById("leaderboard");

const GRID = 20;
let tiles, snake, food, dx, dy, score, loop;

// ---------- NAV ----------
function show(screen) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[screen].classList.remove("hidden");
}

function goHome() {
  clearInterval(loop);
  loadLeaderboard();
  show("home");
}

function showLevels() {
  show("levels");
}

// ---------- USER ----------
function saveUser() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Enter username");
  localStorage.setItem("snakeUser", name);
}

function getUser() {
  return localStorage.getItem("snakeUser") || "Player";
}

// ---------- GAME ----------
function startGame(mode) {
  show("game");

  tiles = mode === "easy" ? 16 : 30;
  canvas.width = tiles * GRID;
  canvas.height = tiles * GRID;

  modeText.textContent =
    mode === "easy" ? "Easy Mode (16×16)" : "Big Map Mode";

  snake = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 }
  ];

  dx = 1;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  food = randomFood();

  clearInterval(loop);
  loop = setInterval(gameLoop, 120);
}

function gameLoop() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tiles || head.y >= tiles ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    saveScore();
    alert("Game Over!");
    goHome();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(p =>
    ctx.fillRect(p.x * GRID, p.y * GRID, GRID - 1, GRID - 1)
  );

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * GRID, food.y * GRID, GRID - 1, GRID - 1);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tiles),
    y: Math.floor(Math.random() * tiles)
  };
}

// ---------- LEADERBOARD ----------
function saveScore() {
  const scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  scores.push({ user: getUser(), score });
  localStorage.setItem("snakeScores", JSON.stringify(scores));
}

function loadLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
  leaderboardEl.innerHTML = "";

  scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.user} — ${s.score}`;
      leaderboardEl.appendChild(li);
    });
}

loadLeaderboard();

// ---------- CONTROLS (NO SCROLL) ----------
document.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // 🚫 stop page scrolling
  }

  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -1;
  }
  if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = 1;
  }
  if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1; dy = 0;
  }
  if (e.key === "ArrowRight" && dx === 0) {
    dx = 1; dy = 0;
  }
});
