const size = 6;
const colors = ["red", "blue", "green", "yellow", "purple"];
const colorVars = {
  red: "var(--red)",
  blue: "var(--blue)",
  green: "var(--green)",
  yellow: "var(--yellow)",
  purple: "var(--purple)",
};
const neighbors = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

let board;
let growth;
let tray;
let selectedIndex = 0;
let score = 0;
let round = 1;
let gameOver = false;

const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const scoreEl = document.querySelector("#score");
const messageEl = document.querySelector("#message");
const gardenLabelEl = document.querySelector("#garden-label");
const newGameButton = document.querySelector("#new-game");

function newGame() {
  board = createBoard();
  growth = createBoard(0);
  score = 0;
  round = 1;
  selectedIndex = 0;
  gameOver = false;

  board[2][2] = "red";
  board[2][3] = "red";
  board[0][0] = "blue";
  board[4][4] = "green";
  board[5][1] = "yellow";
  board[1][5] = "purple";
  growth[2][2] = 1;

  tray = ["red", "blue", "green"];
  setMessage("Place the red pebble next to the two red pebbles to bloom the sprout.");
  render();
}

function createBoard(fill = null) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => fill));
}

function render() {
  scoreEl.textContent = score;
  gardenLabelEl.textContent = `Flowers ${countFlowers()}`;
  renderBoard();
  renderTray();
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const cell = document.createElement("button");
      const color = board[row][col];
      cell.type = "button";
      cell.className = color ? "cell filled" : "cell empty";
      if (growth[row][col] > 0) cell.classList.add(`growth-${growth[row][col]}`);
      cell.setAttribute("aria-label", cellLabel(row, col, color));

      if (growth[row][col] > 0) {
        cell.appendChild(createGrowthMark(growth[row][col]));
      }

      if (color) {
        cell.appendChild(createPebble(color));
      } else {
        cell.addEventListener("click", () => placePebble(row, col));
      }

      boardEl.appendChild(cell);
    }
  }
}

function cellLabel(row, col, color) {
  const stage = growth[row][col] === 2 ? "flower" : growth[row][col] === 1 ? "sprout" : "soil";
  if (color) return `${color} pebble on ${stage} row ${row + 1}, column ${col + 1}`;
  return `Empty ${stage} row ${row + 1}, column ${col + 1}`;
}

function renderTray() {
  trayEl.innerHTML = "";
  tray.forEach((color, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pebble-card";
    if (index === selectedIndex) card.classList.add("selected");
    card.setAttribute("aria-label", `${color} pebble`);
    card.appendChild(createPebble(color));
    card.addEventListener("click", () => {
      selectedIndex = index;
      renderTray();
    });
    trayEl.appendChild(card);
  });
}

function createGrowthMark(stage) {
  const mark = document.createElement("span");
  mark.className = "growth-mark";

  if (stage === 1) {
    const sprout = document.createElement("span");
    sprout.className = "sprout";
    mark.appendChild(sprout);
  } else {
    const flower = document.createElement("span");
    flower.className = "flower";
    for (let i = 0; i < 5; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      flower.appendChild(petal);
    }
    mark.appendChild(flower);
  }

  mark.setAttribute("aria-hidden", "true");
  return mark;
}

function createPebble(color) {
  const pebble = document.createElement("span");
  pebble.className = "pebble";
  pebble.style.setProperty("--pebble-color", colorVars[color]);
  pebble.setAttribute("aria-hidden", "true");
  return pebble;
}

function placePebble(row, col) {
  if (gameOver || board[row][col] || !tray[selectedIndex]) return;

  const color = tray[selectedIndex];
  board[row][col] = color;
  tray.splice(selectedIndex, 1);
  if (selectedIndex >= tray.length) selectedIndex = Math.max(0, tray.length - 1);

  const cleared = clearGroups(color);
  if (cleared > 0) {
    const bonus = cleared >= 5 ? 40 : 0;
    const flowerBonus = countFlowers() * 12;
    score += cleared * 20 + bonus + flowerBonus;
    setMessage(cleared >= 5 ? `Large group cleared. ${cleared} cells grew.` : `Group cleared. ${cleared} cells grew.`);
    pulseHaptic();
  } else {
    score += 2;
    setMessage("Pebble placed. Clear a group to grow sprouts and flowers.");
  }

  if (tray.length === 0) {
    round += 1;
    tray = nextTray();
    selectedIndex = 0;
  }

  if (isBoardFull()) {
    gameOver = true;
    setMessage(`Garden full. You grew ${countFlowers()} flowers.`);
  }

  render();
}

function clearGroups(color) {
  const visited = new Set();
  let totalCleared = 0;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== color) continue;
      const key = keyFor(row, col);
      if (visited.has(key)) continue;

      const group = collectGroup(row, col, color, visited);
      if (group.length >= 3) {
        group.forEach(([groupRow, groupCol]) => {
          board[groupRow][groupCol] = null;
          growth[groupRow][groupCol] = Math.min(2, growth[groupRow][groupCol] + 1);
        });
        totalCleared += group.length;
      }
    }
  }

  return totalCleared;
}

function collectGroup(startRow, startCol, color, visited) {
  const queue = [[startRow, startCol]];
  const group = [];
  visited.add(keyFor(startRow, startCol));

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    group.push([row, col]);

    neighbors.forEach(([dr, dc]) => {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (!inside(nextRow, nextCol)) return;
      if (board[nextRow][nextCol] !== color) return;

      const nextKey = keyFor(nextRow, nextCol);
      if (visited.has(nextKey)) return;

      visited.add(nextKey);
      queue.push([nextRow, nextCol]);
    });
  }

  return group;
}

function nextTray() {
  const weights = round < 4 ? ["red", "blue", "green", "yellow"] : colors;
  return Array.from({ length: 3 }, () => weights[Math.floor(Math.random() * weights.length)]);
}

function inside(row, col) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function keyFor(row, col) {
  return `${row},${col}`;
}

function isBoardFull() {
  return board.every((row) => row.every(Boolean));
}

function countFlowers() {
  return growth.flat().filter((stage) => stage === 2).length;
}

function setMessage(text) {
  messageEl.textContent = text;
}

function pulseHaptic() {
  if ("vibrate" in navigator) {
    navigator.vibrate(18);
  }
}

newGameButton.addEventListener("click", newGame);
newGame();
