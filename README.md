# Playwright Automation Framework

In this project we use playwright with typescript.

## Setting up development environment
At the root of the project folder, you should run `npm install` or `npm i` and then `npx playwright install`.

## Run project
Run `npm run test` to start running all the tests

## Architecture
This project contains all the logic inside of the source folder. Some of the folder you will find:

-- Features: Gherkin feature files with all the scenarios and steps.
-- Steps: Communication between features and steps functions.
-- Locators: Elements of the site to test. It could be xpath, classes, test id, etc.
-- Config: Files with general configurations of the project. Now contains the use of environments.
-- Utils: Files with reusable general functions of playwright.

## Reports
After each execution, the project generates two types of reports. Both of them are in html extension and show the results of the tests (show the total of test that passed, skipped and failed).
The name of the files are:
-- cucumber-report.html
-- playwright-report/index.html

