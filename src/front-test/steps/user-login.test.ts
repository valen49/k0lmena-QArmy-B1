import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  emailInput,  
  passwordInput,
  loginButton,  
  warningMessage
} from '../locators/userLoginLocators'; 
import { BASEURL } from '../config';

// Helper function to generate a unique email
function generateRandomEmail() {
  const timestamp = Date.now();
  return `testuser_${timestamp}@example.com`;
}

Given('the user is on the "Login" section', async function () {
  for (const page of pages) {
    console.log(`Ejecutando prueba en navegador: ${page.context().browser()?.browserType().name()}`);
    console.log('Navegando a la página de inicio de sesión: ' + BASEURL + '/index.php?route=account/login');
    // Navigate directly to the login page.
    await page.goto(`${BASEURL}/index.php?route=account/login`, { waitUntil: 'domcontentloaded' });
    console.log('URL final: ' + page.url());
    
    // Check that we are on the login page
    await expect(page).toHaveURL(/account\/login/);

    // Wait for the form to be ready before proceeding
      }
});


When('the user leaves the Password field empty', async function () {
  for (const page of pages) {
    // Generar un correo electrónico aleatorio y llenar el campo de email
    const userEmail = generateRandomEmail();
    await emailInput(page).fill(userEmail);

    // Dejar el campo de contraseña vacío
    await passwordInput(page).fill('');
  }
});
When('the user clicks the "Login" button', async function () {
  for (const page of pages) {
    await loginButton(page).click();
  }
});

Then('the system should display an error message', async function () {
  for (const page of pages) {
    await expect(warningMessage(page)).toBeVisible();
    console.log(`Mensaje de error "${await warningMessage(page).innerText()}" verificado.`);
  }
});







