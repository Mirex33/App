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
const baseLayout = {
  beds: [[1, 2], [2, 2], [2, 3], [3, 2], [3, 3], [4, 3]],
  growth: [[2, 2, 1]],
  pebbles: [
    [2, 2, "red"],
    [2, 3, "red"],
    [1, 1, "blue"],
    [1, 3, "blue"],
    [4, 2, "green"],
    [4, 4, "green"],
    [5, 1, "yellow"],
    [1, 5, "purple"],
  ],
  solution: [[2, 1], [1, 2], [4, 3], [2, 2], [2, 3], [2, 4], [1, 1], [1, 2], [1, 3], [4, 2], [4, 3], [4, 4]],
  trays: [
    ["red", "blue", "green"],
    ["red", "red", "red"],
    ["blue", "blue", "blue"],
    ["green", "green", "green"],
    ["yellow", "purple", "red"],
  ],
};
const levels = [
  createLevel({
    id: "first-bloom",
    name: "First Bloom",
    transform: "identity",
    targetFlowers: 2,
    moveLimit: 8,
    parMoves: 6,
    hint: "Bloom two marked beds before eight moves run out.",
  }),
  createLevel({
    id: "garden-turn",
    name: "Garden Turn",
    transform: "rotate-right",
    colorMap: { red: "blue", blue: "green", green: "red", yellow: "purple", purple: "yellow" },
    targetFlowers: 3,
    moveLimit: 11,
    parMoves: 9,
    hint: "Read the turned garden and keep useful clears together.",
  }),
  createLevel({
    id: "split-beds",
    name: "Split Beds",
    transform: "mirror",
    colorMap: { red: "green", blue: "red", green: "blue", yellow: "yellow", purple: "purple" },
    targetFlowers: 4,
    moveLimit: 14,
    parMoves: 12,
    hint: "Plan both sides of the garden before the tray changes.",
  }),
  createLevel({
    id: "tight-spiral",
    name: "Tight Spiral",
    transform: "rotate-180",
    colorMap: { red: "purple", blue: "yellow", green: "red", yellow: "green", purple: "blue" },
    targetFlowers: 4,
    moveLimit: 13,
    parMoves: 12,
    hint: "Only one spare move remains. Grow beds with every clear.",
  }),
  createLevel({
    id: "five-colors",
    name: "Five Colors",
    transform: "rotate-left",
    targetFlowers: 5,
    moveLimit: 15,
    parMoves: 13,
    hint: "The yellow bed is ready. Save its final stone for the finish.",
    extraBeds: [[1, 4]],
    extraGrowth: [[1, 4, 1]],
    extraPebbles: [[0, 4, "yellow"], [1, 4, "yellow"]],
    extraSolution: [[2, 4]],
  }),
];
const bestMovesStorageKey = "pebble-garden-best-moves";
const levelStorageKey = "pebble-garden-level";
const soundStorageKey = "pebble-garden-sound";
const hapticsStorageKey = "pebble-garden-haptics";

let board;
let growth;
let tray;
let flowerBedKeys;
let currentLevel;
let levelIndex = Math.min(levels.length - 1, Math.max(0, readNumberSetting(levelStorageKey, 0)));
let selectedIndex = 0;
let score = 0;
let round = 1;
let movesLeft = 0;
let trayIndex = 0;
let streak = 0;
let bestFlow = 0;
let bedClearMoves = 0;
let movesUsed = 0;
let lastBloomKeys;
let lastGrowthKeys;
let gameOver = false;
let roundWon = false;
let audioContext;
let soundEnabled = readBooleanSetting(soundStorageKey, true);
let hapticsEnabled = readBooleanSetting(hapticsStorageKey, true);

const boardEl = document.querySelector("#board");
const trayEl = document.querySelector("#tray");
const scoreEl = document.querySelector("#score");
const messageEl = document.querySelector("#message");
const gardenLabelEl = document.querySelector("#garden-label");
const goalLabelEl = document.querySelector("#goal-label");
const goalFillEl = document.querySelector("#goal-fill");
const flowLabelEl = document.querySelector("#flow-label");
const moveLabelEl = document.querySelector("#move-label");
const levelNameEl = document.querySelector("#level-name");
const levelProgressEl = document.querySelector("#level-progress");
const previousLevelButton = document.querySelector("#previous-level");
const nextLevelButton = document.querySelector("#next-level");
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
const menuButton = document.querySelector("#menu-button");
const settingsBackdropEl = document.querySelector("#settings-backdrop");
const soundToggleEl = document.querySelector("#sound-toggle");
const hapticsToggleEl = document.querySelector("#haptics-toggle");
const resumeGameButton = document.querySelector("#resume-game");
const restartGameButton = document.querySelector("#restart-game");

