import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  yourNameInput,
  yourReviewInput,
  writeReviewButton,
  warningMessage
} from '../locators/productReviewLocators';
import { getElementByRoleAndClickIt } from '../utils/interactions';
import { BASEURL } from '../config';


Given('the user is on the product page for any product', async function () {
  for (const page of pages) {
    await page.goto(BASEURL + '/index.php?route=product/product&product_id=30', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`Navegado a la página del producto: ${page.url()}`);
  }
});



When('the user leaves the "Your Name" and "Your Review" fields empty', async function () {
  for (const page of pages) {
    await yourNameInput(page).fill('');
    await yourReviewInput(page).fill('');
  }   
});

When('the user clicks the "Write Review" button', async function () {
  for (const page of pages) {
    await writeReviewButton(page).click();
  }
});

Then('the system should display the error message Warning: Please select a review rating', async function () {
  for (const page of pages) {
    await expect(warningMessage(page)).toBeVisible();
    console.log(`Mensaje de error "${await warningMessage(page).innerText()}" verificado.`);
  }
});