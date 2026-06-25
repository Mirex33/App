# Concept Research

Date: 2026-06-25
Branch: `codex/concept-research`

## Executive Summary

The best first App Store target is a calm, one-handed puzzle game with a short session loop, clear visual feedback, and a single deep mechanic. The strongest opportunity is not to clone match-3, block puzzle, or sorting games, but to combine their most durable strengths:

- The space-management tension of block puzzles.
- The route-completion satisfaction of connection puzzles.
- The order-restoration appeal of sorting and traffic puzzles.
- The fast feedback and cascading reward language of match-3 games.
- The habit-forming rhythm of daily puzzles, without a heavy content treadmill.

Recommended MVP concept: **Signal Garden**, a grid-based route-and-space puzzle where the player places simple path tiles to connect colored sources, complete loops, and clear space before the board locks up.

## Data Scope

Market snapshot sources:

- Apple iTunes RSS, US, Top Free Applications in Puzzle, updated 2026-06-25: https://itunes.apple.com/us/rss/topfreeapplications/limit=100/genre=7012/json
- Apple iTunes RSS, US, Top Grossing Applications in Puzzle, updated 2026-06-25: https://itunes.apple.com/us/rss/topgrossingapplications/limit=100/genre=7012/json
- Apple iTunes RSS, US, Top Free Applications in Games, updated 2026-06-25: https://itunes.apple.com/us/rss/topfreeapplications/limit=100/genre=6014/json
- Apple iTunes RSS, US, Top Grossing Applications in Games, updated 2026-06-25: https://itunes.apple.com/us/rss/topgrossingapplications/limit=100/genre=6014/json
- Ryan, Rigby, and Przybylski, "The Motivational Pull of Video Games: A Self-Determination Theory Approach": https://link.springer.com/article/10.1007/s11031-006-9051-8

This is a point-in-time US App Store read, not a lifetime market report. Rankings can change daily.

## Market Snapshot

### Top Free Puzzle Signals

The top free puzzle chart currently has several important clusters:

| Rank | Title | Studio | Pattern |
| --- | --- | --- | --- |
| 1 | Meowdoku! | Oakever Games | Pure logic, daily/offline positioning, minimal rules |
| 2 | Block Out! - Color Sort Puzzle | Grand Games | Sliding blocks, color matching, dynamic obstacles |
| 3 | Magic Sort! | Grand Games | Color sorting, soothing order restoration |
| 4 | Arrows - Puzzle Escape | Lessmore | Directional traffic/escape puzzle |
| 5 | Bus Traffic Fever! | GOODROID | Traffic sorting and congestion relief |
| 6 | Block Blast! | Hungry Studio | Block placement, line clearing, board pressure |
| 7 | Pixel Flow! | Loom Games | Visual completion and flow/path appeal |
| 11-12 | Tasty Travels, Gossip Harbor | Century Games, Microfun | Merge plus story/meta progression |
| 17 | Royal Match | Dream Games | Match-3 with high polish and progression |
| 23 | Candy Crush Saga | King | Match-3 level structure and cascade rewards |
| 26 | Match Factory! | Peak Games | 3D matching/search plus high production value |

### Top Grossing Puzzle Signals

The grossing chart is dominated by mature puzzle businesses:

| Rank | Title | Studio | Pattern |
| --- | --- | --- | --- |
| 1 | Royal Match | Dream Games | Match-3, level diversity, powerful feedback |
| 2 | Candy Crush Saga | King | Match-3, levels, boosters, long-term progression |
| 3 | Gossip Harbor | Microfun | Merge plus story/meta retention |
| 4 | Township | Playrix | Match/merge/farming meta hybrid |
| 5 | Royal Kingdom | Dream Games | Match-3 sequel with franchise expansion |
| 6 | Toon Blast | Peak Games | Tap-to-clear blocks, cartoon polish |
| 7 | Pixel Flow! | Loom Games | Flow/path completion |
| 9 | Match Factory! | Peak Games | 3D matching, object search, collection |
| 11 | Block Out! | Grand Games | Color/block sorting |
| 16 | Magic Sort! | Grand Games | Color sorting |
| 22 | Color Block Jam | Rollic | Block/traffic jam puzzle |
| 27-28 | Triple Match City, Triple Match 3D | Breeze, Boombox | 3D matching/search |

Interpretation:

- Top free rewards novelty and fast installs: new pure-logic, sorting, traffic, and block puzzle variants can climb quickly.
- Top grossing rewards polished systems: match-3, merge/story, and content-heavy games monetize better, but they are expensive to build well.
- For a first app, a small original puzzle with a premium feel is more realistic than competing directly with match-3 content factories.

## Psychological Drivers

Research on game motivation connects enjoyment and continued play to autonomy, competence, and relatedness. For a solo offline puzzle, competence is the main lever, autonomy is the second, and relatedness can wait until later through optional daily sharing or leaderboards.

### Why These Games Work

1. **Competence**
   - Players stay when each move teaches them something.
   - Good puzzle games show cause and effect instantly.
   - The player should feel "I solved that" rather than "the game gave me that."

2. **Autonomy**
   - The player needs meaningful choices, even inside simple rules.
   - Examples: where to place a piece, which route to complete first, whether to take a risky setup.
   - No timers in the first version; time pressure can come later as an optional mode.

3. **Flow**
   - The best session balances challenge and skill.
   - Clear goals, immediate feedback, and gradually rising complexity help a player lose track of time.
   - A puzzle should become harder because the board state becomes more interesting, not because rules become confusing.

4. **Order Restoration**
   - Sorting, matching, traffic, and block-clearing games all convert chaos into order.
   - This is emotionally satisfying on a small phone screen because progress is visible after every action.

