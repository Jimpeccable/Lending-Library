import { test, expect } from '@playwright/test';

test.describe('Borrower Flow', () => {
  test('should login and browse items', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'borrower@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await expect(page.getByRole('heading', { name: 'My Dashboard' })).toBeVisible();
    await expect(page.getByText('John Borrower').first()).toBeVisible();

    await page.click('button:has-text("Browse Items")');
    await expect(page.locator('text=LEGO Creator 3-in-1 Deep Sea Creatures')).toBeVisible();
  });
});

test.describe('Host Flow', () => {
  test('should login and view dashboard', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'host@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Welcome back! Here\'s what\'s happening with your library.')).toBeVisible();

    await page.click('button:has-text("Inventory")');
    await expect(page.locator('text=Inventory Management')).toBeVisible();
  });
});
