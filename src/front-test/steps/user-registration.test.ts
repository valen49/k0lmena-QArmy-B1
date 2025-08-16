import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  firstNameInput,
  lastNameInput,
  emailInput,
  telephoneInput,
  passwordInput,
  confirmPasswordInput,
  newsletterNoOption,
  privacyPolicyCheckbox,
  continueButton,
  errorEmailExistsMessage
} from '../locators/userRegistrationLocators';
import { BASEURL } from '../config';

// Helper function to generate a unique email
function generateRandomEmail() {
  const timestamp = Date.now();
  return `testuser_${timestamp}@example.com`;
}

// -------------------- Given --------------------

Given('the user is on the registration page', async function () {
  for (const page of pages) {
    console.log(`Ejecutando prueba en navegador: ${page.context().browser()?.browserType().name()}`);
    console.log('Navegando a la página de registro: ' + BASEURL + '/index.php?route=account/register');
    // Navigate directly to the registration page.
    await page.goto(`${BASEURL}/index.php?route=account/register`, { waitUntil: 'domcontentloaded' });
    console.log('URL final: ' + page.url());
    
    // Check that we are on the registration page
    await expect(page).toHaveURL(/account\/register/);

    // Wait for the form to be ready before proceeding
    await page.waitForSelector('input[name="firstname"]', { timeout: 10000 });
  }
});

// -------------------- When --------------------

When('the user fills the registration form with:', async function (dataTable) {
  for (const page of pages) {
    const data = dataTable.rowsHash();
    
    const userEmail = data['Email'] === '{{randomEmail}}' ? generateRandomEmail() : data['Email'];

    await firstNameInput(page).fill(data['First Name']);
    await lastNameInput(page).fill(data['Last Name']);
    await emailInput(page).fill(userEmail);
    await telephoneInput(page).fill(data['Telephone']);
    await passwordInput(page).fill(data['Password']);
    await confirmPasswordInput(page).fill(data['PasswordConfirm']);

    console.log('Registration form filled successfully');
  }
});

When('the user selects Suscription as No', async function () {
  for (const page of pages) {
    await newsletterNoOption(page).click();
    console.log('Newsletter option set to No');
  }
});

When('the user clicks on the "Continue" button', async function () {
  for (const page of pages) {
    // Check the privacy policy checkbox
    await privacyPolicyCheckbox(page).check();

    // Add a short delay and check if the button is enabled before clicking to ensure stability
    await page.waitForTimeout(500); 
    const continueBtn = continueButton(page);
    if (await continueBtn.isEnabled()) {
      await continueBtn.click();
    } else {
      console.log('El botón "Continue" no está habilitado.');
      throw new Error('El botón "Continue" no está habilitado para hacer clic.');
    }
  }
});

// -------------------- Then --------------------

Then('the user should be redirected to the "success" page', async function () {
  for (const page of pages) {
    await page.waitForURL('**/account/success', { timeout: 15000 });
    await expect(page).toHaveURL(/account\/success/);
    console.log('Registration completed successfully');
  }
});

