import { BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  setDefaultTimeout(60 * 1000);
});

AfterAll(async function () {
  await browser.close();
});

export { browser, page };