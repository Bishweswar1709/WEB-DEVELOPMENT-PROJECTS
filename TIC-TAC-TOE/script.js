const startGame = document.querySelector(".startGame");
const playground = document.querySelector(".playground");
const startSquares = document.querySelectorAll(".startGame .square");
const squares = document.querySelectorAll(".playground .square");
const startRestartButton = document.getElementById("startRestartButton");
const results = document.querySelector(".results");

let oText = `<i class="fa-solid fa-o"></i>`;
let xText = ` <i class="fa-solid fa-x"></i>`;
let currentPlayer = "X";
let gameActive = true;

startSquares.forEach((square) => {
  square.addEventListener("click", (e) => {
    startSquares.forEach((e1) => {
      e1.classList.remove("active");
    });

    e.target.classList.add("active");
    currentPlayer = e.target.getAttribute("data-player");
  });
});

startRestartButton.addEventListener("click", (e) => {
  if (e.target.innerText === "Start Game") {
    startGame.style.display = "none";
    playground.style.display = "grid";
    e.target.innerText = "Restart Game";
  } else {
    startGame.style.display = "flex";
    playground.style.display = "none";
    e.target.innerText = "Start Game";
    clearSquares();
  }
});

function clearSquares() {
    results.innerText = "";
    gameActive = true;
    currentPlayer = "X";

      startSquares.forEach((e1) => {
      e1.classList.remove("active");
    });

    startSquares[0].classList.add("active");

  squares.forEach((square) => {
    square.innerHTML = "";
    square.classList.remove("winner");
    square.style.pointerEvents = "auto";
  });
}
squares.forEach((square) => {
  square.addEventListener("click", (e) => {
    if(!gameActive || square.innerHTML !== "") {
        return;
    }
    e.target.innerHTML = currentPlayer === "X" ? xText : oText;
    e.target.style.pointerEvents = "none";
    if (checkWinner()) {
        results.innerText = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }
    else if (checkDraw()) {
        results.innerHTML = "It's a Draw!";
        results.innerText = "Game Draw";
        gameActive = false;
        return;
    }

    computerMove();
  });
});

function computerMove() {
  let availableMoves = [];
  squares.forEach((square, index) => {
    if (square.innerHTML == "") {
      availableMoves.push(index);
    }
  });

  let randomChoice =
    availableMoves[Math.floor(Math.random() * availableMoves.length)];

  squares[randomChoice].innerHTML = currentPlayer === "X" ? oText : xText;
  squares[randomChoice].style.pointerEvents = "none";

    currentPlayer = currentPlayer === "X" ? "O" : "X";
     if (checkWinner()) {
        results.innerText = `${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }
    else if (checkDraw()) {
        results.innerHTML = "It's a Draw!";
        results.innerText = "Game Draw";
        gameActive = false;
        return;
    }


    currentPlayer = currentPlayer !== "X" ? "X" : "O";
}

function checkWinner() {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      squares[a].innerHTML &&
      squares[a].innerHTML === squares[b].innerHTML &&
      squares[a].innerHTML === squares[c].innerHTML
    ) {
        squares[a].classList.add("winner");
        squares[b].classList.add("winner");
        squares[c].classList.add("winner");
        return true;
    }
    
  }
    return false;
}

function checkDraw() {
  return Array.from(squares).every(square => square.innerHTML !== "");
}
