import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { pages } from '../hooks/hook';
import { getElementByRoleAndClickIt } from '../utils/interactions';

import {   
  productInWishlist,
  removeFromWishlistButton
} from '../locators/wishlistLocators';
import { BASEURL } from '../config';


// -------------------- Given --------------------

Given('the user is on the product page', async function () {
  for (const page of pages) {
    await page.goto(BASEURL + '/index.php?route=product/product&product_id=30', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log(`Navegado a la página del producto: ${page.url()}`);
  }
});


// -------------------- When --------------------



When('the user adds the product to the wishlist', async function () {
  for (const page of pages) {
    // Usamos el método `locator` con el XPath directamente para encontrar y hacer clic en el botón.
    await page.locator('//*[@id="image-gallery-216811"]/div[1]/button/i[2]').click();
    console.log('Producto añadido a la lista de deseos.');
  }
});


When('the user goes to the wishlist page', async function () {
  for (const page of pages) {
    // Usamos tu función para hacer clic en el enlace con el rol 'link' y el nombre 'Wish List (1) '
    await getElementByRoleAndClickIt(page, 'link', 'Wish List (1) ');
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
    await expect(page.getByRole('cell', { name: productInWishlist })).toBeVisible();
    console.log('Producto verificado en la lista de deseos.');
  }
});

