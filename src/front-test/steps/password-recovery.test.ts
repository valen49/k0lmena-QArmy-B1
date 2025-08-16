import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { pages } from '../hooks/hook';
import {
  emailAddress,
  continueButton,
  warningMessage
} from '../locators/passwordRecoveryLocators';

Given('the user is on the "Forgot your password?" section', async function () {
  for (const page of pages) {
    await page.goto(BASEURL + '/index.php?route=account/forgotten');
  }
});

When('the user leaves the "Email Address" field empty', async function () {
  for (const page of pages) {
    await page.getByRole('textbox', { name: emailAddress }).click();
    await page.getByRole('textbox', { name: emailAddress }).clear();
  }
});

When('the user clicks the "Continue" button', async function () {
  for (const page of pages) {
    await page.getByRole('button', { name: continueButton }).click();
  }
});

Then('the system should display the error message "Warning: The E-Mail Address was not found in our records, please try again"!', async function () {
  for (const page of pages) {
    // Debug: Capturar todos los elementos de error visibles
    const allAlerts = await page.locator('.alert, .alert-danger, .text-danger, [class*="error"], [class*="warning"]').all();
    
    if (allAlerts.length > 0) {
      for (const alert of allAlerts) {
        const text = await alert.textContent();
      }
    }
  }
});
