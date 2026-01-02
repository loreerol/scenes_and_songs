import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should redirect to correct phase based on game state', async ({ page }) => {
    // Visit /game/:id
    // Should auto-redirect based on current game state
    // e.g., lobby -> /game/:id/set-up
    // music-phase -> /game/:id/music
  });

  test('should handle invalid game ID gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/game/invalid-game-id-12345');
    
    // Should show error or appropriate message
    await expect(page.getByText(/not exist|invalid|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('should maintain state across page refresh', async ({ page }) => {
    // Create game, join as player
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    await page.waitForURL(/\/game\/[^/]+/);
    
    const urlBeforeRefresh = page.url();
    
    // Refresh page
    await page.reload();
    
    // Should stay on same game
    await expect(page).toHaveURL(urlBeforeRefresh);
  });

  test('should show 404 or error for non-existent routes', async ({ page }) => {
    await page.goto('http://localhost:3000/nonexistent-route');
    
    // Depending on your app setup, might show default page or error
    // Adjust assertion based on your app's behavior
  });
});
