import { Page, BrowserContext } from '@playwright/test';

/**
 * Helper functions for setting up game states in tests
 */

export interface GameSetup {
  gameId: string;
  modPage: Page;
  modContext: BrowserContext;
}

export interface PlayerSetup {
  playerPage: Page;
  playerContext: BrowserContext;
  playerId?: string;
}

/**
 * Creates a new game and returns the moderator page and game ID
 */
export async function createGame(page: Page): Promise<GameSetup> {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: /Start New Game/i }).click();
  await page.waitForURL(/\/game\/([^/]+)/);
  
  const url = page.url();
  const gameId = url.match(/\/game\/([^/]+)/)?.[1];
  
  if (!gameId) {
    throw new Error('Failed to extract game ID from URL');
  }
  
  return {
    gameId,
    modPage: page,
    modContext: page.context(),
  };
}

/**
 * Adds a player to an existing game
 */
export async function addPlayer(
  gameId: string,
  playerName: string,
  context: BrowserContext
): Promise<PlayerSetup> {
  const browser = context.browser();
  if (!browser) throw new Error('No browser available');
  
  const playerContext = await browser.newContext();
  const playerPage = await playerContext.newPage();
  
  await playerPage.goto(`http://localhost:3000/game/${gameId}`);
  await playerPage.getByPlaceholder(/Enter your name/i).fill(playerName);
  await playerPage.getByRole('button', { name: /Join Game/i }).click();
  
  // Wait for join to complete
  await playerPage.waitForTimeout(1000);
  
  return {
    playerPage,
    playerContext,
  };
}

/**
 * Creates scenarios as moderator
 */
export async function createScenarios(
  modPage: Page,
  scenarios: string[]
): Promise<void> {
  // Navigate to setup if not already there
  const url = modPage.url();
  if (!url.includes('/set-up')) {
    const gameId = url.match(/\/game\/([^/]+)/)?.[1];
    await modPage.goto(`http://localhost:3000/game/${gameId}/set-up`);
  }
  
  // Fill in scenarios
  const scenarioInputs = modPage.locator('input[placeholder*="Scenario"], textarea[placeholder*="Scenario"]');
  
  for (let i = 0; i < scenarios.length; i++) {
    const input = scenarioInputs.nth(i);
    await input.fill(scenarios[i]);
  }
  
  // Submit scenarios
  const submitButton = modPage.getByRole('button', { name: /Start|Submit|Continue/i });
  await submitButton.click();
}

/**
 * Submits songs for a player
 */
export async function submitSongs(
  playerPage: Page,
  songs: string[]
): Promise<void> {
  // Find song input fields
  const songInputs = playerPage.locator('input[placeholder*="song" i], input[type="text"]').filter({
    hasNot: playerPage.locator('[placeholder*="name" i]')
  });
  
  for (let i = 0; i < songs.length; i++) {
    await songInputs.nth(i).fill(songs[i]);
  }
  
  // Submit songs
  const submitButton = playerPage.getByRole('button', { name: /Submit Songs/i });
  await submitButton.click();
}

/**
 * Navigates to a specific phase of the game
 */
export async function navigateToPhase(
  page: Page,
  gameId: string,
  phase: 'set-up' | 'music' | 'vote' | 'guess' | 'results'
): Promise<void> {
  await page.goto(`http://localhost:3000/game/${gameId}/${phase}`);
}

export const BASE_URL = 'http://localhost:3000';

export const EXAMPLE_SCENARIOS = [
  'A song that makes you want to dance',
  'A song that reminds you of summer',
  'Your favorite road trip song',
];

export const EXAMPLE_SONGS = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
  'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
];
