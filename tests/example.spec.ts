import { expect, test } from "@playwright/test";

test("redirects guests to the sign-in page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("renders the sign-up form fields", async ({ page }) => {
  await page.goto("/sign-up");

  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Role")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
});

test("signs in with mocked api responses", async ({ page }) => {
  await page.route("**/login", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      }),
    });
  });

  await page.route("**/profile", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        data: {
          id: "user-1",
          full_name: "Jane Doe",
          email: "jane@example.com",
          role: "Member",
        },
      }),
    });
  });

  await page.goto("/sign-in");

  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("Jane Doe")).toBeVisible();
});
