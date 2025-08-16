import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import { getByLocatorAndFillIt } from '../utils/interactions';

import {
  emailAddress,
  password as loginPassword, // Renombrar para evitar conflictos
  loginButton
} from '../locators/loginLocators';
import {
  //topProductsSection,
  productAddToWishlistButton,
  wishlistButtonLabel,
  wishlistLink,
  productInWishlist,
  removeFromWishlistButton
} from '../locators/wishlistLocators';
import { BASEURL } from '../config';


// -------------------- Given --------------------



Given('the user is on the home page', async function () {
  for (const page of pages) {
    await page.goto(BASEURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`Navegado a la página de inicio: ${page.url()}`);
  }
});

// -------------------- When --------------------
/*
When('the user scrolls to the "Top Products" section', async function () {
  for (const page of pages) {
    await page.locator(topProductsSection).scrollIntoViewIfNeeded();
    console.log('Desplazado a la sección de "Top Products".');
  }
});
*/
When('the user adds a product to the wishlist', async function () {
  for (const page of pages) {
    await page.locator(productAddToWishlistButton).getByLabel(wishlistButtonLabel).click();
    console.log('Producto añadido a la lista de deseos.');
    // Wait a moment for visual update
    await page.waitForTimeout(2000);
  }
});

When('the user navigates to the wishlist page', async function () {
  for (const page of pages) {
    await page.getByRole('link', { name: wishlistLink }).click();
    await page.waitForURL('**/account/wishlist', { timeout: 10000 });
    console.log('Navegado a la página de lista de deseos.');
  }
});

When('the user removes the product from the wishlist', async function () {
  for (const page of pages) {
    await page.getByRole('link', { name: removeFromWishlistButton }).click();
    await page.waitForTimeout(2000);
    console.log('Producto eliminado de la lista de deseos.');
  }
});

// -------------------- Then --------------------

Then('the wishlist should contain the added product', async function () {
  for (const page of pages) {
    await expect(page.getByRole('link', { name: productInWishlist })).toBeVisible();
    console.log('Producto verificado en la lista de deseos.');
  }
});

Then('the system should not display that product in the wishlist', async function () {
  for (const page of pages) {
    await expect(page.getByRole('link', { name: productInWishlist })).toBeHidden();
    console.log('Verificado que el producto ya no está en la lista de deseos.');
  }
});
