const { expect } = require("@playwright/test");

async function login(page, username = "test", password = "test") {
  await page.goto("/login");
  await page.fill('[name="username"]', username);
  await page.fill('[name="password"]', password);
  await page.click(".auth-btn");
  await expect(page).toHaveURL(/\/search/, { timeout: 10000 });
}

module.exports = { login };
