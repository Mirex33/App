const size = 7;
const dirs = ["N", "E", "S", "W"];
const opposite = { N: "S", E: "W", S: "N", W: "E" };
const delta = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
};
const sourceColors = {
  red: "var(--red)",
  blue: "var(--blue)",
  yellow: "var(--yellow)",
  green: "var(--green)",
};
const tileDefs = {
  straight: ["E", "W"],
  corner: ["N", "E"],
  tee: ["N", "E", "W"],
  cross: ["N", "E", "S", "W"],
};

let board;
let tray;
let selectedIndex = 0;
let score = 0;
let gameOver = false;

const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const scoreEl = document.querySelector("#score");
const messageEl = document.querySelector("#message");
const rotateButton = document.querySelector("#rotate");
const newGameButton = document.querySelector("#new-game");

function rotateDirs(input) {
  const next = { N: "E", E: "S", S: "W", W: "N" };
  return input.map((dir) => next[dir]).sort((a, b) => dirs.indexOf(a) - dirs.indexOf(b));
}

function makeTile(type, rotation = 0) {
  let connections = [...tileDefs[type]];
  for (let i = 0; i < rotation; i += 1) {
    connections = rotateDirs(connections);
  }
  return { type, rotation, connections };
}

function createEmptyBoard() {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function source(color, connections) {
  return { kind: "source", color, connections };
}

function placed(type, rotation = 0) {
  return { kind: "tile", ...makeTile(type, rotation) };
}

function newGame() {
  score = 0;
  gameOver = false;
  selectedIndex = 0;
  board = createEmptyBoard();

  board[3][0] = source("red", ["E"]);
  board[3][6] = source("red", ["W"]);
  board[0][2] = source("blue", ["S"]);
  board[6][2] = source("blue", ["N"]);
  board[0][5] = source("yellow", ["S"]);
  board[6][5] = source("yellow", ["N"]);

  board[3][1] = placed("straight", 0);
  board[3][2] = placed("straight", 0);
  board[3][4] = placed("straight", 0);
  board[3][5] = placed("straight", 0);
  board[1][2] = placed("straight", 1);
  board[2][2] = placed("corner", 1);

  tray = [
    makeTile("straight", 0),
    makeTile("corner", 0),
    makeTile("tee", 0),
  ];

  setMessage("Place the straight tile in the center gap to complete the red route.");
  render();
}

function setMessage(text) {
  messageEl.textContent = text;
}

function render() {
  scoreEl.textContent = score;
  renderBoard();
  renderTray();
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const cell = document.createElement("button");
      const item = board[row][col];
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("aria-label", cellLabel(row, col, item));

      if (!item) {
        cell.classList.add("empty");
        cell.addEventListener("click", () => placeSelected(row, col));
      } else if (item.kind === "source") {
        cell.classList.add("source");
        cell.innerHTML = sourceSvg(item);
      } else {
        cell.classList.add("path");
        cell.innerHTML = tileSvg(item.connections, false);
      }

      boardEl.appendChild(cell);
    }
  }
}

function cellLabel(row, col, item) {
  if (!item) return `Empty cell row ${row + 1}, column ${col + 1}`;
  if (item.kind === "source") return `${item.color} source row ${row + 1}, column ${col + 1}`;
  return `${item.type} tile row ${row + 1}, column ${col + 1}`;
}

function renderTray() {
  trayEl.innerHTML = "";
  tray.forEach((tile, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "tile-card";
    card.setAttribute("aria-label", `${tile.type} tile`);
    if (index === selectedIndex) card.classList.add("selected");
    card.innerHTML = tileSvg(tile.connections, true);
    card.addEventListener("click", () => {
      selectedIndex = index;
      renderTray();
    });
    trayEl.appendChild(card);
  });
}

function tileSvg(connections, soft) {
  const lines = connections
    .map((dir) => {
      const end = pointForDir(dir);
      return `<line class="track${soft ? " soft" : ""}" x1="50" y1="50" x2="${end[0]}" y2="${end[1]}"></line>`;
    })
    .join("");

  return `<svg class="tile-svg" viewBox="0 0 100 100" aria-hidden="true">${lines}<circle cx="50" cy="50" r="8" fill="currentColor"></circle></svg>`;
}

