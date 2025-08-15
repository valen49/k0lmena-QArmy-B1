import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { pages } from '../hooks/hook';
import { validateFirstLocator } from '../utils/validations';
import {
  emailAddress,
  continueButton,
  warningMessage
} from '../locators/passwordRecoveryLocators'; // o el nombre de tu archivo de locators
import {
  getElementByRoleAndClickIt,
  getTextboxAndClear,
  getElementByRole
} from '../utils/interactions';

// Steps for Password Recovery feature
Given('the user is on the "Forgot your password?" section', async function () {
  for (const page of pages) {
    console.log(`Ejecutando prueba en navegador: ${page.context().browser()?.browserType().name()}`);
    await page.goto(BASEURL + '/index.php?route=account/forgotten');
  }
});

When('the user leaves the "Email Address" field empty', async function () {
  for (const page of pages) {
    await getElementByRoleAndClickIt(page, 'textbox', emailAddress);
    // En lugar de getTextboxAndClear genérico, usa:
    await page.getByRole('textbox', { name: emailAddress }).clear();
  }
});
When('the user clicks the "Continue" button', async function () {
  for (const page of pages) {
    await getElementByRole(page, 'button', continueButton);
  }
});
Then('the system should display the error message "Warning: The E-Mail Address does not appear to be valid!"', async function () {
  for (const page of pages) {
    expect(validateFirstLocator(page, "div", warningMessage)).toBeTruthy();
  }
});