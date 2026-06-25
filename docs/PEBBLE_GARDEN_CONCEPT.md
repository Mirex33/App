# Pebble Garden Concept

Date: 2026-06-25
Branch: `codex/pebble-garden-prototype`

## Why This Pivot

Signal Garden proved the route-and-space idea, but it may be too rule-heavy for the first App Store game. Pebble Garden keeps the research-backed strengths while making the mechanic more immediate:

- One tap to select a pebble.
- One tap to place it.
- Three or more touching pebbles of the same color clear.
- The player manages board space until no empty cells remain.

This is simpler, more tactile, and closer to the original cozy "pebbles" direction.

## Research Fit

Pebble Garden still maps to the strongest patterns found in the puzzle research:

- **Order restoration:** scattered colors become clean groups.
- **Competence:** every move has visible cause and effect.
- **Near-miss tension:** the board gradually fills, and one placement can save space.
- **Micro-reward:** clearing stones can use haptics, soft sound, and a satisfying pop.
- **Short sessions:** a round can last 30-90 seconds.
- **One-handed play:** the board and tray fit a thumb-first interaction model.

## Core Loop

1. The player receives three colored pebbles.
2. The player places pebbles onto empty cells.
3. Groups of three or more same-color pebbles connected orthogonally clear.
4. Cleared pebbles score points and free space.
5. A new tray appears after the three pebbles are used.
6. The game ends when the board has no empty cells.

## MVP Rules

Board:

- 6x6 grid.
- A few starter pebbles create an obvious first clear.
- Empty cells can accept any pebble.

Tray:

- Three pebbles at a time.
- Pebbles have color only, no shape.
- The selected pebble is highlighted.

Clear:

- Three or more orthogonally connected pebbles of the same color clear.
- Larger groups give a bonus.
- Clearing creates a score popup, sound, and haptic feedback in the native app.

Failure:

- The board fills with no empty cell.

## Why It Is Better For Version 1

Compared with Signal Garden:

- Fewer rules.
- No rotation required.
- No path topology to explain.
- Easier to implement natively.
- Easier to polish visually.
- More suitable for a cozy tactile art direction.

## Risks

- The mechanic may feel too familiar if it looks like a generic match game.
- It needs excellent tactile feel to avoid becoming flat.
- It may need a second layer later, such as special pebbles, daily boards, or gentle objectives.

## Recommended Next Step

Use Pebble Garden as the first playable concept. Prototype the feel first, then decide whether the game needs one additional twist:

- limited tray choice,
- stone weights,
- garden tiles that grow after clears,
- daily puzzle seeds,
- or a calm streak system.
