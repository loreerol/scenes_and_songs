import { test, expect } from '@playwright/test';
import {
  createGame,
  addPlayer,
  createScenarios,
  submitSongs,
  startGame,
  startVoting,
  submitVote,
  closeVoting,
  showVoteWinners,
  startGuessing,
  submitGuess,
  closeGuessing,
  showResults,
  EXAMPLE_SCENARIOS,
  EXAMPLE_SONGS,
  EXAMPLE_SONGS_2,
} from './helpers/game-setup';

/**
 * Complete happy path test for the Scenes and Songs game
 * Tests the full game flow from creation to final results
 */
test.describe('Happy Path - Complete Game Flow', () => {
  test('full game playthrough with 2 players', async ({ page, context }) => {
    // ========== STEP 1: GAME CREATION ==========
    console.log('Step 1: Moderator creates game');
    const { gameId, modPage } = await createGame(page);
    expect(gameId).toBeTruthy();
    console.log(`Game created with ID: ${gameId}`);

    // ========== STEP 2: PLAYERS JOIN ==========
    console.log('Step 2: Players join the game');
    const player1 = await addPlayer(gameId, 'Alice', context);
    const player2 = await addPlayer(gameId, 'Bob', context);

    // Verify players can see the lobby
    await expect(player1.playerPage.getByText(/wait for the moderator/i)).toBeVisible({ timeout: 5000 });
    await expect(player2.playerPage.getByText(/wait for the moderator/i)).toBeVisible({ timeout: 5000 });
    console.log('Players Alice and Bob joined successfully');

    // ========== STEP 3: MODERATOR CREATES SCENARIOS ==========
    console.log('Step 3: Moderator creates scenarios');
    await createScenarios(modPage, EXAMPLE_SCENARIOS);

    // Wait for game state to update
    await modPage.waitForTimeout(2000);

    // Verify moderator sees "Scenarios Created" heading
    await expect(modPage.getByRole('heading', { name: /Scenarios Created/i })).toBeVisible({ timeout: 5000 });
    console.log('Scenarios created successfully');

    // ========== STEP 4: PLAYERS SUBMIT SONGS ==========
    console.log('Step 4: Players submit songs');

    // Reload player pages to get updated game state with scenarios
    await player1.playerPage.reload();
    await player2.playerPage.reload();
    await player1.playerPage.waitForTimeout(2000);
    await player2.playerPage.waitForTimeout(2000);

    // Player 1 submits songs
    await submitSongs(player1.playerPage, EXAMPLE_SONGS);
    console.log('Alice submitted songs');

    // Player 2 submits different songs (can't duplicate)
    await submitSongs(player2.playerPage, EXAMPLE_SONGS_2);
    console.log('Bob submitted songs');

    // Wait for submissions to be processed
    await modPage.waitForTimeout(2000);

    // Moderator should see all players are ready
    await modPage.waitForTimeout(2000);
    // Check if Start Game button is visible (means players are ready)
    const startGameButton = modPage.getByRole('button', { name: /Start Game/i });
    await expect(startGameButton).toBeVisible({ timeout: 10000 });

    // ========== STEP 5: MODERATOR STARTS GAME (MUSIC PHASE) ==========
    console.log('Step 5: Moderator starts the game (music phase)');
    await startGame(modPage);

    // Verify we're in music phase
    await expect(modPage).toHaveURL(/\/music/, { timeout: 5000 });
    console.log('Music phase started');

    // Moderator needs to view all songs before "Go To Voting" appears
    // With 2 players, we need to click "Next Song" once to reach the last song
    const nextSongButton = modPage.getByRole('button', { name: /Next Song/i });
    const nextSongVisible = await nextSongButton.isVisible().catch(() => false);
    if (nextSongVisible) {
      await nextSongButton.click();
      await modPage.waitForTimeout(1000);
      console.log('Advanced to next song');
    }

    // ========== STEP 6: MODERATOR ADVANCES TO VOTING ==========
    console.log('Step 6: Moderator advances to voting phase');
    await startVoting(modPage);

    // Verify we're in voting phase
    await expect(modPage).toHaveURL(/\/vote/, { timeout: 5000 });
    console.log('Voting phase started');

    // Navigate players to voting page
    await player1.playerPage.goto(`http://localhost:3000/game/${gameId}/vote`);
    await player2.playerPage.goto(`http://localhost:3000/game/${gameId}/vote`);
    await player1.playerPage.waitForTimeout(1000);
    await player2.playerPage.waitForTimeout(1000);

    // ========== STEP 7: PLAYERS VOTE ON SONGS ==========
    console.log('Step 7: Players vote on songs');

    // Each player only sees the OTHER player's song (their own is filtered out)
    // So both vote for index 0 (the only option they see)

    // Player 1 votes
    await submitVote(player1.playerPage, 0);
    await expect(player1.playerPage.getByText(/submitted|waiting/i)).toBeVisible({ timeout: 5000 });
    console.log('Alice voted');

    // Player 2 votes
    await submitVote(player2.playerPage, 0);
    await expect(player2.playerPage.getByText(/submitted|waiting/i)).toBeVisible({ timeout: 5000 });
    console.log('Bob voted');

    // ========== STEP 8: MODERATOR CLOSES VOTING ==========
    console.log('Step 8: Moderator closes voting');
    await modPage.waitForTimeout(1000);
    await closeVoting(modPage);
    console.log('Voting closed');

    // ========== STEP 9: MODERATOR SHOWS VOTE WINNERS ==========
    console.log('Step 9: Moderator shows vote winners');
    await modPage.waitForTimeout(1000);

    // Check if there's a "Show Winners" button or if it auto-advances
    const showWinnersButton = modPage.getByRole('button', { name: /Show Winners/i });
    const isVisible = await showWinnersButton.isVisible().catch(() => false);

    if (isVisible) {
      await showVoteWinners(modPage);
      console.log('Vote winners shown');
    } else {
      console.log('Auto-advanced to next phase');
    }

    // ========== STEP 10: MODERATOR STARTS GUESSING PHASE ==========
    console.log('Step 10: Moderator starts guessing phase');
    await modPage.waitForTimeout(1000);

    // Navigate to guessing if not already there
    const guessingButton = modPage.getByRole('button', { name: /Start Guessing|Guess/i });
    const guessingVisible = await guessingButton.isVisible().catch(() => false);

    if (guessingVisible) {
      await startGuessing(modPage);
    }

    // Verify we're in guessing phase
    await expect(modPage).toHaveURL(/\/guess/, { timeout: 10000 });
    console.log('Guessing phase started');

    // Navigate players to guessing page
    await player1.playerPage.goto(`http://localhost:3000/game/${gameId}/guess`);
    await player2.playerPage.goto(`http://localhost:3000/game/${gameId}/guess`);
    await player1.playerPage.waitForTimeout(1000);
    await player2.playerPage.waitForTimeout(1000);

    // ========== STEP 11: PLAYERS SUBMIT GUESSES ==========
    console.log('Step 11: Players submit guesses');

    // Player 1 guesses (select first option)
    await submitGuess(player1.playerPage, 0);
    await expect(player1.playerPage.getByText(/submitted|waiting/i)).toBeVisible({ timeout: 5000 });
    console.log('Alice guessed');

    // Player 2 guesses (select second option)
    await submitGuess(player2.playerPage, 1);
    await expect(player2.playerPage.getByText(/submitted|waiting/i)).toBeVisible({ timeout: 5000 });
    console.log('Bob guessed');

    // ========== STEP 12: MODERATOR CLOSES GUESSING ==========
    console.log('Step 12: Moderator closes guessing');
    await modPage.waitForTimeout(1000);
    await closeGuessing(modPage);
    console.log('Guessing closed');

    // ========== STEP 13: VIEW RESULTS ==========
    console.log('Step 13: View final results');
    await modPage.waitForTimeout(1000);

    // Check if we need to click "Show Results" or "Show Round Results"
    const resultsButton = modPage.getByRole('button', { name: /Show.*Results/i });
    const resultsVisible = await resultsButton.isVisible().catch(() => false);

    if (resultsVisible) {
      console.log('Clicking results button');
      await resultsButton.click();
      await modPage.waitForTimeout(2000);
    }

    // The game cycles through all scenarios (3 total)
    // For this test, we're verifying the first round completed
    // In a full game, this would repeat for scenarios 2 and 3
    console.log('First round completed successfully');

    // Verify results are displayed
    await expect(modPage.getByRole('heading', { name: /results/i })).toBeVisible({ timeout: 5000 });

    console.log('✅ Happy path test completed successfully!');

    // ========== CLEANUP ==========
    await player1.playerContext.close();
    await player2.playerContext.close();
  });
});
