// src/mobile-test/support/wdio.conf.ts

import type { Options } from '@wdio/types';
import { resolve } from 'path';

export const config: Options.Testrunner = {
  runner: 'local',
  port: 4723,
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
    require: [resolve(__dirname, '../steps/**/*.ts')],
    timeout: 60000,
    failFast: false,
    // Genera el JSON en la carpeta /src/reports/mobile
    format: ['pretty', `json:${resolve(__dirname, '../../reports/mobile/cucumber-report.json')}`]
  },
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      project: resolve(__dirname, '../tsconfig.json')
    }
  },
  capabilities: [{
    platformName: 'Android',

    // Configuración para DISPOSITIVO FÍSICO (ajustá los valores reales)
    'appium:deviceName': 'S25 Ultra',
    'appium:udid': 'R5CY12AHTBH',
    'appium:platformVersion': '11.0',
    'appium:app': resolve(__dirname, '../apps/app.apk'),
    'appium:automationName': 'UiAutomator2',
    
    // Si querés usar emulador, descomentá esta sección y comentá la de dispositivo físico
    /*
    'appium:deviceName': 'emulator-5554',
    // Se omite 'udid'
    'appium:platformVersion': '12.0',
    'appium:app': resolve(__dirname, '../apps/app.apk'),
    'appium:automationName': 'UiAutomator2'
    */
  }]
} as Options.Testrunner & { autoCompileOpts?: Record<string, any> };
