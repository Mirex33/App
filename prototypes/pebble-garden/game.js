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
const targetFlowers = 4;
const moveLimit = 14;
const bestMovesStorageKey = "pebble-garden-best-moves";
const flowerBedKeys = new Set(["1,2", "2,2", "2,3", "3,2", "3,3", "4,3"]);
const traySchedule = [
  ["red", "blue", "green"],
  ["red", "red", "red"],
  ["blue", "blue", "blue"],
  ["green", "green", "green"],
  ["yellow", "purple", "red"],
];

let board;
let growth;
let tray;
let selectedIndex = 0;
let score = 0;
let round = 1;
let movesLeft = moveLimit;
let trayIndex = 0;
let streak = 0;
let bestFlow = 0;
let bedClearMoves = 0;
let movesUsed = 0;
let lastBloomKeys;
let lastGrowthKeys;
let gameOver = false;

const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const scoreEl = document.querySelector("#score");
const messageEl = document.querySelector("#message");
const gardenLabelEl = document.querySelector("#garden-label");
const goalLabelEl = document.querySelector("#goal-label");
const goalFillEl = document.querySelector("#goal-fill");
const flowLabelEl = document.querySelector("#flow-label");
const moveLabelEl = document.querySelector("#move-label");
const newGameButton = document.querySelector("#new-game");
const resultBackdropEl = document.querySelector("#result-backdrop");
const resultKickerEl = document.querySelector("#result-kicker");
const resultTitleEl = document.querySelector("#result-title");
const resultRatingEl = document.querySelector("#result-rating");
const resultCopyEl = document.querySelector("#result-copy");
const resultMovesEl = document.querySelector("#result-moves");
const resultGrowthEl = document.querySelector("#result-growth");
const resultFlowEl = document.querySelector("#result-flow");
const resultBestEl = document.querySelector("#result-best");
const playAgainButton = document.querySelector("#play-again");

function newGame() {
  board = createBoard();
  growth = createBoard(0);
  score = 0;
  round = 1;
  movesLeft = moveLimit;
  trayIndex = 0;
  streak = 0;
  bestFlow = 0;
  bedClearMoves = 0;
  movesUsed = 0;
  lastBloomKeys = new Set();
  lastGrowthKeys = new Set();
  selectedIndex = 0;
  gameOver = false;
  resultBackdropEl.hidden = true;

  board[2][2] = "red";
  board[2][3] = "red";
  board[1][1] = "blue";
  board[1][3] = "blue";
  board[4][2] = "green";
  board[4][4] = "green";
  board[5][1] = "yellow";
  board[1][5] = "purple";
  growth[2][2] = 1;

  tray = nextTray();
  setMessage("Clear groups through marked beds before moves run out.");
  render();
}

function createBoard(fill = null) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => fill));
}