function sourceSvg(item) {
  const line = item.connections
    .map((dir) => {
      const end = pointForDir(dir);
      return `<line class="source-line" x1="50" y1="50" x2="${end[0]}" y2="${end[1]}" style="stroke:${sourceColors[item.color]}"></line>`;
    })
    .join("");
  return `<svg class="tile-svg" viewBox="0 0 100 100" aria-hidden="true">${line}<circle class="source-core" cx="50" cy="50" r="18" fill="${sourceColors[item.color]}"></circle></svg>`;
}

function pointForDir(dir) {
  if (dir === "N") return [50, 4];
  if (dir === "E") return [96, 50];
  if (dir === "S") return [50, 96];
  return [4, 50];
}

function placeSelected(row, col) {
  if (gameOver || board[row][col] || !tray[selectedIndex]) return;

  board[row][col] = { kind: "tile", ...tray[selectedIndex] };
  tray.splice(selectedIndex, 1);
  if (selectedIndex >= tray.length) selectedIndex = Math.max(0, tray.length - 1);

  const clearCount = clearCompletedSignals();
  if (clearCount > 0) {
    score += clearCount * 10 + 50;
    setMessage(`Signal cleared. ${clearCount} tiles returned to the garden.`);
    pulseHaptic();
  } else {
    setMessage("Good. Keep shaping routes before the board fills.");
  }

  if (tray.length === 0) {
    tray = nextTray();
    selectedIndex = 0;
  }

  if (isBoardFull()) {
    gameOver = true;
    setMessage("Board locked. Start a new board and try to clear earlier.");
  }

  render();
}

function nextTray() {
  const options = [
    ["straight", 0],
    ["straight", 1],
    ["corner", 0],
    ["corner", 1],
    ["corner", 2],
    ["corner", 3],
    ["tee", 0],
    ["tee", 1],
  ];
  return Array.from({ length: 3 }, () => {
    const pick = options[Math.floor(Math.random() * options.length)];
    return makeTile(pick[0], pick[1]);
  });
}

function clearCompletedSignals() {
  const components = findComponents();
  let cellsToClear = [];

  components.forEach((component) => {
    const sourceSet = component.nodes
      .map(([row, col]) => board[row][col])
      .filter((item) => item?.kind === "source");
    const colors = [...new Set(sourceSet.map((item) => item.color))];
    const hasMatchingPair = colors.some((color) => sourceSet.filter((item) => item.color === color).length >= 2);

    if (hasMatchingPair && colors.length === 1) {
      cellsToClear = cellsToClear.concat(component.nodes.filter(([row, col]) => board[row][col]?.kind === "tile"));
    } else if (sourceSet.length === 0 && component.edges >= component.nodes.length && component.nodes.length >= 4) {
      cellsToClear = cellsToClear.concat(component.nodes);
      score += 40;
      setMessage("Loop bonus. Closed paths clear even without a source.");
    }
  });

  cellsToClear.forEach(([row, col]) => {
    board[row][col] = null;
  });

  return cellsToClear.length;
}

function findComponents() {
  const visited = new Set();
  const components = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!board[row][col]) continue;
      const key = keyFor(row, col);
      if (visited.has(key)) continue;

      const queue = [[row, col]];
      const nodes = [];
      let edgeCount = 0;
      visited.add(key);

      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift();
        nodes.push([currentRow, currentCol]);
        const current = board[currentRow][currentCol];

        current.connections.forEach((dir) => {
          const [dr, dc] = delta[dir];
          const nextRow = currentRow + dr;
          const nextCol = currentCol + dc;
          if (!inside(nextRow, nextCol)) return;
          const next = board[nextRow][nextCol];
          if (!next || !next.connections.includes(opposite[dir])) return;

          edgeCount += 1;
          const nextKey = keyFor(nextRow, nextCol);
          if (!visited.has(nextKey)) {
            visited.add(nextKey);
            queue.push([nextRow, nextCol]);
          }
        });
      }

      components.push({ nodes, edges: edgeCount / 2 });
    }
  }

  return components;
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

function rotateSelected() {
  if (!tray[selectedIndex]) return;
  tray[selectedIndex].connections = rotateDirs(tray[selectedIndex].connections);
  tray[selectedIndex].rotation = (tray[selectedIndex].rotation + 1) % 4;
  renderTray();
}

function pulseHaptic() {
  if ("vibrate" in navigator) {
    navigator.vibrate(18);
  }
}

rotateButton.addEventListener("click", rotateSelected);
newGameButton.addEventListener("click", newGame);

newGame();
