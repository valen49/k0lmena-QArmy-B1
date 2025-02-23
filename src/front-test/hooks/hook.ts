import { chromium, Browser, Page } from 'playwright';
import { AfterAll, setDefaultTimeout, Before } from '@cucumber/cucumber';

let page: Page;
let browser: Browser | undefined;

setDefaultTimeout(60 * 1000);

Before(async function () {
  try {
    // Si estamos en CI, lanzamos en modo headless
    const isCI = process.env.CI === 'true' || process.env.CI === '1';
    browser = await chromium.launch({ headless: isCI ? true : false });
    const context = await browser.newContext();
    page = await context.newPage();
  } catch (error) {
    console.error('Error al iniciar el navegador:', error);
    throw error;
  }
});

AfterAll(async function () {
  if (browser && typeof browser.close === 'function') {
    await browser.close();
  } else {
    console.warn('No hay una instancia de navegador para cerrar.');
  }
});

export { browser, page };