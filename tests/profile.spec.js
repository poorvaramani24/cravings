const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("profile page shows user details", async ({ page }) => {
    // Use navbar link for client-side navigation (preserves React state)
    await page.click('a.nav-link:has-text("Profile")');
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator(".profile-username")).toContainText("@test", { timeout: 10000 });
    await expect(page.locator(".profile-value").first()).not.toBeEmpty();
  });

  test("edit profile link navigates to edit page", async ({ page }) => {
    await page.click('a.nav-link:has-text("Profile")');
    await expect(page).toHaveURL(/\/profile/);
    await page.click(".profile-edit-btn");
    await expect(page).toHaveURL(/\/editprofile/);
  });

  test("edit profile saves changes and redirects to profile", async ({ page }) => {
    await page.click('a.nav-link:has-text("Profile")');
    await expect(page).toHaveURL(/\/profile/);
    // Get original first name
    const originalName = await page.locator(".profile-value").first().textContent();
    // Navigate to edit page
    await page.click(".profile-edit-btn");
    await expect(page).toHaveURL(/\/editprofile/);
    // Wait for form to load with existing values
    await expect(page.locator('[name="first_name"]')).toHaveValue(/.+/, { timeout: 10000 });
    // Update first name
    const newName = originalName === "test" ? "test1" : "test";
    await page.fill('[name="first_name"]', newName);
    await page.click('button:has-text("Save Changes")');
    // Should redirect back to profile
    await expect(page).toHaveURL(/\/profile/, { timeout: 10000 });
    // Verify the updated name is shown
    await expect(page.locator(".profile-value").first()).toContainText(newName);
  });

  test("edit profile with no changes shows toast error", async ({ page }) => {
    await page.click('a.nav-link:has-text("Profile")');
    await expect(page).toHaveURL(/\/profile/);
    await page.click(".profile-edit-btn");
    await expect(page).toHaveURL(/\/editprofile/);
    // Wait for form to load
    await expect(page.locator('[name="first_name"]')).toHaveValue(/.+/, { timeout: 10000 });
    // Submit without making changes
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator(".Toastify")).toContainText(
      "No changes were made to your profile",
      { timeout: 10000 }
    );
  });
});
