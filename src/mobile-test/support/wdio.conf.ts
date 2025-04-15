// src/mobile-test/support/wdio.conf.ts

import type { Options } from '@wdio/types';
import { resolve } from 'path';

export const config: Options.Testrunner = {
  runner: 'local',
  port: 4723,
  // Se construye la ruta absoluta a la carpeta "features"
  specs: [resolve(__dirname, '../features/**/*.feature')],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 10000,
  framework: 'cucumber',
  services: ['appium'],
  reporters: ['spec'],
  cucumberOpts: {
    // Ruta absoluta a los step definitions
    require: [resolve(__dirname, '../steps/**/*.ts')],
    timeout: 60000,
    failFast: false,
    format: ['pretty']
  },
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      // Ruta al tsconfig para mobile
      project: resolve(__dirname, '../tsconfig.json')
    }
  },
  capabilities: [{
    platformName: 'Android',

    // Opciones para DISPOSITIVO FÍSICO:
    'appium:deviceName': 'S25 Ultra',
    'appium:udid': 'R5CY12AHTBH',
    'appium:platformVersion': '11.0',
    'appium:app': resolve(__dirname, '../apps/app.apk'),
    'appium:automationName': 'UiAutomator2',

    // Opciones para EMULADOR:
    // Descomentá estas líneas y comentá las de dispositivo físico si quieres usar emulador
    /*
    'appium:deviceName': 'emulator-5554',
    // Eliminá o comentá la línea 'appium:udid'
    'appium:platformVersion': '12.0',
    'appium:app': resolve(__dirname, '../apps/app.apk'),
    'appium:automationName': 'UiAutomator2'
    */
  }]
} as Options.Testrunner & { autoCompileOpts?: Record<string, any> };
