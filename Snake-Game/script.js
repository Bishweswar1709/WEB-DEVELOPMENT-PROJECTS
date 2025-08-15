document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  const W = (canvas.width = 400);
  const H = (canvas.height = 400);
  let cell = 20;

  const rows = H / cell;
  const columns = W / cell;

  ctx.font = "25px Poppins";
  ctx.fillStyle = "#78c1f3";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Press Space to start the Game", W / 2, H / 2);

  let gameOver = true;
  let IsGameStart = true;

  let snake, food;
  let gameInterval = 0;
  let gameSpeed = 250;

  function startGame() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = 0;
    }

    snake = new Snake();
    food = new Food();
    food.pickLocation();

    gameInterval = setInterval(() => {
      ctx.clearRect(0, 0, W, H);

      drawGrid();
      food.draw();
      snake.draw();
      snake.update();

      if (snake.eat(food)) {
        food.pickLocation();
      }

      snake.checkCollision();

      if (gameOver) {
        document.querySelector(
          ".score"
        ).innerText = `Game Over! Your Score is: ${snake.total}`;
      }

      document.querySelector(".score").innerText = `Score   ${snake.total}`;
    }, gameSpeed);
  }

  function drawGrid() {
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "#232332";
    ctx.shadowBlur = 0;

    for (let i = 1; i < cell; i++) {
      let f = (W / cell) * i;
      ctx.beginPath();
      ctx.moveTo(f, 0);
      ctx.lineTo(f, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, f);
      ctx.lineTo(W, f);
      ctx.stroke();
      ctx.closePath();
    }
  }

  window.addEventListener("keydown", (e) => {
    if (
      (e.key === " " || e.code == "Space" || e.keyCode == 32) &&
      IsGameStart
    ) {
      gameOver = false;
      IsGameStart = false;
      startGame();
    }

    const direction = e.key.replace("Arrow", "");
    if (snake) {
      snake.changeDirection(direction);
    }
  });

  function Snake() {
    this.x = 0;
    this.y = 0;

    this.xSpeed = cell * 1;
    this.ySpeed = 0;

    this.total = 0;
    this.tail = [];

    this.draw = function () {
      ctx.fillStyle = "#ffffff";

      for (let i = 0; i < this.tail.length; i++) {
        ctx.fillRect(this.tail[i].x, this.tail[i].y, cell, cell);
      }

      ctx.fillRect(this.x, this.y, cell, cell);
    };

    this.update = function () {
      if (gameOver) {
        return;
      }
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
      this.tail[this.total - 1] = { x: this.x, y: this.y };

      this.x += this.xSpeed;
      this.y += this.ySpeed;

      if (this.x >= W) {
        this.x = 0;
      }

      if (this.y >= H) {
        this.y = 0;
      }

      if (this.x < 0) {
        this.x = W - cell;
      }
      if (this.y < 0) {
        this.y = H - cell;
      }
    };

    this.changeDirection = function (direction) {
      switch (direction) {
        case "Up":
          if (this.ySpeed === 0) {
            this.xSpeed = 0;
            this.ySpeed = -cell * 1;
          }
          break;
        case "Down":
          if (this.ySpeed === 0) {
            this.xSpeed = 0;
            this.ySpeed = cell * 1;
          }
          break;
        case "Left":
          if (this.xSpeed === 0) {
            this.ySpeed = 0;
            this.xSpeed = -cell * 1;
          }
          break;
        case "Right":
          if (this.xSpeed === 0) {
            this.ySpeed = 0;
            this.xSpeed = cell * 1;
          }
          break;
      }
    };

    this.eat = function (food) {
      if (this.x === food.x && this.y === food.y) {
        this.total++;
        return true;
      }
      return false;
    };

    this.checkCollision = function () {
      for (let i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
          this.tail = [];
          this.total = 0;
          gameOver = true;
          IsGameStart = true;
        }
      }
    };
  }

  function Food() {
    this.x;
    this.y;
    this.color;

    this.pickLocation = function () {
      this.color = `hsl(${Math.random() * 360}, 100% , 50%)`;
      this.x = Math.floor(Math.random() * columns) * cell;
      this.y = Math.floor(Math.random() * rows) * cell;
    };

    this.draw = function () {
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, cell, cell);
      ctx.shadowBlur = 0;
    };
  }
});
