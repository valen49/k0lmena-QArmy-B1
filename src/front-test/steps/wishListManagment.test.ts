import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { pages } from '../hooks/hook';
import { validateFirstLocator } from '../utils/validations';
import {
 emailAddress,
 password,
 loginButton
} from '../locators/loginLocators';
import {
 topProductsSection,
 wishlistLink,
 productAddToWishlistButton,
 wishlistButtonLabel,
 productInWishlist,
 removeFromWishlistButton
} from '../locators/wishlistLocators';
import {
 getElementByRoleAndClickIt,
 getElementByRole
} from '../utils/interactions';

// Variable global para compartir datos de usuario entre escenarios
let globalUserData: any = null;

// -------------------- Background --------------------

Given('a user is registered in the system', async function () {
  // Verificar si ya hay un usuario registrado globalmente
  if (globalUserData) {
    console.log(`User already registered globally: ${globalUserData.email}`);
    this.userData = globalUserData;
    return;
  }
  
  // Generar datos para el registro
  const userData = {
    email: `user${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    telephone: '1234567890'
  };
  
  // Guardar en contexto local y global
  this.userData = userData;
  globalUserData = userData;
  
  for (const page of pages) {
    console.log(`Registering user for wishlist test: ${userData.email}`);
    await page.goto(`${BASEURL}/index.php?route=account/register`);
    
    // Esperar a que el formulario esté disponible
    await page.waitForSelector('input[name="firstname"]', { timeout: 10000 });
    
    // Llenar formulario básico (sin usar dataTable como en el otro step)
    await page.getByRole('textbox', { name: 'First Name' }).fill(userData.firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(userData.lastName);
    await page.getByRole('textbox', { name: 'E-Mail' }).fill(userData.email);
    await page.getByRole('textbox', { name: 'Telephone' }).fill(userData.telephone);
    await page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
    await page.getByRole('textbox', { name: 'Password Confirm' }).fill(userData.password);
    
    // Selecciones básicas
    await page.getByRole('radio', { name: 'No' }).click(); // Newsletter
    await page.getByRole('checkbox').click(); // Privacy policy
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Verificar registro exitoso
    await page.waitForURL('**/account/success');
    console.log(`User registered successfully: ${userData.email}`);
  }
});

// -------------------- Given --------------------

Given('the user is logged into the system', async function () {
  // Asegurar que tenemos los datos del usuario (del contexto o global)
  const userData = this.userData || globalUserData;
  
  if (!userData) {
    throw new Error('No user data available for login');
  }
  
  const { email, password: userPassword } = userData;
  
  for (const page of pages) {
    console.log(`Logging in user: ${email}`);
    await page.goto(`${BASEURL}/index.php?route=account/login`);
    
    // Llenar formulario de login
    await page.getByRole('textbox', { name: emailAddress }).fill(email);
    await page.getByRole('textbox', { name: password }).fill(userPassword);
    await page.getByRole('button', { name: loginButton }).click();
    
    // Esperar a que se complete el login (opcional: verificar redirección)
    await page.waitForURL('**/account/account');
  }
});

Given('the user is on the home page', async function () {
  for (const page of pages) {
    await page.goto(BASEURL);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  }
});

Given('the user is on the wishlist page', async function () {
  for (const page of pages) {
    await page.goto(`${BASEURL}/index.php?route=account/wishlist`);
  }
});

// -------------------- When --------------------

When('the user scrolls to the "Top Products" section', async function () {
  for (const page of pages) {
    await page.locator(topProductsSection).scrollIntoViewIfNeeded();
  }
});

When('the user adds a product to the wishlist', async function () {
  for (const page of pages) {
    await page.locator(productAddToWishlistButton).getByLabel(wishlistButtonLabel).getByRole('button', { name: '' }).click();
  }
});

When('the user navigates to the wishlist page', async function () {
  for (const page of pages) {
    await page.getByRole('link', { name: wishlistLink, exact: true }).scrollIntoViewIfNeeded();
    await page.getByRole('link', { name: wishlistLink, exact: true }).click();
  }
});

When('the user removes the product from the wishlist', async function () {
  for (const page of pages) {
    await page.getByRole('link', { name: removeFromWishlistButton }).click();
  }
});

// -------------------- Then --------------------

Then('the wishlist should contain the added product', async function () {
  for (const page of pages) {
    await expect(page.getByRole('cell', { name: productInWishlist })).toBeVisible();
  }
});

Then('the system should not display that product in the wishlist', async function () {
  for (const page of pages) {
    await expect(page.getByRole('cell', { name: productInWishlist })).toBeHidden();
  }
});