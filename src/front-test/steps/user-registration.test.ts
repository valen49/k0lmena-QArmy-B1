import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  firstName,
  lastName,
  email,
  telephone,
  password,
  confirmPassword,
  newsletterNo,
  privacyPolicy,
  continueButton,
  successHeading
} from '../locators/userRegistrationLocators';
import { BASEURL } from '../config';

function generateRandomEmail() {
  const timestamp = Date.now();
  return `testuser_${timestamp}@example.com`;
}

Given('the user is on the registration page', async function () {
  for (const page of pages) {
    await page.goto(`${BASEURL}/index.php?route=account/register`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/account\/register/);
    await page.waitForSelector('input[name="firstname"]', { timeout: 10000 });
  }
});

When('the user fills the registration form with:', async function (dataTable) {
  for (const page of pages) {
    const data = dataTable.rowsHash();
    
    const userEmail = data['Email'] === '{{randomEmail}}' ? generateRandomEmail() : data['Email'];

    await page.getByRole('textbox', { name: firstName }).fill(data['First Name']);
    await page.getByRole('textbox', { name: lastName }).fill(data['Last Name']);
    await page.getByRole('textbox', { name: email }).fill(userEmail);
    await page.getByRole('textbox', { name: telephone }).fill(data['Telephone']);
    await page.getByRole('textbox', { name: password }).fill(data['Password']);
    await page.getByRole('textbox', { name: confirmPassword }).fill(data['PasswordConfirm']);
  }
});

When('the user selects Suscription as No', async function () {
  for (const page of pages) {
    await page.getByText(newsletterNo, { exact: true }).click();
  }
});

When('the user clicks on the "Continue" button', async function () {
  for (const page of pages) {
    await page.getByText(privacyPolicy).check();
    await page.waitForTimeout(500); 
    
    const continueBtn = page.getByRole('button', { name: continueButton });
    if (await continueBtn.isEnabled()) {
      await continueBtn.click();
    } else {
      throw new Error('El botón "Continue" no está habilitado para hacer clic.');
    }
  }
});

Then('the user should be redirected to the "success" page', async function () {
  for (const page of pages) {
    await expect(page.getByRole('heading', { name: successHeading })).toBeVisible();
  }
});