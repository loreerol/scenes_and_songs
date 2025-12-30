# E2E Testing with Playwright

This directory contains end-to-end tests for the Scenes and Songs game application.

## Overview

The test suite includes comprehensive coverage of the complete game flow:
1. **Game Creation** - Moderator creates a new game
2. **Player Join** - Players join the game lobby
3. **Scenario Creation** - Moderator creates scenarios
4. **Song Submission** - Players submit songs for each scenario
5. **Music Phase** - Moderator reviews songs
6. **Voting Phase** - Players vote on their favorite songs
7. **Guessing Phase** - Players guess who submitted winning songs
8. **Results** - Final scores are displayed

## Prerequisites

**Redis must be running** before tests can execute.

Install dependencies from the client directory:
```bash
npm install
npm run playwright:install
```

## Running Tests

**From the client directory:**

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Debug tests with Playwright Inspector
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
yarn playwright test tests/game-creation.spec.ts
```

### Run tests matching a pattern
```bash
yarn playwright test --grep "Player Join"
```

### Generate tests with Codegen
```bash
yarn codegen
```

## Test Structure

### Test Files

- **`happy-path.spec.ts`** - ⭐ Complete end-to-end happy path test covering full game flow with 2 players
- `game-creation.spec.ts` - Tests for creating new games
- `player-join.spec.ts` - Tests for players joining games
- `song-selection.spec.ts` - Tests for song submission phase
- `game-phases.spec.ts` - Tests for music, voting, guessing, and results phases
- `navigation.spec.ts` - Tests for routing and navigation
- `websocket.spec.ts` - Tests for real-time WebSocket updates
- `full-game-flow.spec.ts` - Original integration test (being replaced by happy-path)

### Helper Functions

Located in `tests/helpers/game-setup.ts`:
- `createGame()` - Creates a new game and returns moderator page
- `addPlayer()` - Adds a player to an existing game
- `createScenarios()` - Moderator creates scenarios
- `submitSongs()` - Player submits songs for each scenario
- `startGame()` - Moderator starts the game (music phase)
- `startVoting()` - Moderator advances to voting phase
- `submitVote()` - Player votes on a song
- `closeVoting()` - Moderator closes voting
- `showVoteWinners()` - Moderator shows vote results
- `startGuessing()` - Moderator starts guessing phase
- `submitGuess()` - Player submits a guess
- `closeGuessing()` - Moderator closes guessing
- `showResults()` - View final results
- `navigateToPhase()` - Direct navigation to game phases

## Test Configuration

Configuration is in `playwright.config.ts`:
- Tests run on Chromium only (can add Firefox/WebKit later)
- **Automatic server startup**: Backend (3001) and Frontend (3000) start automatically
- 2-minute timeout per test (for complete game flow)
- Tests run serially (workers: 1) to avoid conflicts
- Screenshots/videos captured only on failure
- Traces captured on first retry
- Results in `test-results/` directory
- HTML report in `playwright-report/`
- **Redis must be running manually** before tests start

## Writing New Tests

1. Create a new `.spec.ts` file in `tests/`
2. Import test utilities: `import { test, expect } from '@playwright/test'`
3. Use helper functions from `tests/helpers/game-setup.ts` for common setup
4. Follow the existing test patterns for consistency

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

## Common Issues

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Use explicit waits: `await page.waitForSelector()`

### WebSocket connection issues
- Ensure server is running
- Check WebSocket URL in client code matches server

### Flaky tests
- Add explicit waits instead of `waitForTimeout()`
- Use `toBeVisible({ timeout: 5000 })` for dynamic content
- Check for race conditions in the application

## Debugging

### Debug in VS Code
1. Set breakpoint in test file
2. Run test in debug mode
3. Use Playwright Inspector

### Debug with Playwright Inspector
```bash
PWDEBUG=1 yarn playwright test
```

### View test traces
```bash
yarn playwright show-report
```

## CI/CD Integration

To run tests in CI:
```bash
yarn playwright install --with-deps
yarn test
```

Add to your CI configuration (GitHub Actions, etc.):
```yaml
- name: Install dependencies
  run: cd client/e2e && yarn install --frozen-lockfile
  
- name: Install Playwright
  run: cd client/e2e && yarn playwright install --with-deps
  
- name: Run tests
  run: cd client/e2e && yarn test
```

## Notes

- Some tests require the full game flow to be completed, which may require backend mocking or fixtures
- Tests marked with `.skip` are placeholders for complex scenarios
- WebSocket tests require both client and server to be running
- Update test URLs if your application runs on different ports