function createLevel(options) {
  const colorMap = options.colorMap || {};
  const transform = ([row, col]) => transformCell(row, col, options.transform);
  const beds = [...baseLayout.beds, ...(options.extraBeds || [])].map(transform);
  const growthEntries = [...baseLayout.growth, ...(options.extraGrowth || [])];
  const pebbleEntries = [...baseLayout.pebbles, ...(options.extraPebbles || [])];
  const solutionEntries = [...baseLayout.solution, ...(options.extraSolution || [])];

  return {
    ...options,
    beds,
    growth: growthEntries.map(([row, col, stage]) => [...transform([row, col]), stage]),
    pebbles: pebbleEntries.map(([row, col, color]) => [...transform([row, col]), colorMap[color] || color]),
    solution: solutionEntries.map(transform),
    trays: baseLayout.trays.map((trayColors) => trayColors.map((color) => colorMap[color] || color)),
  };
}

function transformCell(row, col, transform) {
  if (transform === "rotate-right") return [col, size - 1 - row];
  if (transform === "rotate-left") return [size - 1 - col, row];
  if (transform === "rotate-180") return [size - 1 - row, size - 1 - col];
  if (transform === "mirror") return [row, size - 1 - col];
  return [row, col];
}

function newGame() {
  currentLevel = levels[levelIndex];
  board = createBoard();
  growth = createBoard(0);
  flowerBedKeys = new Set(currentLevel.beds.map(([row, col]) => keyFor(row, col)));
  score = 0;
  round = 1;
  movesLeft = currentLevel.moveLimit;
  trayIndex = 0;
  streak = 0;
  bestFlow = 0;
  bedClearMoves = 0;
  movesUsed = 0;
  lastBloomKeys = new Set();
  lastGrowthKeys = new Set();
  selectedIndex = 0;
  gameOver = false;
  roundWon = false;
  resultBackdropEl.hidden = true;
  settingsBackdropEl.hidden = true;

  currentLevel.pebbles.forEach(([row, col, color]) => {
    board[row][col] = color;
  });
  currentLevel.growth.forEach(([row, col, stage]) => {
    growth[row][col] = stage;
  });

  tray = nextTray();
  setMessage(currentLevel.hint);
  render();
}

function createBoard(fill = null) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => fill));
}

