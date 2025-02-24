import { chromium, firefox, webkit, Browser, Page } from 'playwright';
import { BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';

let browsers: Browser[] = [];
let pages: Page[] = [];

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  const browserChoice = process.env.BROWSER; // Lee la variable de entorno
  let browserTypes = [];

  if (browserChoice) {
    console.log(`Ejecutando solo en: ${browserChoice}`);
    if (browserChoice === 'chromium') browserTypes.push(chromium);
    if (browserChoice === 'firefox') browserTypes.push(firefox);
    if (browserChoice === 'webkit') browserTypes.push(webkit);
  } else {
    console.log('Ejecutando en Chromium, Firefox y WebKit...');
    browserTypes = [chromium, firefox, webkit]; // Ejecutar en los 3 si no se especifica BROWSER
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
