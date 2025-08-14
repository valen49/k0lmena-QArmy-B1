import { Given, When, Then } from '@cucumber/cucumber';

// Steps for User Registration feature
Given('the user is on the "Register" section', async function () {
  const baseUrl = process.env.BASE_URL || 'https://ecommerce-playground.lambdatest.io/';
  const registerUrl = `${baseUrl.replace(/\/$/, '')}/index.php?route=account/register`;
  for (const page of pages) {
    await page.goto(registerUrl);
  }

When('the user fills the registration form with valid unique data', async function (dataTable) {
  export const getByLocatorAndFillIt = async (page: Page, locator: LocatorType, value: string) => {
    await page.locator(locator).fill(value);
  };
  
});

When('the user registers successfully with a unique email', async function () {
  export const getByLocatorAndFillIt = async (page: Page, locator: LocatorType, value: string) => {
    await page.locator(locator).fill(value);
  };
  
});

When('the user tries to register again with the same email', async function () {
  export const getByLocatorAndFillIt = async (page: Page, locator: LocatorType, value: string) => {
    await page.locator(locator).fill(value);
  };
});

When('the user submits the registration form empty and without agreeing to the Privacy Policy', async function () {
  export const getByLocatorAndFillIt = async (page: Page, locator: LocatorType, value: string) => {
    await page.locator(locator).fill(value);
  };
});

When('the user selects "Subscribe" as "No"', async function () {
await page.click('label[for="input-newsletter-no"]');
});

When('the user agrees to the Privacy Policy', async function () {
  const isChecked = await page.isChecked('#input-agree');
  if (!isChecked) {
    await page.check('#input-agree');
  }
});

When('the user clicks "Continue"', async function () {
  
});

Then('the system should display a successful registration message', async function () {
  // ...
});

Then('the system should display an inline error message about the email', async function () {
  // ...
});

Then('the system should display inline error messages:', async function (dataTable) {
  // ...
});

Then('the system should display the warning "You must agree to the Privacy Policy!"', async function () {
  // ...
});
