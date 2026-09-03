const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

class ClassList {
  add() {}
  toggle() {}
}

class ElementStub {
  constructor(selector = "") {
    this.selector = selector;
    this.classList = new ClassList();
    this.style = { setProperty() {}, width: "" };
    this.children = [];
    this.disabled = false;
    this.hidden = false;
    this.innerHTML = "";
    this.textContent = "";
  }

  addEventListener() {}
  appendChild(child) { this.children.push(child); }
  focus() {}
  setAttribute() {}
  querySelectorAll() {
    return [new ElementStub(), new ElementStub(), new ElementStub()];
  }
}

function createContext() {
  const elements = new Map();
  const storage = new Map();
  const document = {
    createElement: () => new ElementStub(),
    querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, new ElementStub(selector));
      return elements.get(selector);
    },
  };
  const localStorage = {
    getItem: (key) => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, value),
  };
  const window = { localStorage };

  return vm.createContext({
    console,
    document,
    navigator: { vibrate() {} },
    window,
  });
}

const source = fs.readFileSync(__dirname + "/game.js", "utf8");
const testBridge = `
  globalThis.testApi = {
    getResult: () => ({
      flowers: countFlowers(),
      gameOver,
      levelId: currentLevel.id,
      movesUsed,
      roundWon,
    }),
    playSolution: () => currentLevel.solution.forEach(([row, col]) => placePebble(row, col)),
    startLevel: (index) => {
      levelIndex = index;
      newGame();
    },
  };
`;
const context = createContext();
vm.runInContext(source + testBridge, context);

const expectedLevels = [
  { id: "first-bloom", flowers: 2, moves: 6 },
  { id: "garden-turn", flowers: 3, moves: 9 },
  { id: "split-beds", flowers: 4, moves: 12 },
  { id: "tight-spiral", flowers: 4, moves: 12 },
  { id: "five-colors", flowers: 5, moves: 13 },
];

expectedLevels.forEach((expected, index) => {
  context.testApi.startLevel(index);
  context.testApi.playSolution();
  const result = context.testApi.getResult();

  assert.equal(result.levelId, expected.id);
  assert.equal(result.flowers, expected.flowers);
  assert.equal(result.movesUsed, expected.moves);
  assert.equal(result.gameOver, true);
  assert.equal(result.roundWon, true);
});

console.log("Verified 5 Pebble Garden level solutions.");
