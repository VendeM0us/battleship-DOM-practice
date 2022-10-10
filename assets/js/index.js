import Board from "./board.js";

let board = new Board(); // creates a new game board
let allowHit = true;
const hitSound = new Audio("/assets/audios/hit-sound.wav");
const missSound = new Audio("/assets/audios/miss-sound.wav");

// Examine the grid of the game board in the browser console.
// Create the UI of the game using HTML elements based on this grid.
console.log(board.grid);

// Your code here
window.addEventListener("DOMContentLoaded", event => {
  const mainBoard = document.createElement("div");
  mainBoard.setAttribute("id", "main-board");
  document.body.appendChild(mainBoard);

  for (let i = 0; i < board.grid.length; i++) {
    const row = board.grid[i];

    for (let j = 0; j < row.length; j++) {
      const tile = document.createElement("div");
      tile.setAttribute("class", "main-board__tile");
      tile.setAttribute("data-coordinate", `${i}-${j}`);
      mainBoard.appendChild(tile);
    }
  }

  const resetButton = document.createElement("button");
  resetButton.setAttribute("id", "reset");
  resetButton.innerText = "RESET";
  document.body.appendChild(resetButton);

  resetButton.addEventListener("click", event => {
    const tiles = document.getElementsByClassName("main-board__tile");
    board.numRemaining = 17;

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove("hit", "miss");
      tiles[i].innerHTML = "";
    }
  });

  mainBoard.addEventListener("click", event => {
    console.log(board.numRemaining);
    if (allowHit) {
      const tile = event.target;
      const [row, col] = tile.dataset.coordinate.split("-").map(i => parseInt(i));
  
      const hit = board.makeHit(row, col);
      if (hit) {
        hitSound.currentTime = 0;
        hitSound.play();
        event.target.classList.add("class", "hit");
        event.target.innerHTML = hit;
      } else {
        missSound.currentTime = 0;
        missSound.play();
        event.target.classList.add("class", "miss");
      }

      if (board.isGameOver()) {
        let gameOverMessage = document.createElement("h2");
        gameOverMessage.setAttribute("id", "game-over");
        gameOverMessage.innerText = "YOU WIN";
        resetButton.before(gameOverMessage);
        allowHit = false;
      }
    }
  });
});