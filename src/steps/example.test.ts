import { expect, chromium, Page, Browser } from '@playwright/test';
import { Given, setDefaultTimeout, When, Then, AfterAll, BeforeAll } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { inputLabel, buttonSearch, divResult } from '../locators/exampleLocators';
import { getByPlaceholderAndClickIt, getByPlaceholderAndFillIt, getElementByRole, getElementByText } from '../utils/interactions';
import { validateFirstLocator } from '../utils/validations';

setDefaultTimeout(60 * 1000);

let page: Page, browser: Browser;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();
});

AfterAll(async function () {
  await page.close();
  await browser.close();
})

Given("User navigates to MercadoLibre page", async () => {
  await page.goto(BASEURL);
});

When('User search for cars options', async function () {
  await getByPlaceholderAndClickIt(page, inputLabel);
  await getByPlaceholderAndFillIt(page, inputLabel, "auto");
  (await getElementByRole(page, "button", buttonSearch));
  
});

Then('It should show all the results according to the search', async function () {
  expect(validateFirstLocator(page, "div", divResult)).toBeTruthy();
});
