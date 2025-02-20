import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { BASEURL } from '../config';
import { page } from '../hooks/hook';
import { validateFirstLocator } from '../utils/validations';
import {
  inputLabel,
  buttonSearch,
  divResult
} from '../locators/exampleLocators';
import {
  getByPlaceholderAndClickIt,
  getByPlaceholderAndFillIt,
  getElementByRole
} from '../utils/interactions';

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
