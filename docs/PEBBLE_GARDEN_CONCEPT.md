# Pebble Garden Concept

Date: 2026-06-25
Branch: `codex/pebble-garden-prototype`

## Why This Pivot

Signal Garden proved the route-and-space idea, but it may be too rule-heavy for the first App Store game. Pebble Garden keeps the research-backed strengths while making the mechanic more immediate and more emotionally readable:

- One tap to select a pebble.
- One tap to place it.
- Three or more touching pebbles of the same color clear.
- Marked flower beds grow from seed bed into sprout and then flower.
- The player blooms enough marked beds before the move limit or board pressure ends the round.

This is simpler, more tactile, and closer to the original cozy "pebbles" direction.

## Research Fit

Pebble Garden still maps to the strongest patterns found in the puzzle research:

- **Order restoration:** scattered colors become clean groups.
- **Competence:** every move has visible cause and effect.
- **Near-miss tension:** the board gradually fills, and one placement can save space.
- **Micro-reward:** clearing stones can use haptics, soft sound, and a satisfying pop.
- **Visible progress:** targeted clears change marked beds, so the player sees a small world improve.
- **Short sessions:** a round can last 30-90 seconds.
- **One-handed play:** the board and tray fit a thumb-first interaction model.

## Core Loop

1. The player receives three colored pebbles.
2. The player places pebbles onto empty cells.
3. Groups of three or more same-color pebbles connected orthogonally clear.
4. Cleared marked beds grow: seed bed becomes sprout, sprout becomes flower.
5. Cleared pebbles score points and free space.
6. A new tray appears after the three pebbles are used.
7. The game ends when the flower target is reached, moves run out, or the board fills.

## MVP Rules

Board:

- 6x6 grid.
- A few starter pebbles create an obvious first clear.
- Marked flower beds are the only cells that advance the goal.
- Empty cells can accept any pebble.

Tray:

- Three pebbles at a time.
- Pebbles have color only, no shape.
- The selected pebble is highlighted.

Clear:

- Three or more orthogonally connected pebbles of the same color clear.
- Larger groups give a bonus.
- Each cleared marked bed advances its garden stage.
- Clearing creates a score popup, sound, and haptic feedback in the native app.

Growth:

- Marked beds start as seed beds.
- First clear on a marked bed grows a sprout.
- Second clear on the same marked bed grows a flower.
- Flowers are a visible session goal and can give bonus points.
- The prototype seeds one opening sprout so the first successful clear can bloom a flower.

Target:

- The first test target is 4 flower beds before 14 moves run out.
- A progress bar makes the session goal visible after every move.
- Reaching the target ends the round in a win state.

Failure:

- Moves run out before the target is reached.
- The board fills with no empty cell.
- Final result shows score and flower beds bloomed.

## Why It Is Better For Version 1

Compared with Signal Garden:

- Fewer rules.
- No rotation required.
- No path topology to explain.
- Easier to implement natively.
- Easier to polish visually.
- More suitable for a cozy tactile art direction.
- Gives the player an emotional goal and a tactical target beyond score.

## Risks

- The mechanic may feel too familiar if it looks like a generic match game.
- It needs excellent tactile feel to avoid becoming flat.
- The growth layer must stay readable and not become hidden bookkeeping.

## Recommended Next Step

Use Pebble Garden as the first playable concept. The accepted first loop is:

> Clear pebbles to grow a small garden before the board fills up.

Current prototype variant:

- compact target mode with 4 marked beds and 14 moves.

Next, prototype two feel variants:

- relaxed endless score mode,
- daily seeded board with a flower target.
