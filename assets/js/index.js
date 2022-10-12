import Board from "./board.js";
import { hitSound, missSound } from "./helpers/audios.js";
import { randomInt } from "./helpers/random-int.js";
import { checkGreenTile } from "./computerAI/check-green-tile.js";

let playerBoard = new Board(); // creates a new game board
let computerBoard = new Board();
let currentTurn = 'p'; // 'p' - player, 'c' - computer
let allowHit = true;

const foundWinner = () => {
  if (playerBoard.isGameOver() || computerBoard.isGameOver()) {
    const winner = playerBoard.isGameOver()
      ? 'Player'
      : 'Computer';

    document.getElementById("current-turn").innerText = `${winner} win!`;
    allowHit = false;
    return true;
  }

  return false;
};

const computerHit = async () => {
  if (allowHit) {
    document.getElementById("current-turn").innerText = "Computer's Turn";

    return setTimeout(() => {
      const rowLen = computerBoard.grid.length;
      const colLen = computerBoard.grid[0].length;
  
      let row, col, coord;
      let initialCoordSetted = false;

      const tiles = document.getElementById("main-board__computer").children;
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        [row, col] = tile.getAttribute("data-coordinate-computer")
          .split("-")
          .map(i => parseInt(i));
        const num = tile.innerHTML;

        const checkTile = checkGreenTile(row, col);
        if (checkTile) {
          coord = checkTile;
          [row, col] = coord.split("-").map(i => parseInt(i));
          initialCoordSetted = true;
          break;
        }
      }

      let validCoord = false;
      while (!validCoord) {
        // random coordinate
        if (!initialCoordSetted) {
          row = randomInt(0, rowLen);
          col = randomInt(0, colLen);
          coord = `${row}-${col}`;
        }
  
        const tile = document.querySelector(`div[data-coordinate-computer="${coord}"]`);
        if (!tile.classList.contains("hit") && !tile.classList.contains("miss")) {
          validCoord = true;

          const hit = computerBoard.makeHit(row, col);
  
          if (hit) {
            hitSound.currentTime = 0;
            hitSound.play();
            tile.classList.add("hit");
            tile.innerHTML = hit;
          } else {
            missSound.currentTime = 0;
            missSound.play();
            tile.classList.add("miss");
          }
        }
      }
  
      if (!foundWinner()) {
        document.getElementById("current-turn").innerText = "Player's Turn";
        currentTurn = 'p';
      }
    }, 2000);
  }
};

// Examine the grid of the game board in the browser console.
// Create the UI of the game using HTML elements based on this grid.
console.log(playerBoard.grid);

// Your code here
window.addEventListener("DOMContentLoaded", event => {
  // make a list
  for (let i = 0; i < playerBoard.grid.length; i++) {
    const row = playerBoard.grid[i];

    for (let j = 0; j < row.length; j++) {
      const playerTile = document.createElement("div");
      const compTile = document.createElement("div");
      playerTile.setAttribute("class", "main-board__tile");
      compTile.setAttribute("class", "main-board__tile");
      playerTile.setAttribute("data-coordinate-player", `${i}-${j}`);
      compTile.setAttribute("data-coordinate-computer", `${i}-${j}`)
      document.getElementById("main-board__player").appendChild(playerTile);
      document.getElementById("main-board__computer").appendChild(compTile);
    }
  }

  document.getElementById("main-board").addEventListener("click", async event => {
    if (allowHit 
      && currentTurn === 'p'
      && !event.target.classList.contains("miss")
      && !event.target.classList.contains("hit")) {
      const tile = event.target;
      const [row, col] = tile.dataset.coordinatePlayer.split("-").map(i => parseInt(i));
  
      const hit = playerBoard.makeHit(row, col);
      if (hit) {
        hitSound.currentTime = 0;
        hitSound.play();
        event.target.classList.add("hit");
        event.target.innerHTML = hit;
      } else {
        missSound.currentTime = 0;
        missSound.play();
        event.target.classList.add("miss");
      }
  
      if (!foundWinner()) {
        currentTurn = 'c';
        await computerHit();
      }
    }
  });

  document.getElementById("reset").addEventListener("click", event => {
    const tiles = document.getElementsByClassName("main-board__tile");
    playerBoard = new Board();
    computerBoard = new Board();
    playerBoard.numRemaining = 17;
    computerBoard.numRemaining = 17;

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove("hit", "miss");
      tiles[i].innerHTML = "";
    }

    document.getElementById("current-turn").innerText = "Player's Turn";
    currentTurn = 'p';
    allowHit = true;
  });
});