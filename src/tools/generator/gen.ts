const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.mercadolibre.com.ar/');
  await page.getByRole('link', { name: 'Vehículos', exact: true }).click();
  await page.getByRole('link', { name: 'Fiat Argo 1.3 Drive Gse $ 23.' }).click();
  await page.getByRole('button', { name: 'Ver descripción completa' }).click();
  await page.getByRole('link', { name: 'Ver teléfono' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Ver más consejos de seguridad' }).click();
  const page1 = await page1Promise;
  await page1.close();
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();