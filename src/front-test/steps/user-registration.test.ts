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

// Llenar el formulario de registro con email dinámico
When('the user fills the registration form with:', async function (dataTable) {
  const data = dataTable.rowsHash();

  // Generar email dinámico aquí
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

// Seleccionar newsletter como No
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

// Validar que se redirige a la página de éxito
Then('the user should be redirected to the "success" page', async () => {
  const expectedPath = '/index.php?route=account/success';

  for (const page of pages) {
    const currentUrl = page.url();
    console.log(`URL actual después del registro: ${currentUrl}`);
    expect(currentUrl).toContain(expectedPath);
  }
});



let storedEmail = ''; // guardamos aquí el email del registro exitoso

When('the user registers successfully with a unique email', async function () {
  // generamos un email único
  storedEmail = `user${Date.now()}@example.com`;
  console.log(`Registrando primer usuario con email: ${storedEmail}`);

  for (const page of pages) {
    await page.goto(`${BASEURL}/index.php?route=account/register`);
    await getByLocatorAndFillIt(page, firstNameInput(page), 'John');
    await getByLocatorAndFillIt(page, lastNameInput(page), 'Doe');
    await getByLocatorAndFillIt(page, emailInput(page), storedEmail);
    await getByLocatorAndFillIt(page, telephoneInput(page), '1234567890');
    await getByLocatorAndFillIt(page, passwordInput(page), 'Secret123!');
    await getByLocatorAndFillIt(page, confirmPasswordInput(page), 'Secret123!');
    await newsletterNoOption(page).click();
    await privacyPolicyCheckbox(page).click();
    await continueButton(page).click();
  }
});

When('the user tries to register again with the same email', async function () {
  console.log(`Intentando registrar nuevamente con el mismo email: ${storedEmail}`);

  for (const page of pages) {
    await page.goto(`${BASEURL}/index.php?route=account/register`);
    await getByLocatorAndFillIt(page, firstNameInput(page), 'Jane');
    await getByLocatorAndFillIt(page, lastNameInput(page), 'Smith');
    await getByLocatorAndFillIt(page, emailInput(page), storedEmail);
    await getByLocatorAndFillIt(page, telephoneInput(page), '0987654321');
    await getByLocatorAndFillIt(page, passwordInput(page), 'Secret123!');
    await getByLocatorAndFillIt(page, confirmPasswordInput(page), 'Secret123!');
    await newsletterNoOption(page).click();
    await privacyPolicyCheckbox(page).click();
    await continueButton(page).click();
  }
});

Then('the system should display an inline error message about the email', async () => {
  for (const page of pages) {
    const errorMessageLocator = page.locator('.text-danger'); // ajustá al selector real
    await expect(errorMessageLocator).toContainText('E-Mail Address is already registered!');
  }
});
