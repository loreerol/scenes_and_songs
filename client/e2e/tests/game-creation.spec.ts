import { test, expect } from '@playwright/test';

test.describe('Game Creation Flow', () => {
  test('should display the welcome page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for welcome content
    await expect(page.getByText('Welcome')).toBeVisible();
    await expect(page.getByRole('button', { name: /Start New Game/i })).toBeVisible();
  });

  test('should create a new game and redirect to setup', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click the Start New Game button
    await page.getByRole('button', { name: /Start New Game/i }).click();
    
    // Should redirect to game setup page
    await expect(page).toHaveURL(/\/game\/[^/]+\/set-up/);
    
    // Moderator should see scenario creation interface
    await expect(page.getByText(/scenario/i)).toBeVisible();
  });

  test('should allow moderator to create scenarios', async ({ page }) => {
    // Start a new game
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: /Start New Game/i }).click();
    
    // Wait for setup page
    await page.waitForURL(/\/game\/[^/]+\/set-up/);
    
    // Look for scenario input fields
    const scenarioInputs = page.locator('input[placeholder*="Scenario"], textarea[placeholder*="Scenario"]');
    const count = await scenarioInputs.count();
    
    expect(count).toBeGreaterThan(0);
  });
});
