import {
  chromium,
  Browser,
  Page
} from 'playwright';
import {
  AfterAll,
  setDefaultTimeout,
  Before
} from '@cucumber/cucumber';

let page: Page;
let browser: Browser;

setDefaultTimeout(60 * 1000);

Before(async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

AfterAll(async function () {
  await browser.close();
});

export { browser, page };
