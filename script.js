const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart");

let pos = window.innerWidth / 2 - 25;
let enemies = [];
let score = 0;
let lives = 3;
let speed = 3;
let gameRunning = true;

// Move player
document.addEventListener("touchmove", (e) => {
  const x = e.touches[0].clientX;
  pos = x - 25;
  player.style.left = pos + "px";
});

// Spawn falling objects
function spawnEnemy() {
  if (!gameRunning) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * (window.innerWidth - 40) + "px";
  document.getElementById("game").appendChild(enemy);
  enemies.push({ el: enemy, y: -40 });

  setTimeout(spawnEnemy, 800); // spawn rate
}

// Game loop
function update() {
  if (!gameRunning) return;

  enemies.forEach((obj, i) => {
    obj.y += speed;
    obj.el.style.top = obj.y + "px";

    // Collision
    const p = player.getBoundingClientRect();
    const e = obj.el.getBoundingClientRect();

    if (
      e.bottom >= p.top &&
      e.top <= p.bottom &&
      e.right >= p.left &&
      e.left <= p.right
    ) {
      lives--;
      livesEl.textContent = "Lives: " + lives;
      obj.el.remove();
      enemies.splice(i, 1);

      if (lives <= 0) endGame();
    }

    // Passed bottom
    if (obj.y > window.innerHeight) {
      score++;
      scoreEl.textContent = "Score: " + score;
      obj.el.remove();
      enemies.splice(i, 1);

      if (score % 5 === 0) speed += 0.5;
    }
  });

  requestAnimationFrame(update);
}

// End game
function endGame() {
  gameRunning = false;
  gameOverScreen.classList.remove("hidden");
}

// Restart
restartBtn.addEventListener("click", () => {
  location.reload();
});

spawnEnemy();
update();