5. **Near-Miss Tension**
   - Block Blast works because players often feel one piece away from saving the board.
   - Near-misses should be readable and fair, not random punishment.

6. **Micro-Reward**
   - Sound, haptics, particles, tile movement, and score feedback make correct actions feel good.
   - A first version should prioritize tactile feel over complex features.

7. **Habit**
   - Daily puzzles create a gentle return loop.
   - For MVP, daily seeds can be generated locally without a server.

## Competitor Lessons

| Game Pattern | What To Borrow | What To Avoid |
| --- | --- | --- |
| Block Blast | Three-piece choice, board pressure, fast restart | Looking like a Tetris clone, ad-heavy feel |
| Royal Match / Candy Crush | Strong feedback, level goals, clear failure state | Content treadmill, aggressive boosters, high production burden |
| Magic Sort / color sorting | Calm order restoration, simple touch model | Too many identical sorting clones |
| Traffic jam puzzles | Directional blocking, visible "unlock" moments | Fiddly controls and cramped boards |
| Merge/story games | Long-term collection fantasy | Large content scope, narrative workload |
| Daily word/logic games | Habit and shareable progress | Too dry for a visual mobile game |
| 3D match games | Tactile object search and collection | Asset-heavy pipeline, visual clutter |

## Concept Candidates

Scores use 1-5, where 5 is strongest for this project.

| Concept | One-Line Pitch | Simplicity | Originality | Retention | App Store Risk | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Signal Garden | Place path tiles to connect colored sources, complete loops, and clear space. | 5 | 4 | 4 | 4 | 17 |
| Pocket Switchboard | Rotate tiny switch nodes to route colored signals through a compact board. | 4 | 4 | 4 | 4 | 16 |
| Tidy Grid | Slide colored blocks into matching exits while new blockers enter the board. | 4 | 3 | 4 | 3 | 14 |
| Quiet Merge | Merge small objects into cleaner forms while managing limited tray space. | 3 | 3 | 5 | 2 | 13 |
| Daily Glyphs | Solve one handcrafted symbol-placement logic puzzle per day. | 4 | 4 | 3 | 5 | 16 |

App Store Risk measures clone risk, content burden, monetization expectations, and first-version feasibility. Higher is better.

## Recommended Concept: Signal Garden

### Core Idea

Signal Garden is a calm path-placement puzzle. The player receives three small path tiles at a time. Each tile contains a simple route shape: straight line, corner, T-junction, bridge, or splitter. The player places tiles on a compact grid to connect matching colored sources. Completed paths clear from the board and create space. The game ends when no tile can be placed.

### Why It Fits

- It borrows Block Blast's space tension without copying its line-clearing identity.
- It borrows flow-connection satisfaction without becoming a direct Flow Free clone.
- It creates strong visible progress: closed routes glow, clear, and free space.
- It works with one hand and no text-heavy tutorial.
- It can be implemented with simple 2D shapes before custom art exists.
- It can support both endless score and daily puzzle seeds later.

### MVP Rules

Board:

- 7x7 grid for the first prototype.
- Two to four colored source nodes appear on board edges or fixed cells.
- The player receives three path tiles at a time.

Move:

- Tap a tile from the tray.
- Tap a valid empty cell on the board to place it.
- Optional: tap the selected tile to rotate before placing.

Clear:

- A path clears when it connects two matching source nodes.
- A closed loop can clear for bonus points.
- Clearing creates a short animation, haptic feedback, and score popup.

Failure:

- Game ends when none of the three tray tiles can be placed.

Scoring:

- Base points for each placed tile in a completed path.
- Bonus for longer paths.
- Bonus for loop clears.
- Streak multiplier for consecutive clears.

Progression:

- Start with straight and corner pieces.
- Add T-junctions and bridges after the player reaches score thresholds.
- Increase source count gradually.

### First Screens

- Home: Play, Daily, Settings, High Score.
- Gameplay: score, high score, board, tile tray, pause.
- Game Over: score, high score, retry.
- Settings: sound, haptics.

### First Visual Direction

Best initial style: **minimal tactile**.

Reasons:

- Easier to execute cleanly in SwiftUI/SpriteKit.
- More premium than a noisy hyper-casual clone.
- Better for focus and flow.
- Works well with subtle haptics and soft sound.

Palette direction:

- Background: warm off-white or deep graphite, depending on later design choice.
- Board: soft neutral cells.
- Signals: four strong but not neon colors.
- Effects: glow on completion, gentle particle clear, tiny vibration.

## MVP Validation Questions

Prototype testing should answer:

1. Does the player understand the goal within 10 seconds?
2. Does placing a tile feel good?
3. Does a clear feel obvious and satisfying?
4. Does the board become interesting before it becomes frustrating?
5. Does the player want to retry immediately after losing?
6. Does one session stay under two minutes?
7. Can the game be played comfortably with one thumb?

## Implementation Notes

Suggested first technical path:

- SwiftUI for menus and state.
- SpriteKit or SwiftUI Canvas for the board.
- Pure Swift model for board logic, so rules can be unit-tested without rendering.
- Local `UserDefaults` for high score and settings.
- No ads, in-app purchases, analytics, account system, or server for MVP.

Initial model objects:

- `Board`
- `Cell`
- `Tile`
- `TileShape`
- `ConnectionDirection`
- `SourceNode`
- `GameState`
- `ScoringRules`

Core logic tests:

- Tile placement validation.
- Rotation and connection matching.
- Path completion detection.
- Loop detection.
- No-move game-over detection.
- Score calculation.

## Next Decision

Proceed with **Signal Garden** as the MVP concept unless concept review rejects it. The next branch after concept approval should be `codex/design-direction`, with two fast moodboards:

- Minimal tactile light theme.
- Dark graphite signal theme.

After visual direction is selected, move to `codex/ios-foundation`.
