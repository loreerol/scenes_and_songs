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

  // Wait for "Create Scenarios" heading to appear
  await modPage.getByText(/Create Scenarios/i).waitFor({ timeout: 10000 });
  await modPage.waitForTimeout(1000);

  // Check how many textareas exist
  let textareaCount = await modPage.locator('textarea').count();
  console.log(`Found ${textareaCount} textareas initially`);

  // If there are no textareas, we need to add scenarios by clicking the + button
  const addButton = modPage.getByRole('button', { name: '+' });

  // Click + button to add scenarios until we have enough
  for (let i = textareaCount; i < scenarios.length; i++) {
    await addButton.click();
    await modPage.waitForTimeout(500);
  }

  // Wait for textareas to be ready
  await modPage.locator('textarea[name="scenario-0"]').waitFor({ state: 'visible', timeout: 5000 });

  // Fill in scenarios using textarea with name attribute
  for (let i = 0; i < scenarios.length; i++) {
    const textarea = modPage.locator(`textarea[name="scenario-${i}"]`);
    await textarea.fill(scenarios[i]);
  }

  // Submit scenarios - button text is just "Submit"
  const submitButton = modPage.getByRole('button', { name: /^Submit$/i });
  await submitButton.click();

  // Wait for scenarios to be saved and game state to update
  await modPage.waitForTimeout(3000);

  // Verify scenarios were submitted by checking for "Scenarios Created" heading
  await modPage.getByRole('heading', { name: /Scenarios Created/i }).waitFor({ timeout: 10000 });
  console.log('Scenarios submitted and confirmed');
}

/**
 * Submits songs for a player
 */
export async function submitSongs(
  playerPage: Page,
  songs: string[]
): Promise<void> {
  // Wait for song selection page to load and check what we see
  await playerPage.waitForTimeout(3000);

  const pageText = await playerPage.textContent('body');
  console.log('Player page text:', pageText?.substring(0, 300));

  const inputCount = await playerPage.locator('input').count();
  const textareaCount = await playerPage.locator('textarea').count();
  console.log(`Found ${inputCount} inputs and ${textareaCount} textareas`);

  // Wait for the song input form to appear
  await playerPage.getByText(/Submit a song for each scenario/i).waitFor({ timeout: 10000 });

  // Find song input fields - they might not have the name attribute
  // Let's try finding all text inputs within the form
  const songInputs = playerPage.locator('input[type="text"], input:not([type])').filter({
    hasNot: playerPage.locator('[name="name"]')
  });

  const songInputCount = await songInputs.count();
  console.log(`Found ${songInputCount} song inputs`);

  // Fill in songs
  for (let i = 0; i < Math.min(songs.length, songInputCount); i++) {
    await songInputs.nth(i).fill(songs[i]);
  }

  // Submit songs
  const submitButton = playerPage.getByRole('button', { name: /Submit Songs/i });
  await submitButton.click();

  // Wait for submission to complete
  await playerPage.waitForTimeout(1000);
}

/**
 * Moderator starts the game (moves to music phase)
 */
export async function startGame(modPage: Page): Promise<void> {
  const startButton = modPage.getByRole('button', { name: /Start Game/i });
  await startButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Moderator advances to voting phase
 */
export async function startVoting(modPage: Page): Promise<void> {
  const voteButton = modPage.getByRole('button', { name: /Go To Voting/i });
  await voteButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Player submits a vote for a song
 */
export async function submitVote(
  playerPage: Page,
  songIndex: number
): Promise<void> {
  // Select the radio button for the song
  const radioButton = playerPage.locator('input[type="radio"]').nth(songIndex);
  await radioButton.click();

  // Submit the vote
  const submitButton = playerPage.getByRole('button', { name: /Submit Vote/i });
  await submitButton.click();
  await playerPage.waitForTimeout(500);
}

/**
 * Moderator closes voting and moves to results or next scenario
 */
export async function closeVoting(modPage: Page): Promise<void> {
  const closeButton = modPage.getByRole('button', { name: /Close Voting/i });
  await closeButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Moderator shows vote winners and moves to guessing phase
 */
export async function showVoteWinners(modPage: Page): Promise<void> {
  const showButton = modPage.getByRole('button', { name: /Show Winners/i });
  await showButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Moderator starts guessing phase
 */
export async function startGuessing(modPage: Page): Promise<void> {
  const guessButton = modPage.getByRole('button', { name: /Start Guessing/i });
  await guessButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Player submits a guess for who submitted a winning song
 */
export async function submitGuess(
  playerPage: Page,
  guessIndex: number
): Promise<void> {
  // Select the radio button for the guess
  const radioButton = playerPage.locator('input[type="radio"]').nth(guessIndex);
  await radioButton.click();

  // Submit the guess
  const submitButton = playerPage.getByRole('button', { name: /Submit Guess/i });
  await submitButton.click();
  await playerPage.waitForTimeout(500);
}

/**
 * Moderator closes guessing and shows results
 */
export async function closeGuessing(modPage: Page): Promise<void> {
  const closeButton = modPage.getByRole('button', { name: /Close Guessing/i });
  await closeButton.click();
  await modPage.waitForTimeout(1000);
}

/**
 * Moderator shows final results
 */
export async function showResults(modPage: Page): Promise<void> {
  const resultsButton = modPage.getByRole('button', { name: /Show Results|View Results/i });
  await resultsButton.click();
  await modPage.waitForTimeout(1000);
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

export const EXAMPLE_SONGS_2 = [
  'https://www.youtube.com/watch?v=9bZkp7q19f0',
  'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
  'https://www.youtube.com/watch?v=60ItHLz5WEA',
];
