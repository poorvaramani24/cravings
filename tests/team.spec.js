const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Team", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("team page shows title and user cards", async ({ page }) => {
    // Use navbar link for client-side navigation (preserves React state)
    await page.click('a.nav-link:has-text("Team")');
    await expect(page).toHaveURL(/\/team/);
    await expect(page.getByText("Team")).toBeVisible({ timeout: 10000 });
    await page.waitForSelector(".team-grid", { timeout: 10000 });
    const userCards = page.locator(".team-grid > *");
    await expect(userCards.first()).toBeVisible();
  });
});
