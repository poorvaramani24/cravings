const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Logout", () => {
  test("logout shows logged out message", async ({ page }) => {
    await login(page);
    await page.click('a:has-text("Logout"), button:has-text("Logout")');
    await expect(page.locator("text=You have been logged out")).toBeVisible({
      timeout: 10000,
    });
  });

  test("after logout, visiting /search redirects to /login", async ({ page }) => {
    await login(page);
    await page.click('a:has-text("Logout"), button:has-text("Logout")');
    await expect(page.locator("text=You have been logged out")).toBeVisible({
      timeout: 10000,
    });
    await page.goto("/search");
    await expect(page).toHaveURL(/\/login/);
  });
});
