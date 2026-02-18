const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Newsfeed", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("newsfeed page loads with title", async ({ page }) => {
    // Use navbar link for client-side navigation (preserves React state)
    await page.click('a.nav-link:has-text("Newsfeed")');
    await expect(page).toHaveURL(/\/newsfeed/);
    await expect(page.getByText("Swipes near you!")).toBeVisible({ timeout: 10000 });
  });

  test("newsfeed shows feed list after loading", async ({ page }) => {
    await page.click('a.nav-link:has-text("Newsfeed")');
    await expect(page.locator(".feed-list")).toBeVisible({ timeout: 10000 });
  });
});