function render() {
  const flowers = countFlowers();
  const progress = Math.min(1, flowers / targetFlowers);
  scoreEl.textContent = score;
  gardenLabelEl.textContent = `Beds ${flowers}/${targetFlowers}`;
  goalLabelEl.textContent = flowers >= targetFlowers ? "Goal Reached" : `Bloom ${targetFlowers} beds`;
  goalFillEl.style.width = `${Math.round(progress * 100)}%`;
  flowLabelEl.textContent = `Flow x${Math.max(1, streak)}`;
  moveLabelEl.textContent = movesLeft === 1 ? "1 move" : `${movesLeft} moves`;
  renderBoard();
  renderTray();
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const cell = document.createElement("button");
      const color = board[row][col];
      const key = keyFor(row, col);
      const preview = !color && !gameOver ? previewMove(row, col, tray[selectedIndex]) : null;
      cell.type = "button";
      cell.className = color ? "cell filled" : "cell empty";
      if (isFlowerBed(row, col)) cell.classList.add("bed");
      cell.disabled = gameOver || Boolean(color);
      if (isFlowerBed(row, col) && growth[row][col] > 0) cell.classList.add(`growth-${growth[row][col]}`);
      if (preview?.clears) {
        cell.classList.add("preview-clear");
        cell.style.setProperty("--preview-color", colorVars[tray[selectedIndex]]);
      }
      if (preview?.bedsGrown > 0) cell.classList.add("preview-grow");
      if (preview?.flowersGrown > 0) cell.classList.add("preview-bloom");
      if (lastGrowthKeys.has(key)) cell.classList.add("just-grew");
      if (lastBloomKeys.has(key)) cell.classList.add("just-bloomed");
      cell.setAttribute("aria-label", cellLabel(row, col, color, preview));

      if (isFlowerBed(row, col)) {
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

function cellLabel(row, col, color, preview = null) {
  const isBed = isFlowerBed(row, col);
  const stage = growth[row][col] === 2 ? "flower" : growth[row][col] === 1 ? "sprout" : isBed ? "seed bed" : "soil";
  if (color) return `${color} pebble on ${stage} row ${row + 1}, column ${col + 1}`;
  const previewText = preview?.flowersGrown > 0 ? ", would bloom a bed" : preview?.bedsGrown > 0 ? ", would grow a bed" : preview?.clears ? ", would clear pebbles" : "";
  return `Empty ${stage} row ${row + 1}, column ${col + 1}${previewText}`;
}

function renderTray() {
  trayEl.innerHTML = "";
  tray.forEach((color, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "pebble-card";
    card.disabled = gameOver;
    if (index === selectedIndex) card.classList.add("selected");
    card.setAttribute("aria-label", `${color} pebble`);
    card.appendChild(createPebble(color));
    card.addEventListener("click", () => {
      selectedIndex = index;
      render();
    });
    trayEl.appendChild(card);
  });
}

function createGrowthMark(stage) {
  const mark = document.createElement("span");
  mark.className = "growth-mark";

  if (stage === 0) {
    const seed = document.createElement("span");
    seed.className = "seed-bed";
    mark.appendChild(seed);
  } else if (stage === 1) {
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
  movesLeft -= 1;
  movesUsed += 1;
  lastBloomKeys = new Set();
  lastGrowthKeys = new Set();
  tray.splice(selectedIndex, 1);
  if (selectedIndex >= tray.length) selectedIndex = Math.max(0, tray.length - 1);

  const clearResult = clearGroups(color);
  if (clearResult.cleared > 0) {
    const bonus = clearResult.cleared >= 5 ? 40 : 0;
    if (clearResult.bedsGrown > 0) {
      streak = Math.min(3, streak + 1);
      bedClearMoves += 1;
    } else {
      streak = 0;
    }
    bestFlow = Math.max(bestFlow, streak);
    lastBloomKeys = new Set(clearResult.bloomKeys);
    lastGrowthKeys = new Set(clearResult.growthKeys);
    score += clearResult.cleared * 15 + clearResult.bedsGrown * 25 + clearResult.flowersGrown * 50 + bonus + streak * 12;
    setClearMessage(clearResult, streak);
    pulseHaptic();
  } else {
    streak = 0;
    score += 1;
    setMessage("Pebble placed. No bed grew.");
  }

  if (tray.length === 0) {
    round += 1;
    tray = nextTray();
    selectedIndex = 0;
  }

  const flowersAfterMove = countFlowers();
  if (flowersAfterMove >= targetFlowers) {
    setMessage("Goal reached. The garden bloomed.");
    finishGame(true, flowersAfterMove);
  } else if (movesLeft <= 0) {
    setMessage(`Out of moves. You bloomed ${flowersAfterMove} of ${targetFlowers} beds.`);
    finishGame(false, flowersAfterMove);
  } else if (isBoardFull()) {
    setMessage(`Garden full. You bloomed ${flowersAfterMove} of ${targetFlowers} beds.`);
    finishGame(false, flowersAfterMove);
  }

  render();
}

function clearGroups(color) {
  const visited = new Set();
  const result = {
    bedsGrown: 0,
    bloomKeys: [],
    cleared: 0,
    flowersGrown: 0,
    growthKeys: [],
  };

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== color) continue;
      const key = keyFor(row, col);
      if (visited.has(key)) continue;

      const group = collectGroup(row, col, color, visited);
      if (group.length >= 3) {
        group.forEach(([groupRow, groupCol]) => {
          board[groupRow][groupCol] = null;
          if (isFlowerBed(groupRow, groupCol)) {
            const previousStage = growth[groupRow][groupCol];
            growth[groupRow][groupCol] = Math.min(2, previousStage + 1);
            if (growth[groupRow][groupCol] > previousStage) {
              result.bedsGrown += 1;
              result.growthKeys.push(keyFor(groupRow, groupCol));
            }
            if (growth[groupRow][groupCol] === 2 && previousStage < 2) {
              result.flowersGrown += 1;
              result.bloomKeys.push(keyFor(groupRow, groupCol));
            }
          }
        });
        result.cleared += group.length;
      }
    }
  }

  return result;
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

function previewMove(row, col, color) {
  if (!color) return null;
  const group = collectPotentialGroup(row, col, color);
  if (group.length < 3) return null;

  return group.reduce((preview, [groupRow, groupCol]) => {
    if (!isFlowerBed(groupRow, groupCol) || growth[groupRow][groupCol] >= 2) return preview;
    preview.bedsGrown += 1;
    if (growth[groupRow][groupCol] === 1) preview.flowersGrown += 1;
    return preview;
  }, {
    bedsGrown: 0,
    clears: true,
    flowersGrown: 0,
    groupSize: group.length,
  });
}

function collectPotentialGroup(startRow, startCol, color) {
  const queue = [[startRow, startCol]];
  const group = [];
  const visited = new Set([keyFor(startRow, startCol)]);

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
  if (trayIndex < traySchedule.length) {
    const scheduledTray = traySchedule[trayIndex];
    trayIndex += 1;
    return [...scheduledTray];
  }

  const weights = round < 4 ? ["red", "blue", "green", "yellow"] : colors;
  return Array.from({ length: 3 }, () => weights[Math.floor(Math.random() * weights.length)]);
}

function inside(row, col) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function keyFor(row, col) {
  return `${row},${col}`;
}

function isFlowerBed(row, col) {
  return flowerBedKeys.has(keyFor(row, col));
}

function isBoardFull() {
  return board.every((row) => row.every(Boolean));
}

function countFlowers() {
  return growth.flat().filter((stage) => stage === 2).length;
}

function finishGame(won, flowers) {
  gameOver = true;
  const previousBest = readBestMoves();
  const isNewBest = won && (previousBest === null || movesUsed < previousBest);
  const bestMoves = isNewBest ? movesUsed : previousBest;

  if (isNewBest) writeBestMoves(movesUsed);

  const result = getRoundResult(won, flowers);
  resultKickerEl.textContent = won ? "Round Complete" : "Round Over";
  resultTitleEl.textContent = result.title;
  resultCopyEl.textContent = result.copy;
  resultMovesEl.textContent = movesUsed;
  resultGrowthEl.textContent = bedClearMoves;
  resultFlowEl.textContent = `x${Math.max(1, bestFlow)}`;
  resultBestEl.textContent = isNewBest
    ? `New personal best: ${movesUsed} moves`
    : bestMoves === null
      ? "Your first win will set a personal best."
      : `Personal best: ${bestMoves} moves`;
  renderRating(result.rating);
  resultBackdropEl.hidden = false;
  playAgainButton.focus();
}

function getRoundResult(won, flowers) {
  if (!won) {
    const remaining = targetFlowers - flowers;
    return {
      title: flowers >= targetFlowers - 1 ? "Almost Blooming" : "Garden Resting",
      copy: remaining === 1
        ? "One more flower would have saved the garden. Build Flow through the marked beds."
        : `${remaining} more flowers were needed. Use the previews to connect clears through marked beds.`,
      rating: 0,
    };
  }

  if (movesLeft >= 2) {
    return {
      title: "Perfect Bloom",
      copy: `You saved the garden with ${movesLeft} moves to spare. Now try to beat your route.`,
      rating: 3,
    };
  }

  if (movesLeft === 1) {
    return {
      title: "Garden Saved",
      copy: "A careful finish with one move to spare. A cleaner Flow can earn the final mark.",
      rating: 2,
    };
  }

  return {
    title: "Last-Move Bloom",
    copy: "You saved the garden on the final move. Every placement counted.",
    rating: 1,
  };
}

function renderRating(rating) {
  const marks = resultRatingEl.querySelectorAll(".result-mark");
  marks.forEach((mark, index) => mark.classList.toggle("earned", index < rating));
  resultRatingEl.setAttribute("aria-label", `${rating} out of 3 garden marks`);
}

function readBestMoves() {
  try {
    const storedValue = window.localStorage.getItem(bestMovesStorageKey);
    if (storedValue === null) return null;
    const parsedValue = Number.parseInt(storedValue, 10);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function writeBestMoves(value) {
  try {
    window.localStorage.setItem(bestMovesStorageKey, String(value));
  } catch {
    // The prototype still works when browser storage is unavailable.
  }
}

function setClearMessage({ bedsGrown, cleared, flowersGrown }, flow) {
  const flowText = flow > 1 ? ` Flow x${flow}.` : "";
  if (flowersGrown > 0) {
    const remaining = Math.max(0, targetFlowers - countFlowers());
    setMessage(remaining === 0 ? `Flower bed bloomed.${flowText}` : `Flower bed bloomed.${flowText} ${remaining} to go.`);
  } else if (bedsGrown > 0) {
    setMessage(`Bed sprouted.${flowText} Clear it again to bloom.`);
  } else {
    setMessage(`Group cleared. ${cleared} pebbles moved, but no bed grew.`);
  }
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
playAgainButton.addEventListener("click", newGame);
newGame();
