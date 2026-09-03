# Pebble Garden Levels And Art

Date: 2026-09-04
Branch: `codex/levels-and-art`

## Level Progression

The prototype now contains five deterministic levels. Each level has a verified solution and changes one main source of pressure at a time.

| Level | Goal | Limit | Target route | Main lesson |
| --- | ---: | ---: | ---: | --- |
| First Bloom | 2 flowers | 8 moves | 6 moves | Learn the two-stage bed cycle |
| Garden Turn | 3 flowers | 11 moves | 9 moves | Read a rotated board and new color order |
| Split Beds | 4 flowers | 14 moves | 12 moves | Plan clears across both sides |
| Tight Spiral | 4 flowers | 13 moves | 12 moves | Work with only one spare move |
| Five Colors | 5 flowers | 15 moves | 13 moves | Preserve the final yellow connection |

The level arrows remain open in the browser prototype so every board can be reviewed directly. A production build can replace this with sequential unlocking.

## Level Data

Each level defines:

- stable identifier and display name,
- target flower count,
- move limit and target route,
- coordinate transformation,
- optional color mapping,
- marked beds and starting growth,
- starter pebbles,
- deterministic tray sequence.

The shared pattern is transformed rather than duplicated. This keeps the prototype rules consistent while making every board visually distinct and easy to verify.

## Generated Game Art

The first gameplay asset set was generated with the built-in ImageGen workflow and saved at 256 by 256 pixels for the browser prototype.

Assets:

- `design/assets/game/pebble-red.png`
- `design/assets/game/pebble-blue.png`
- `design/assets/game/pebble-green.png`
- `design/assets/game/pebble-yellow.png`
- `design/assets/game/pebble-purple.png`
- `design/assets/game/sprout.png`
- `design/assets/game/flower.png`

Art direction:

- cozy stylized 3D clay render,
- direct top-down gameplay view,
- matte tactile surfaces,
- warm upper-left lighting,
- bold silhouettes that remain readable around 40 pixels,
- restrained texture and no decorative scene elements.

The current generator output includes a baked checkerboard backdrop rather than a true alpha channel. The browser prototype safely crops the pebble art inside existing oval masks and crops the botanical art inside compact silhouettes. Before native production, regenerate or properly extract clean-alpha master assets.

## Acceptance Checks

- Every level can be won using its stored target route.
- Goals complete in 6, 9, 12, 12, and 13 moves.
- Winning advances to the next level.
- The last level restarts instead of advancing past the set.
- Personal bests are stored independently for each level.
- Previous and next arrows disable at the ends of the set.
- Generated art remains readable on the compact board.
- The gameplay screen still fits a 375 by 667 viewport.

## Next Iteration

1. Observe first-time players on levels one through three.
2. Replace transformed boards with fully original layouts after the difficulty curve is validated.
3. Add sequential level unlocking and a compact level-complete map.
4. Produce clean-alpha native assets and engraved pebble identifiers for color accessibility.
