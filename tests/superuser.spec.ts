import { test, expect } from '@playwright/test';

test.describe('SuperUser Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login as SuperUser
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Platform Overview')).toBeVisible();
  });

  test('should navigate to Library Management', async ({ page }) => {
    await page.click('button:has-text("Libraries")');
    await expect(page.locator('text=Library Management')).toBeVisible();
    await expect(page.locator('text=Sunshine Community Toy Library')).toBeVisible();
  });

  test('should navigate to User Management', async ({ page }) => {
    await page.click('button:has-text("Users")');
    await expect(page.locator('text=User Management')).toBeVisible();
    await expect(page.locator('text=Library Host')).toBeVisible();
    await expect(page.locator('text=John Borrower')).toBeVisible();
  });

  test('should navigate to Analytics', async ({ page }) => {
    await page.click('button:has-text("Analytics")');
    await expect(page.locator('text=Platform Analytics')).toBeVisible();
    await expect(page.locator('text=Total Platform Revenue')).toBeVisible();
  });

  test('should navigate to Security', async ({ page }) => {
    await page.click('button:has-text("Security")');
    await expect(page.locator('text=Security & Privacy')).toBeVisible();
    await expect(page.locator('text=Failed Login Attempt')).toBeVisible();
  });

  test('should navigate to Support', async ({ page }) => {
    await page.click('button:has-text("Support")');
    await expect(page.locator('text=Support Tickets')).toBeVisible();
    await expect(page.locator('text=TKT-1024')).toBeVisible();
  });
});
