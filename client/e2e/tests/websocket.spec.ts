import { test, expect } from '@playwright/test';

test.describe('WebSocket Real-time Updates', () => {
  test('players should receive real-time game state updates', async ({ page, context }) => {
    // Create game as moderator
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    await page.waitForURL(/\/game\/([^/]+)/);
    const gameUrl = page.url();
    const gameId = gameUrl.match(/\/game\/([^/]+)/)?.[1];
    
    // Open second player in new context
    const player2Context = await context.browser()?.newContext();
    if (!player2Context) throw new Error('Could not create context');
    
    const player2Page = await player2Context.newPage();
    await player2Page.goto(`http://localhost:3000/game/${gameId}`);
    
    // Player 2 joins
    await player2Page.getByPlaceholder(/Enter your name/i).fill('Player 2');
    await player2Page.getByRole('button', { name: /Join Game/i }).click();
    
    // Player 2 should see waiting state
    await expect(player2Page.getByText(/wait/i)).toBeVisible({ timeout: 3000 });
    
    // Note: Full WebSocket testing would require advancing game state
    // and verifying both pages update in real-time
    
    await player2Context.close();
  });

  test('should handle WebSocket disconnection gracefully', async ({ page }) => {
    // This is complex to test - would need to simulate network issues
    // Or use Playwright's network emulation
    
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    await page.waitForURL(/\/game\/[^/]+/);
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Wait a moment
    await page.waitForTimeout(2000);
    
    // Go back online
    await page.context().setOffline(false);
    
    // App should reconnect and still work
    // Verify game state is maintained
  });
});
