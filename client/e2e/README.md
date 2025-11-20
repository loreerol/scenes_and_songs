# E2E Testing with Playwright

This directory contains end-to-end tests for the Scenes and Songs game application.

## Prerequisites

1. Install dependencies:
```bash
yarn install
```

2. Install Playwright browsers:
```bash
yarn playwright install
```

3. Ensure the application is running:
   - Start the server: `cd ../server && yarn start`
   - Start the client: `cd ../client && yarn start`
   - Default URLs: Client on `http://localhost:3000`, Server on `http://localhost:3001`

## Running Tests

### Run all tests (headless)
```bash
yarn test
```

### Run tests with UI mode (interactive)
```bash
yarn test:ui
```

### Run tests in headed mode (see browser)
```bash
yarn test:headed
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

- `game-creation.spec.ts` - Tests for creating new games
- `player-join.spec.ts` - Tests for players joining games
- `song-selection.spec.ts` - Tests for song submission phase
- `game-phases.spec.ts` - Tests for music, voting, guessing, and results phases
- `navigation.spec.ts` - Tests for routing and navigation
- `websocket.spec.ts` - Tests for real-time WebSocket updates
- `full-game-flow.spec.ts` - End-to-end integration test

### Helper Functions

Located in `tests/helpers/game-setup.ts`:
- `createGame()` - Creates a new game and returns moderator page
- `addPlayer()` - Adds a player to an existing game
- `createScenarios()` - Fills and submits scenarios as moderator
- `submitSongs()` - Submits songs for scenarios
- `navigateToPhase()` - Direct navigation to game phases

## Test Configuration

Configuration is in `playwright.config.ts`:
- Tests run on Chromium, Firefox, and WebKit
- 30-second timeout per test
- Traces captured on first retry
- Results in `test-results/` directory
- HTML report in `playwright-report/`

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
