import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import {   
  productInWishlist,
  wishlistButtonOnProductPage,
  wishlistPopupLink
} from '../locators/wishlistLocators';
import { BASEURL } from '../config';

Given('the user is on the product page', async function () {
  for (const page of pages) {
    await page.goto(BASEURL + '/index.php?route=product/product&product_id=30', { waitUntil: 'domcontentloaded', timeout: 15000 });
  }
});

When('the user adds the product to the wishlist', async function () {
  for (const page of pages) {
    await page.locator(wishlistButtonOnProductPage).click();
  }
});

When('the user goes to the wishlist page', async function () {
  for (const page of pages) {
    await page.getByRole('link', { name: wishlistPopupLink }).click();
  }
});

Then('the wishlist should contain the added product', async function () {
  for (const page of pages) {
    await expect(page.getByRole('cell', { name: productInWishlist })).toBeVisible();
  }
});