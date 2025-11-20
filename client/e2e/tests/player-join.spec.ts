import { test, expect } from '@playwright/test';

test.describe('Player Join Flow', () => {
  test('should show player join form when visiting game URL without cookie', async ({ page }) => {
    // Visit a game URL directly (you'll need to replace with actual gameId or mock)
    // For now, testing the join form elements
    await page.goto('http://localhost:3000');
    
    // Create game as mod first
    await page.getByRole('button', { name: /Start New Game/i }).click();
    
    // Get game URL
    await page.waitForURL(/\/game\/([^/]+)/);
    const url = page.url();
    const gameId = url.match(/\/game\/([^/]+)/)?.[1];
    
    // Open game in new context (simulating another player)
    const newContext = await page.context().browser()?.newContext();
    if (!newContext) throw new Error('Could not create new context');
    
    const playerPage = await newContext.newPage();
    await playerPage.goto(`http://localhost:3000/game/${gameId}`);
    
    // Should show join form
    await expect(playerPage.getByText(/Welcome/i)).toBeVisible();
    await expect(playerPage.getByPlaceholder(/Enter your name/i)).toBeVisible();
    await expect(playerPage.getByRole('button', { name: /Join Game/i })).toBeVisible();
    
    await newContext.close();
  });

  test('should allow player to join game with name', async ({ page, context }) => {
    // Create game as mod
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    await page.waitForURL(/\/game\/([^/]+)/);
    const url = page.url();
    const gameId = url.match(/\/game\/([^/]+)/)?.[1];
    
    // New player joins
    const newContext = await context.browser()?.newContext();
    if (!newContext) throw new Error('Could not create new context');
    
    const playerPage = await newContext.newPage();
    await playerPage.goto(`http://localhost:3000/game/${gameId}`);
    
    // Fill in name and join
    await playerPage.getByPlaceholder(/Enter your name/i).fill('Test Player');
    await playerPage.getByRole('button', { name: /Join Game/i }).click();
    
    // Should show waiting message or scenarios based on game state
    await expect(playerPage.getByText(/wait|scenario/i)).toBeVisible({ timeout: 5000 });
    
    await newContext.close();
  });

  test('should prevent joining without a name', async ({ page, context }) => {
    // Create game
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    await page.waitForURL(/\/game\/([^/]+)/);
    const url = page.url();
    const gameId = url.match(/\/game\/([^/]+)/)?.[1];
    
    // New player tries to join without name
    const newContext = await context.browser()?.newContext();
    if (!newContext) throw new Error('Could not create new context');
    
    const playerPage = await newContext.newPage();
    await playerPage.goto(`http://localhost:3000/game/${gameId}`);
    
    const nameInput = playerPage.getByPlaceholder(/Enter your name/i);
    await nameInput.fill('');
    await playerPage.getByRole('button', { name: /Join Game/i }).click();
    
    // Should still be on join page or show validation
    await expect(nameInput).toBeVisible();
    
    await newContext.close();
  });
});
