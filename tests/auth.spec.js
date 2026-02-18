const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("Authentication", () => {
  test("login with valid credentials redirects to /search", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator(".header")).toContainText("Welcome");
  });

  test("login with empty fields shows toast error", async ({ page }) => {
    await page.goto("/login");
    await page.click(".auth-btn");
    await expect(page.locator(".Toastify")).toContainText(
      "Please enter your username and password"
    );
  });

  test("login with wrong credentials shows toast error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[name="username"]', "test");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click(".auth-btn");
    await expect(page.locator(".Toastify")).toContainText(
      "Incorrect credential",
      { timeout: 10000 }
    );
  });

  test("successful signup redirects to /login", async ({ page }) => {
    const unique = Date.now();
    await page.goto("/signup");
    await page.fill('[name="inputFirstName"]', "Playwright");
    await page.fill('[name="inputLastName"]', "Tester");
    await page.fill('[name="inputUsername"]', `pw_test_${unique}`);
    await page.fill('[name="inputEmail"]', `pw_${unique}@test.com`);
    await page.fill('[name="inputZipCode"]', "60601");
    await page.fill('[name="inputPassword"]', "testpass123");
    await page.fill('[name="inputConfirmPassword"]', "testpass123");
    await page.click(".auth-btn");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("signup with empty fields shows toast error", async ({ page }) => {
    await page.goto("/signup");
    await page.click(".auth-btn");
    await expect(page.locator(".Toastify")).toContainText(
      "Please fill out all fields to signup"
    );
  });

  test("signup with duplicate username shows toast error", async ({ page }) => {
    await page.goto("/signup");
    await page.fill('[name="inputFirstName"]', "Duplicate");
    await page.fill('[name="inputLastName"]', "User");
    await page.fill('[name="inputUsername"]', "test");
    await page.fill('[name="inputEmail"]', "duplicate@test.com");
    await page.fill('[name="inputZipCode"]', "60601");
    await page.fill('[name="inputPassword"]', "testpass123");
    await page.fill('[name="inputConfirmPassword"]', "testpass123");
    await page.click(".auth-btn");
    await expect(page.locator(".Toastify")).toContainText(
      /validation error|error during signup/i,
      { timeout: 10000 }
    );
  });

  test("auth guard redirects /favorites to /login when not logged in", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page).toHaveURL(/\/login/);
  });

  test("auth guard redirects /newsfeed to /login when not logged in", async ({ page }) => {
    await page.goto("/newsfeed");
    await expect(page).toHaveURL(/\/login/);
  });

  test("auth guard redirects /profile to /login when not logged in", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });

  test("auth guard redirects /team to /login when not logged in", async ({ page }) => {
    await page.goto("/team");
    await expect(page).toHaveURL(/\/login/);
  });

  test("auth guard redirects /search to /login when not logged in", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/\/login/);
  });
});
