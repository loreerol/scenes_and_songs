// import { test, expect } from '@playwright/test';

// /**
//  * Edge case tests for player joining
//  * Happy path is covered in happy-path.spec.ts
//  */
// test.describe('Player Join - Edge Cases', () => {
//   test('should prevent joining without a name', async ({ page, context }) => {
//     // Create game
//     await page.goto('http://localhost:3000');
//     await page.getByRole('button', { name: /Start New Game/i }).click();
//     await page.waitForURL(/\/game\/([^/]+)/);
//     const url = page.url();
//     const gameId = url.match(/\/game\/([^/]+)/)?.[1];

//     // New player tries to join without name
//     const newContext = await context.browser()?.newContext();
//     if (!newContext) throw new Error('Could not create new context');

//     const playerPage = await newContext.newPage();
//     await playerPage.goto(`http://localhost:3000/game/${gameId}`);

//     const nameInput = playerPage.getByPlaceholder(/Enter your name/i);
//     await nameInput.fill('');
//     await playerPage.getByRole('button', { name: /Join Game/i }).click();

//     // Should still be on join page or show validation
//     await expect(nameInput).toBeVisible();

//     await newContext.close();
//   });
// });
