import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import { getByLocatorAndFillIt } from '../utils/interactions';
import {
  firstNameInput,
  lastNameInput,
  emailInput,
  telephoneInput,
  passwordInput,
  confirmPasswordInput,
  newsletterNoOption,
  privacyPolicyCheckbox,
  continueButton
} from '../locators/userRegistrationLocators';
import { BASEURL } from '../config';

// -------------------- Given --------------------

// Navegar a la página de registro
Given('the user is on the registration page', async () => {
  for (const page of pages) {
    console.log(`Ejecutando prueba en navegador: ${page.context().browser()?.browserType().name()}`);
    await page.goto(`${BASEURL}/index.php?route=account/register`);
  }
});

// -------------------- When --------------------


When('the user fills the registration form with:', async function (dataTable) {
  const data = dataTable.rowsHash();

  
  const emailValue = data['Email'] === '{{randomEmail}}' ? `user${Date.now()}@example.com` : data['Email'];
  console.log(`Llenando el campo Email con: ${emailValue}`);

  for (const page of pages) {
    await getByLocatorAndFillIt(page, firstNameInput(page), data['First Name']);
    await getByLocatorAndFillIt(page, lastNameInput(page), data['Last Name']);
    await getByLocatorAndFillIt(page, emailInput(page), emailValue);
    await getByLocatorAndFillIt(page, telephoneInput(page), data['Telephone']);
    await getByLocatorAndFillIt(page, passwordInput(page), data['Password']);
    await getByLocatorAndFillIt(page, confirmPasswordInput(page), data['PasswordConfirm']);
  }
});


When('the user selects Suscription as No', async () => {
  for (const page of pages) {
    await newsletterNoOption(page).click();
  }
});

// Aceptar la política de privacidad y continuar
When('the user clicks on the "Continue" button', async () => {
  for (const page of pages) {
    await privacyPolicyCheckbox(page).click();
    await continueButton(page).click();
  }
});

// -------------------- Then --------------------


Then('the user should be redirected to the "success" page', async () => {
  const expectedPath = '/index.php?route=account/success';

  for (const page of pages) {
    const currentUrl = page.url();
    console.log(`URL actual después del registro: ${currentUrl}`);
    expect(currentUrl).toContain(expectedPath);
  }
});



