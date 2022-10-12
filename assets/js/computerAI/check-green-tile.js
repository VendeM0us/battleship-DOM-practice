import { randomInt } from "../helpers/random-int.js";

let completedTiles = new Set();

export const checkGreenTile = (row, col) => {
  const greenTile = document.querySelector(`div[data-coordinate-computer="${row}-${col}"]`);
  if (greenTile.innerHTML === "" || greenTile.classList.contains("miss")) return false;

  if (completedTiles.has(greenTile.dataset.coordinateComputer)) return false;
  let tileChains = [greenTile.dataset.coordinateComputer];

  const shipNum = greenTile.innerHTML;

  const neighbors = [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]]
    .filter(coord => {
      const [row, col] = coord;
      if (row >= 0 && row < 9 && col >= 0 && col < 9) {
        const neighborTile = document.querySelector(`div[data-coordinate-computer="${row}-${col}"]`);
        return (neighborTile.innerHTML === "" && !neighborTile.classList.contains("miss"))
          || neighborTile.innerHTML === shipNum;
      }

      return false;
    });

  const adjacentCoords = neighbors.filter(coord => {
    const [row, col] = coord;
    const checkTile = document.querySelector(`div[data-coordinate-computer="${row}-${col}"]`);
    if (checkTile.innerHTML === shipNum) {
      tileChains.push(checkTile.dataset.coordinateComputer);
      return true;
    }
  });

  let returnCoords = [];

  let chainCount = 1 + adjacentCoords.length;
  adjacentCoords.forEach(coord => {
    const [nrow, ncol] = coord;
    const rowOffset = nrow - row, colOffset = ncol - col;
    const checkNextCoord = [nrow + rowOffset, ncol + colOffset];
    let prev = coord;
    let curr = checkNextCoord;

    let hasChain = true;
    while (hasChain) {
      const [row, col] = prev;
      const [nrow, ncol] = curr;

      if (nrow >= 0 && nrow < 9 && ncol >= 0 && ncol < 9) {
        const checkTile = document.querySelector(`div[data-coordinate-computer="${nrow}-${ncol}"]`);
        
        if (checkTile.innerHTML === shipNum) {
          chainCount++;
          const rowOffset = nrow - row, colOffset = ncol - col;
          const checkNextCoord = [nrow + rowOffset, ncol + colOffset];
          prev = curr;
          curr = checkNextCoord;
          tileChains.push(checkTile.dataset.coordinateComputer);
        } else {
          if (checkTile.innerHTML === "" && !checkTile.classList.contains("miss")) {
            returnCoords.push(checkTile.dataset.coordinateComputer);
          }
          hasChain = false;
        }
      } else {
        hasChain = false;
      }
    }
  });

  if (chainCount !== parseInt(shipNum)) {
    if (adjacentCoords.length === 1) {
      const [nrow, ncol] = adjacentCoords[0];
      const rowOffset = row - nrow, colOffset = col - ncol;
      const checkCoord = [row + rowOffset, col + colOffset];

      if (checkCoord[0] >= 0 && checkCoord[0] < 9 && checkCoord[1] >= 0 && checkCoord[1] < 9) {
        const coordStr = `${checkCoord[0]}-${checkCoord[1]}`;
        const checkTile = document.querySelector(`div[data-coordinate-computer="${coordStr}"]`);
        if (checkTile.innerHTML === "" && !checkTile.classList.contains("miss"))
          returnCoords.push(coordStr);
      }
    } else if (adjacentCoords.length === 0) {
      const randomIdx = randomInt(0, neighbors.length);
      const [row, col] = neighbors[randomIdx];
      return `${row}-${col}`;
    }

    const idx = randomInt(0, adjacentCoords.length);
    return returnCoords[idx];
  } else {
    tileChains.forEach(coord => completedTiles.add(coord));
  }
};