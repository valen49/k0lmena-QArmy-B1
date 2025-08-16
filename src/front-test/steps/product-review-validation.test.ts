import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {
  yourName,
  yourReview,
  writeReviewButton,
  warningMessage
} from '../locators/productReviewLocators';
import { BASEURL } from '../config';

Given('the user is on the product page for any product', async function () {
  for (const page of pages) {
    await page.goto(BASEURL + '/index.php?route=product/product&product_id=30', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
});

When('the user leaves the "Your Name" and "Your Review" fields empty', async function () {
  for (const page of pages) {
    await page.getByRole('textbox', { name: yourName }).fill('');
    await page.getByRole('textbox', { name: yourReview }).fill('');
  }   
});

When('the user clicks the "Write Review" button', async function () {
  for (const page of pages) {
    await page.getByRole('button', { name: writeReviewButton }).click();
  }
});

Then('the system should display the error message Warning: Please select a review rating', async function () {
  for (const page of pages) {
    await expect(page.getByText(warningMessage)).toBeVisible();
  }
});