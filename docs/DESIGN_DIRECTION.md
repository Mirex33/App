# Pebble Garden Design Direction

Date: 2026-09-04
Branch: `codex/design-direction`

## Design Goal

Pebble Garden should feel like a small tactile object that happens to live on an iPhone. The interface must be calm enough for a commute, readable in a glance, and expressive enough that blooming a bed feels like a real achievement.

The selected direction is **cozy tactile**: matte river stones, warm soil, fresh garden colors, restrained depth, and short physical animations. It should not look like a generic match-three game or a decorative wellness app.

## Product Principles

- Open directly into a playable board.
- Keep the current goal and remaining moves visible at all times.
- Use color, shape, motion, and haptics together for important feedback.
- Let the board carry most of the visual attention.
- Keep commands compact and familiar.
- Make success feel celebratory without interrupting the short-session rhythm.
- Make failure specific and immediately retryable.

## Visual Language

### Color Tokens

| Token | Hex | Purpose |
| --- | --- | --- |
| Canvas | `#F3EFE7` | App background |
| Surface | `#FFFAF1` | Sheets and primary interface surface |
| Soil | `#DED1BD` | Empty board cells |
| Soil Deep | `#CDBDA4` | Board surround and depth |
| Ink | `#1D211D` | Primary text |
| Muted Ink | `#6A716B` | Secondary text |
| Garden Green | `#2F8A68` | Focus, progress, primary action |
| Pebble Red | `#D95D56` | Red game piece |
| Pebble Blue | `#4E79C7` | Blue game piece |
| Leaf Green | `#56A66D` | Green game piece and growth |
| Sun Yellow | `#D5A743` | Yellow game piece and bloom highlight |
| Pebble Purple | `#8C73C9` | Purple game piece |

The neutral canvas and soil should occupy most of the screen. Gameplay colors are accents with similar visual weight, so no single hue dominates the product.

### Typography

- Primary family: SF Pro Rounded.
- Fallback: SF Pro Display.
- Screen title: 28-32 pt, bold.
- Goal and score values: 15-20 pt, heavy.
- Body and status: 14-15 pt, medium.
- Compact labels: 11-12 pt, bold, uppercase only when the label is short.
- Letter spacing remains at the system default.

### Shape And Material

- Pebbles use imperfect oval silhouettes rather than perfect circles.
- Board cells use 12-15 pt corner radii.
- Repeated panels use 12-16 pt corner radii.
- Result and settings sheets use an 18 pt corner radius.
- Shadows stay soft and warm, with no colored glow except during an active preview.
- Flower beds use an inset green boundary so they remain visible under a pebble.

## App Icon

The first icon uses three large colored pebbles, a single five-petal flower, and visible garden soil. It is intentionally simple enough to read at notification and search-result sizes.

Source asset:

- `design/assets/pebble-garden-app-icon-1024.png`

Production checks before App Store submission:

- Review at 1024, 180, 120, 60, and 40 pixels.
- Confirm the flower remains recognizable at 40 pixels.
- Confirm the important subjects remain inside the iOS corner mask.
- Export the final asset without transparency.

## Screen Flow

### 1. Play

The app launches directly into the current puzzle. The first session includes one obvious opening move, highlighted through the existing placement preview.

Persistent elements:

- title and score,
- one-line status feedback,
- garden target, Flow, and moves remaining,
- 6x6 board,
- three-pebble tray,
- compact restart command.

### 2. Pause And Settings

A compact sheet appears over the board and keeps the current round visible behind it.

Controls:

- resume,
- restart round,
- sound toggle,
- haptics toggle.

There is no account, shop, event feed, or secondary navigation in version 1.

### 3. Round Result

The result sheet uses the current prototype structure:

- outcome title,
- one to three garden marks for a win,
- concise explanation,
- moves used,
- bed-clearing moves,
- best Flow,
- personal best,
- one full-width Play Again action.

Loss uses zero garden marks and states exactly how many flowers were missing. The same Play Again action begins a new round immediately.

## Motion And Haptics

| Event | Visual response | Haptic response |
| --- | --- | --- |
| Select pebble | 1 pt lift and focus boundary | None |
| Valid clear preview | Colored inset boundary | None |
| Place pebble | 120-160 ms settle | Light impact |
| Clear group | 240-300 ms scale and fade | Light impact |
| Grow sprout | 350-450 ms spring | Soft success |
| Bloom flower | 500-600 ms spring with slight rotation | Success |
| Win | Result sheet rises over the completed board | Success sequence |
| Loss | Result sheet rises without screen shake | Warning tap |

Animations must respect Reduce Motion. With it enabled, scale and rotation become short opacity transitions.

## Sound Direction

- Pebble placement: dry, soft ceramic or river-stone tap.
- Group clear: short layered stone clicks, pitched by group size.
- Sprout: quiet leaf flick.
- Bloom: warm two-note chime.
- Failure: low muted tap, never a harsh buzzer.

All sounds must be optional and the setting must persist locally.

## Accessibility

- Minimum interactive target: 44 by 44 points.
- Primary text contrast should meet WCAG AA.
- Pebble colors need a secondary identifier before production, such as a subtle engraved pattern.
- VoiceOver labels must identify pebble color, cell position, flower-bed stage, and predicted outcome.
- Dynamic Type may enlarge interface text without changing the fixed board geometry.
- Important state changes are announced once, not once per cleared cell.

## Native Implementation Notes

- Use SwiftUI for the screen structure, goal panel, tray, result sheet, and settings.
- Use a fixed-aspect SwiftUI grid or Canvas for the board.
- Store personal best and settings in `UserDefaults`.
- Use `sensoryFeedback` where supported, with a UIKit haptic fallback only if needed.
- Keep game rules in a UI-independent model so deterministic tests can replay complete rounds.

## Design Acceptance Criteria

- The board is the largest visual element on every supported iPhone size.
- Goal, moves, selected pebble, and available placements are readable without scrolling.
- The first useful move is understandable without a text tutorial.
- Win and loss states fit on an iPhone SE-sized viewport.
- No text overlaps or truncates at the largest supported Dynamic Type size.
- The app icon is recognizable at 40 pixels.
- The interface remains understandable with sound and haptics disabled.

## Next Design Tasks

1. Add a secondary visual identifier to each pebble color.
2. Prototype the pause and settings sheet.
3. Validate the result sheet at compact iPhone height.
4. Produce final sound and haptic references after the native build exists.
