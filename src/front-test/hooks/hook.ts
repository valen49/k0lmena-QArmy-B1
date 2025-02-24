import { chromium, firefox, webkit, Browser, Page } from 'playwright';
import { Before, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';

let page: Page;
let browser: Browser | undefined;

setDefaultTimeout(60 * 1000);

Before(async function () {

  try {
    const isCI = process.env.CI === 'true' || process.env.CI === '1';
    const browserType = process.env.BROWSER || 'chromium';

    browser = await (
      browserType === 'firefox' ? firefox :
      browserType === 'webkit' ? webkit :
      chromium
    ).launch({ headless: isCI });

    const context = await browser.newContext();
    page = await context.newPage();
  } catch (error) {
    console.error('Error al iniciar el navegador:', error);
    throw error;
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

export { browser, page };
