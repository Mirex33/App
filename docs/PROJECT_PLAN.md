# iPhone Puzzle Game Project Plan

## Goal

Build a first simple iPhone app for the App Store: a short offline puzzle game that is easy to play one-handed while commuting. The first release should be small, complete, polished enough to test, and realistic to prepare for App Store submission.

## Product Hypothesis

Game: a calm logic puzzle designed for 30-90 second sessions.

Research direction: the player places, rotates, or connects pieces on a grid to clear space, complete routes, or solve a compact objective. The formula should combine the strongest traits of popular casual puzzle games: instant start, clear rules, short rounds, satisfying feedback, gradual difficulty, and the urge to retry immediately.

## Workstreams

### 1. Concept

Goal: choose a game formula that is simple enough for a first version but does not feel like a direct clone.

Tasks:
- Study top casual puzzle games and identify retention mechanics.
- Propose 3-5 original game concepts.
- Select one concept for the MVP.
- Define rules, win/loss conditions, and the core game loop.
- Decide whether the first version uses levels, endless mode, or a hybrid structure.

Deliverable:
- `Game Concept Brief`: working title, core loop, rules, sample levels, and the reason the game is interesting.

### 2. Design

Goal: choose a visual direction and define enough UI/UX detail for development.

Tasks:
- Explore 3-4 visual directions.
- Choose a style: minimal, cozy/tactile, dark neon, or bright casual.
- Define palette, typography, element shapes, and mood.
- Map the main screens: menu, gameplay, pause, result, and settings.
- Prepare a prototype app icon and basic assets.

Deliverable:
- `Design Direction`: moodboard, palette, UI screens, and asset list.

### 3. Development

Goal: build a native iOS MVP.

Default technology choices:
- SwiftUI for menus, settings, and result screens.
- SpriteKit or SwiftUI Canvas for the gameplay board.
- `UserDefaults` for local high score and settings storage.
- No server, account system, payments, or ads in the first version.

Tasks:
- Create the Xcode iOS project.
- Build screen navigation.
- Implement the MVP game engine.
- Add score, high score, restart, and pause.
- Add sound, haptics, and basic animations.
- Persist sound and haptic settings.
- Prepare app icon and launch screen.

Deliverable:
- A working build on iPhone Simulator and, if available, a real iPhone.

### 4. Testing

Goal: make sure the game is understandable, stable, and not frustrating.

Tasks:
- Verify launch on a current iPhone Simulator.
- Check common iPhone screen sizes.
- Run 10-20 play sessions in a row.
- Identify where players may not understand what to do.
- Verify high score and settings persistence.
- Check for crashes during pause, app backgrounding, and restart.

Deliverable:
- A list of issues found during testing and a corrected MVP build.

### 5. App Store Preparation

Goal: prepare the app for TestFlight and App Store Connect.

Tasks:
- Prepare the Apple Developer Account.
- Configure the bundle identifier.
- Prepare privacy answers.
- Prepare App Store screenshots.
- Write the app name, subtitle, description, and keywords.
- Build an archive in Xcode.
- Upload the build to App Store Connect.
- Run a TestFlight sanity check.

Deliverable:
- A build ready for external testing or App Store review.

## Branch Strategy

The project now starts from a baseline plan on `main`. Feature branches should map to concrete deliverables rather than broad departments.

Recommended branches:

- `main`: stable baseline branch with reviewed work only.
- `codex/concept-research`: market analysis, mechanics research, and final concept.
- `codex/design-direction`: visual directions, UI, assets, and icon exploration.
- `codex/ios-foundation`: Xcode project and base architecture.
- `codex/gameplay-mvp`: first playable mechanic.
- `codex/polish-audio-haptics`: sound, haptics, animation, and feel.
- `codex/testing-fixes`: fixes from manual and simulator testing.
- `codex/app-store-prep`: metadata, screenshots, privacy, and TestFlight readiness.

Rule:
- Each branch should end with something concrete that can be inspected or tested.

## MVP Backlog

### P0 - Before Development

- Install Xcode.
- Verify `xcodebuild`, `simctl`, and iPhone Simulator.
- Choose the game concept.
- Choose the visual direction.
- Create the baseline commit.

### P1 - First Playable Prototype

- Create the iOS app project.
- Build the main screen.
- Build the gameplay board.
- Implement one primary player gesture.
- Implement score or completion logic.
- Build the result screen and restart flow.

### P2 - MVP

- Add difficulty progression.
- Add high score persistence.
- Add sound and haptic settings.
- Add basic successful-move animation.
- Add feedback for mistakes or game over.
- Test on several iPhone sizes.

### P3 - Polish

- Prepare the app icon.
- Prepare the launch screen.
- Add final sounds and haptics.
- Improve round pacing.
- Add onboarding without long text.
- Prepare App Store screenshots.

### Later - Not For Version 1

- Ads.
- In-app purchases.
- Leaderboards.
- iCloud sync.
- Daily challenges.
- A large level system.
- Multiple localizations.

## MVP Acceptance Criteria

- The player can open the app and start a game with one tap.
- Rules are understandable without long tutorial text.
- A session lasts roughly 30-90 seconds.
- The player can restart immediately after losing.
- The high score persists after closing the app.
- The game does not crash on pause, backgrounding, or relaunch.
- The UI works on small and large iPhones.
- The project has no server, login, payments, or unnecessary complexity.

## Setup And Environment

Current state:
- Swift is installed.
- Full Xcode is not active yet.
- iOS Simulator is not available yet.
- Active developer directory: `/Library/Developer/CommandLineTools`.

Required:
- Install Xcode from the App Store or Apple Developer Downloads.
- Open Xcode once and accept the license terms.
- Install the iOS Simulator runtime if Xcode asks.
- Switch the developer directory to Xcode:

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Then verify:

```sh
xcodebuild -version
xcrun simctl list devices available
swift --version
```

## What Codex Can Do With Permission

Can do:
- Check installation and environment state.
- Run Xcode and Swift commands.
- Create project files, branches, and commits.
- Run tests and simulator checks once Xcode is available.
- Prepare App Store materials in the project.

Cannot fully automate without the Mac owner's participation:
- Sign in to Apple ID.
- Confirm Xcode installation if macOS asks for password or Touch ID.
- Accept Apple Developer Program agreements for the account owner.
- Pay for Apple Developer Program.
- Submit legal or privacy forms on behalf of the owner without confirmation.

## Decisions Still Needed

1. Which puzzle type should the MVP use: route connection, block placement, board clearing, pattern finding, or a mixed mechanic?
2. Which visual direction should come first: minimal, cozy, neon, or bright casual?
3. Should version 1 use endless score mode or levels?
4. Is an Apple Developer Account already available?
5. Will the first tests use a real iPhone, Simulator only, or both?

## Next Step

Use the `codex/concept-research` branch to prepare 3-5 game concepts and score them by implementation simplicity, originality, retention potential, and App Store risk.
