#!/usr/bin/env ts-node
import * as fs from 'fs/promises';
import * as path from 'path';
import { URL } from 'url';

// Tipos para representar las acciones encontradas
type Action =
  | { type: 'goto'; url: string }
  | { type: 'clickRole'; role: string; name: string; locatorName?: string }
  | { type: 'fillRole'; role: string; name: string; value: string; locatorName?: string }
  | { type: 'clickText'; text: string; locatorName?: string };

(async () => {
  const inputPath = path.resolve(__dirname, 'gen.ts');
  const outputDir = path.resolve(__dirname, 'output');

  // Asegurar carpeta de salida
  await fs.mkdir(outputDir, { recursive: true });

  // Leer archivo generado por Playwright Codegen
  const raw = await fs.readFile(inputPath, 'utf8');
  const lines = raw.split(/\r?\n/);

  // Parsear acciones
  const actions: Action[] = [];
  for (const line of lines) {
    let m;
    if ((m = line.match(/page\.goto\(['"`](.+?)['"`]\)/))) {
      actions.push({ type: 'goto', url: m[1] });
    } else if ((m = line.match(/page\.getByRole\(['"`](\w+)['"`],\s*\{\s*name:\s*['"`](.+?)['"`]\s*\}\)\.click/))) {
      actions.push({ type: 'clickRole', role: m[1], name: m[2] });
    } else if ((m = line.match(/page\.getByRole\(['"`](\w+)['"`],\s*\{\s*name:\s*['"`](.+?)['"`]\s*\}\)\.fill\(['"`](.*)['"`]\)/))) {
      actions.push({ type: 'fillRole', role: m[1], name: m[2], value: m[3] });
    } else if ((m = line.match(/page\.getByText\(['"`](.+?)['"`]\)\.click/))) {
      actions.push({ type: 'clickText', text: m[1] });
    }
  }

  // Generar selectores únicos y legibles
type LocMap = Record<string, string>;
  const locators: LocMap = {};
  function toLocatorVar(text: string, suffix: string): string {
    const clean = text.replace(/[^a-zA-Z0-9 ]+/g, ' ').trim();
    const words = clean.split(/\s+/).map((w, i) => {
      const lw = w.toLowerCase();
      return i === 0 ? lw : lw[0].toUpperCase() + lw.slice(1);
    });
    let base = words.join('') || 'element';
    let name = base + suffix;
    let i = 1;
    while (locators[name]) {
      name = base + suffix + i++;
    }
    return name;
  }

  // Asignar nombres de locator en cada acción
  for (const act of actions) {
    if (act.type === 'clickRole') {
      const varName = toLocatorVar(act.name, 'Button');
      locators[varName] = act.name;
      act.locatorName = varName;
    } else if (act.type === 'fillRole') {
      const varName = toLocatorVar(act.name, 'Input');
      locators[varName] = act.name;
      act.locatorName = varName;
    } else if (act.type === 'clickText') {
      const varName = toLocatorVar(act.text, 'Element');
      locators[varName] = act.text;
      act.locatorName = varName;
    }
  }

  // Datos para Gherkin en español
  const gotoAct = actions.find(a => a.type === 'goto') as Extract<Action, { type: 'goto' }>;
  const url = gotoAct?.url || 'http://example.com';
  const hostname = new URL(url).hostname.split('.').slice(-2, -1)[0];
  const pageName = hostname.charAt(0).toUpperCase() + hostname.slice(1);
  const featureTitle = `Página de ${pageName}`;
  const scenarioTitle = 'El usuario realiza las acciones grabadas';

  // Construir feature.feature
  const featLines: string[] = [];
  featLines.push('@Regression');
  featLines.push(`Feature: ${featureTitle}`);
  featLines.push(`    Scenario: ${scenarioTitle}`);

  for (const act of actions) {
    if (act.type === 'goto') {
      featLines.push(`        Given El usuario navega a la ${featureTitle}`);
      continue;
    }
    if (act.type === 'clickRole' && act.locatorName) {
      featLines.push(`        When El usuario clickea el botón ${locators[act.locatorName]}`);
    } else if (act.type === 'fillRole' && act.locatorName) {
      featLines.push(`        When El usuario ingresa "${act.value}" en el campo ${locators[act.locatorName]}`);
    } else if (act.type === 'clickText' && act.locatorName) {
      featLines.push(`        When El usuario clickea el elemento ${locators[act.locatorName]}`);
    }
  }
  featLines.push(`        Then Se muestran los resultados de la búsqueda`);
  await fs.writeFile(path.join(outputDir, 'feature.feature'), featLines.join('\n'));

  // Construir locators.ts
  const locLines = Object.entries(locators).map(
    ([key, val]) => `export const ${key} = '${val}';`
  );
  await fs.writeFile(path.join(outputDir, 'locators.ts'), locLines.join('\n'));

  // Construir steps.ts
  const steps: string[] = [];
  steps.push(`import { expect } from '@playwright/test';`);
  steps.push(`import { Given, When, Then } from '@cucumber/cucumber';`);
  steps.push(`import { BASEURL } from '../config';`);
  steps.push(`import { pages } from '../hooks/hook';`);
  steps.push(`import { validateFirstLocator } from '../utils/validations';`);
  steps.push(`import { ${Object.keys(locators).join(', ')} } from '../locators/exampleLocators';`);
  steps.push(`import { getElementByRole, getByLocatorAndFillIt, getByLocator } from '../utils/interactions';`);
  steps.push('');

  // Given
  steps.push(
    `Given('El usuario navega a la ${featureTitle}', async () => {`,
    `  for (const page of pages) {`,
    `    await page.goto(BASEURL);`,
    `  }`,
    `});`,
    ''
  );

  // When (todos los pasos de interacción)
  for (const act of actions) {
    if (act.type === 'goto') continue;
    if (act.type === 'clickRole' && act.locatorName) {
      steps.push(
        `When('El usuario clickea el botón ${locators[act.locatorName]}', async () => {`,
        `  for (const page of pages) {`,
        `    await getElementByRole(page, '${act.role}', ${act.locatorName});`,
        `  }`,
        `});`,
        ''
      );
    } else if (act.type === 'fillRole' && act.locatorName) {
      steps.push(
        `When('El usuario ingresa "${act.value}" en el campo ${locators[act.locatorName]}', async () => {`,
        `  for (const page of pages) {`,
        `    await getByLocatorAndFillIt(page, ${act.locatorName}, '${act.value}');`,
        `  }`,
        `});`,
        ''
      );
    } else if (act.type === 'clickText' && act.locatorName) {
      steps.push(
        `When('El usuario clickea el elemento ${locators[act.locatorName]}', async () => {`,
        `  for (const page of pages) {`,
        `    await getByLocator(page, \`text=\"${locators[act.locatorName]}\"\`);`,
        `  }`,
        `});`,
        ''
      );
    }
  }

  // Then: usar validateFirstLocator para verificar un elemento 'div'
  const lastLocatorKey = Object.keys(locators).pop();
  steps.push(
    `Then('Se muestran los resultados de la búsqueda', async () => {`,
    `  for (const page of pages) {`,
    `    const resultado = validateFirstLocator(page, 'div', ${lastLocatorKey});`,
    `    expect(resultado).toBeTruthy();`,
    `  }`,
    `});`
  );

  await fs.writeFile(path.join(outputDir, 'steps.ts'), steps.join('\n'));

  console.log('✅  Archivos generados en', outputDir);
})();
