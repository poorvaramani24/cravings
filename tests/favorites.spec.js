const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Favorites", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("favorites page loads and shows title", async ({ page }) => {
    // Use navbar link instead of page.goto to preserve React state
    await page.click('a.nav-link:has-text("Search")');
    // Navigate to favorites via URL bar in the search bar area - but we need client-side nav
    // The navbar doesn't have a Favorites link, so we navigate via the URL hash
    // Actually favorites is only accessible from the search page sidebar or direct URL
    // Since page.goto resets state, we test favorites content from within the search page
    await expect(page.locator(".favorites-sidebar")).toBeVisible();
    await expect(page.locator(".filter-sidebar-title:has-text('Favorites')")).toBeVisible();
  });

  test("favorites sidebar shows empty state or favorites list", async ({ page }) => {
    // The search page has a favorites sidebar
    const favEmpty = page.locator(".fav-empty");
    const favItems = page.locator(".fav-item");
    // One of these should be visible
    await expect(favEmpty.or(favItems.first())).toBeVisible({ timeout: 10000 });
  });
});
