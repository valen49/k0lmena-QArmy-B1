import { chromium, firefox, webkit, Browser, Page } from 'playwright';
import { BeforeAll, AfterAll } from '@cucumber/cucumber';

let browsers: Browser[] = [];
let pages: Page[] = [];

BeforeAll(async function (this: any) {
  const browserChoice = process.env.BROWSER; 
  let browserTypes = [];

  if (browserChoice) {
    console.log(`Ejecutando solo en: ${browserChoice}`);
    if (browserChoice === 'chromium') browserTypes.push(chromium);
    if (browserChoice === 'firefox') browserTypes.push(firefox);
    if (browserChoice === 'webkit') browserTypes.push(webkit);
  } else {
    console.log('Ejecutando en Chromium, Firefox y WebKit...');
    browserTypes = [chromium, firefox, webkit];
  }

  for (const browserType of browserTypes) {
    console.log(`Iniciando pruebas en: ${browserType.name()}`);
    const browser = await browserType.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    browsers.push(browser);
    pages.push(page);
  }
});

AfterAll(async function () {
  console.log('Cerrando navegadores...');
  for (const browser of browsers) {
    await browser.close();
  }
});

export { browsers, pages };
