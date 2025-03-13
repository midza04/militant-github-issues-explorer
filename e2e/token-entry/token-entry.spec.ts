import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
});

test('has landing page text', async ({ page }) => {
  await expect(page).toHaveTitle('LeanixAssignment');
  // Expects page to have a heading with the name of GitHub Issues Explorer.
  await expect(
    page.getByRole('heading', { name: 'GitHub Issues Explorer' }),
  ).toBeVisible();

  await expect(page.getByText('Enter your API Token to start')).toBeVisible();
});

test('show token form components', async ({ page }) => {
  await expect(page.getByText('Your API Token:')).toBeVisible();
  const tokenInput = page.getByLabel('Enter token');
  await expect(tokenInput).toBeVisible();
});

test('rejects invalid token and shows error', async ({ page }) => {
  const tokenInput = page.getByLabel('Enter token');

  // Type an invalid token (too short)
  await tokenInput.fill('123');

  // Expect an error message for token length validation
  await expect(
    page.getByText('Token must be at least 6 characters long.'),
  ).toBeVisible();
});

test('accepts and submits valid token', async ({ page }) => {
  const tokenInput = page.getByLabel('Enter token');

  const token = process.env['GITHUB_API_TOKEN']
    ? process.env['GITHUB_API_TOKEN']
    : '';

  // Type a mock API token
  await tokenInput.fill(token);

  // Click the submit button to navigate to the repository list
  await page.getByRole('button', { name: 'Submit token' }).click();

  // Verify navigation to the repository list
  await expect(
    page.getByRole('heading', { name: 'Top GitHub Repositories' }),
  ).toBeVisible();
});
