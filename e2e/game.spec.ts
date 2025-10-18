import { test, expect } from '@playwright/test';

test.describe('AI or Not Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game title and description', async ({ page }) => {
    await expect(page.getByText('Is This Photo AI?')).toBeVisible();
    await expect(page.getByText('Can you tell the difference?')).toBeVisible();
  });

  test('should display score display', async ({ page }) => {
    await expect(page.getByText(/Score:/)).toBeVisible();
    await expect(page.getByText(/Streak:/)).toBeVisible();
  });

  test('should load and display an image', async ({ page }) => {
    // Wait for image to load (check for image alt text)
    const imageCard = page.locator('img[alt*="Can you tell"]');
    await expect(imageCard).toBeVisible({ timeout: 10000 });
  });

  test('should display choice buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /YES/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /NO/i })).toBeVisible();
  });

  test('should allow user to make a choice and show results', async ({ page }) => {
    // Wait for image to load
    await page.locator('img[alt*="Can you tell"]').waitFor({ state: 'visible', timeout: 10000 });
    
    // Click YES button
    await page.getByRole('button', { name: /YES/i }).click();
    
    // Results should be shown
    await expect(page.getByText(/Correct!|Wrong!/)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: /Next Image/i })).toBeVisible();
  });

  test('should load next image after clicking Next', async ({ page }) => {
    // Wait for first image
    await page.locator('img[alt*="Can you tell"]').waitFor({ state: 'visible', timeout: 10000 });
    
    // Make a choice
    await page.getByRole('button', { name: /YES/i }).click();
    
    // Wait for results and click Next
    await page.getByRole('button', { name: /Next Image/i }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Next Image/i }).click();
    
    // Should show new image (buttons should be visible again)
    await expect(page.getByRole('button', { name: /YES/i })).toBeVisible({ timeout: 10000 });
  });

  test('should update score when answer is correct', async ({ page }) => {
    // Wait for image to load
    await page.locator('img[alt*="Can you tell"]').waitFor({ state: 'visible', timeout: 10000 });
    
    // Get initial score
    const scoreText = await page.getByText(/Score:/).textContent();
    const initialScore = parseInt(scoreText?.match(/\d+/)?.[0] || '0');
    
    // Make a choice - we don't know if it's correct, so we'll check for score change or same
    await page.getByRole('button', { name: /YES/i }).click();
    await page.waitForTimeout(1000);
    
    // Check if correct was shown
    const isCorrect = await page.getByText('Correct!').isVisible().catch(() => false);
    
    if (isCorrect) {
      // Score should have increased
      const newScoreText = await page.getByText(/Score:/).textContent();
      const newScore = parseInt(newScoreText?.match(/\d+/)?.[0] || '0');
      expect(newScore).toBeGreaterThan(initialScore);
    }
  });

  test('should work with keyboard shortcuts', async ({ page }) => {
    // Wait for image to load
    await page.locator('img[alt*="Can you tell"]').waitFor({ state: 'visible', timeout: 10000 });
    
    // Press 'y' key (should select YES)
    await page.keyboard.press('y');
    
    // Results should be shown
    await expect(page.getByText(/Correct!|Wrong!/)).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to leaderboard', async ({ page }) => {
    // Click leaderboard link
    await page.getByRole('link', { name: /Leaderboard/i }).click();
    
    // Should be on leaderboard page
    await expect(page.getByText('Global Leaderboard')).toBeVisible();
  });
});

test.describe('Leaderboard Page', () => {
  test('should display leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    
    await expect(page.getByText('Global Leaderboard')).toBeVisible();
    await expect(page.getByRole('button', { name: /Back to Game/i })).toBeVisible();
  });

  test('should navigate back to game from leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    
    await page.getByRole('button', { name: /Back to Game/i }).click();
    
    // Should be back on game page
    await expect(page.getByText('Is This Photo AI?')).toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should display correctly on mobile', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Is This Photo AI?')).toBeVisible();
    await expect(page.getByRole('button', { name: /YES/i })).toBeVisible();
  });

  test('should show swipe instructions on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Mobile-specific instruction should be visible
    await expect(page.getByText(/Swipe right for AI, left for Real/i)).toBeVisible();
  });
});

