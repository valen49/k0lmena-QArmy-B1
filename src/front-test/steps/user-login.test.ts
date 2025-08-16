import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  emailAddress,  
  password,
  loginButton,  
  warningMessage
} from '../locators/userLoginLocators'; 
import { BASEURL } from '../config';

function generateRandomEmail() {
  const timestamp = Date.now();
  return `testuser_${timestamp}@example.com`;
}

Given('the user is on the "Login" section', async function () {
  for (const page of pages) {
    await page.goto(`${BASEURL}/index.php?route=account/login`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/account\/login/);
  }
});

When('the user leaves the Password field empty', async function () {
  for (const page of pages) {
    const userEmail = generateRandomEmail();
    await page.getByRole('textbox', { name: emailAddress }).fill(userEmail);
    await page.getByRole('textbox', { name: password }).fill('');
  }
});

When('the user clicks the "Login" button', async function () {
  for (const page of pages) {
    await page.getByRole('button', { name: loginButton }).click();
  }
});

Then('the system should display an error message', async function () {
  for (const page of pages) {
    await expect(page.getByText(warningMessage)).toBeVisible();
  }
});