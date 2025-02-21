const reporter = require("cucumber-html-reporter");
const options = {
  theme: 'bootstrap',
  jsonFile: 'src/reports/front/cucumber-report.json',
  output: 'src/reports/front/front-report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    browser: {
      name: 'chrome',
      version: '78'
    },
    device: 'Local test machine',
    platform: {
      name: 'MacOS',
      version: 'Catalina'
    }
  }
};

reporter.generate(options);
