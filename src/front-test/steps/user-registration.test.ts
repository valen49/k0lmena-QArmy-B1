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
  successPage
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
    // Navigate directly to the registration page.
    await page.goto(`${BASEURL}/index.php?route=account/register`, { waitUntil: 'domcontentloaded' });
    
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
  }
});

When('the user selects Suscription as No', async function () {
  for (const page of pages) {
    await newsletterNoOption(page).click();
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
      throw new Error('El botón "Continue" no está habilitado para hacer clic.');
    }
  }
});

// -------------------- Then --------------------

Then('the user should be redirected to the "success" page', async function () {
  for (const page of pages) {
    // La prueba esperará automáticamente hasta que el elemento sea visible,
    // lo que confirma que la página se cargó correctamente después de la redirección.
    await expect(successPage(page)).toBeVisible();
  }
});