function render() {
  const flowers = countFlowers();
  const progress = Math.min(1, flowers / currentLevel.targetFlowers);
  scoreEl.textContent = score;
  levelNameEl.textContent = `Level ${levelIndex + 1} - ${currentLevel.name}`;
  levelProgressEl.textContent = `${levelIndex + 1} / ${levels.length}`;
  previousLevelButton.disabled = levelIndex === 0;
  nextLevelButton.disabled = levelIndex === levels.length - 1;
  gardenLabelEl.textContent = `Beds ${flowers}/${currentLevel.targetFlowers}`;
  goalLabelEl.textContent = flowers >= currentLevel.targetFlowers ? "Goal Reached" : `Bloom ${currentLevel.targetFlowers} beds`;
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
  pebble.className = `pebble pebble-${color}`;
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
    playGameSound(clearResult.flowersGrown > 0 ? "bloom" : clearResult.bedsGrown > 0 ? "grow" : "clear");
    pulseHaptic();
  } else {
    streak = 0;
    score += 1;
    setMessage("Pebble placed. No bed grew.");
    playGameSound("place");
  }

  if (tray.length === 0) {
    round += 1;
    tray = nextTray();
    selectedIndex = 0;
  }

  const flowersAfterMove = countFlowers();
  if (flowersAfterMove >= currentLevel.targetFlowers) {
    setMessage("Goal reached. The garden bloomed.");
    finishGame(true, flowersAfterMove);
  } else if (movesLeft <= 0) {
    setMessage(`Out of moves. You bloomed ${flowersAfterMove} of ${currentLevel.targetFlowers} beds.`);
    finishGame(false, flowersAfterMove);
  } else if (isBoardFull()) {
    setMessage(`Garden full. You bloomed ${flowersAfterMove} of ${currentLevel.targetFlowers} beds.`);
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
  if (trayIndex < currentLevel.trays.length) {
    const scheduledTray = currentLevel.trays[trayIndex];
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
  roundWon = won;
  const bestKey = `${bestMovesStorageKey}-${currentLevel.id}`;
  const previousBest = readBestMoves(bestKey);
  const isNewBest = won && (previousBest === null || movesUsed < previousBest);
  const bestMoves = isNewBest ? movesUsed : previousBest;

  if (isNewBest) writeBestMoves(bestKey, movesUsed);

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
      : `Level best: ${bestMoves} moves`;
  playAgainButton.textContent = won && levelIndex < levels.length - 1 ? "Next Level" : "Play Again";
  renderRating(result.rating);
  resultBackdropEl.hidden = false;
  playAgainButton.focus();
}

function getRoundResult(won, flowers) {
  if (!won) {
    const remaining = currentLevel.targetFlowers - flowers;
    return {
      title: flowers >= currentLevel.targetFlowers - 1 ? "Almost Blooming" : "Garden Resting",
      copy: remaining === 1
        ? "One more flower would have saved the garden. Build Flow through the marked beds."
        : `${remaining} more flowers were needed. Use the previews to connect clears through marked beds.`,
      rating: 0,
    };
  }

  if (movesUsed <= currentLevel.parMoves) {
    return {
      title: "Perfect Bloom",
      copy: `You matched the garden target in ${movesUsed} moves. Try to beat this route next time.`,
      rating: 3,
    };
  }

  if (movesUsed <= currentLevel.parMoves + 1) {
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

function readBestMoves(key) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return null;
    const parsedValue = Number.parseInt(storedValue, 10);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function writeBestMoves(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // The prototype still works when browser storage is unavailable.
  }
}

function readNumberSetting(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return fallback;
    const parsedValue = Number.parseInt(storedValue, 10);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  } catch {
    return fallback;
  }
}

function changeLevel(offset) {
  const nextIndex = Math.min(levels.length - 1, Math.max(0, levelIndex + offset));
  if (nextIndex === levelIndex) return;
  levelIndex = nextIndex;
  writeNumberSetting(levelStorageKey, levelIndex);
  newGame();
}

function writeNumberSetting(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Level choice remains available for the current session.
  }
}

function continueAfterRound() {
  if (roundWon && levelIndex < levels.length - 1) {
    changeLevel(1);
  } else {
    newGame();
  }
}

function openSettings() {
  soundToggleEl.checked = soundEnabled;
  hapticsToggleEl.checked = hapticsEnabled;
  settingsBackdropEl.hidden = false;
  resumeGameButton.focus();
}

function closeSettings() {
  settingsBackdropEl.hidden = true;
  menuButton.focus();
}

function readBooleanSetting(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? fallback : storedValue === "true";
  } catch {
    return fallback;
  }
}

function writeBooleanSetting(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Settings remain available for the current session without browser storage.
  }
}

function playGameSound(kind) {
  if (!soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext ??= new AudioContextClass();
  const patterns = {
    place: [[210, 0]],
    clear: [[390, 0], [470, 0.05]],
    grow: [[430, 0], [590, 0.07]],
    bloom: [[520, 0], [690, 0.08], [820, 0.15]],
  };
  const notes = patterns[kind] || patterns.place;

  notes.forEach(([frequency, delay]) => {
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.06, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.16);
  });
}

function setClearMessage({ bedsGrown, cleared, flowersGrown }, flow) {
  const flowText = flow > 1 ? ` Flow x${flow}.` : "";
  if (flowersGrown > 0) {
    const remaining = Math.max(0, currentLevel.targetFlowers - countFlowers());
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
  if (hapticsEnabled && "vibrate" in navigator) {
    navigator.vibrate(18);
  }
}

previousLevelButton.addEventListener("click", () => changeLevel(-1));
nextLevelButton.addEventListener("click", () => changeLevel(1));
playAgainButton.addEventListener("click", continueAfterRound);
menuButton.addEventListener("click", openSettings);
resumeGameButton.addEventListener("click", closeSettings);
restartGameButton.addEventListener("click", newGame);
soundToggleEl.addEventListener("change", () => {
  soundEnabled = soundToggleEl.checked;
  writeBooleanSetting(soundStorageKey, soundEnabled);
  if (soundEnabled) playGameSound("grow");
});
hapticsToggleEl.addEventListener("change", () => {
  hapticsEnabled = hapticsToggleEl.checked;
  writeBooleanSetting(hapticsStorageKey, hapticsEnabled);
  pulseHaptic();
});
newGame();
