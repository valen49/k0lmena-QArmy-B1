// src/mobile-test/support/hooks.ts

import { Before, After } from '@wdio/cucumber-framework';

Before(async () => {
  await browser.reloadSession();
});

After(async () => {
  // Opcional: cerrar sesión, limpiar datos, etc.
});