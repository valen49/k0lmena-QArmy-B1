<p align="center">
<img src="https://i.imgur.com/jrStTTp.png" width="400px">
</p>

# Playwright Automation Framework

For this project we use playwright with typescript.

## 🛠️ Setting up development environment

### Prerequisites
You will need the following to run this Framework:

NodeJs:
```
https://nodejs.org/en/download/
```

Visual Studio Code:
```
https://code.visualstudio.com/download
```

Open the project and run `npm install` or `npm i` to install de dependencies and then `npx playwright install`.

## 🚀 Run the project

### Front:

Run tests with @Smoke tags: 
```
npm run test
```
Run all tests: 
```
npm run allTests
```
Debug mode: 
```
npm run debug
```
UI mode: 
```
npm run testUI
```

### Performance test:

Report tests: 
```
npm run load
```

## 📋 Reports
After each execution, you can generate two types of reports

Front report: 
```
npm run report
```

Performance report: 
```
npm run load-report
```



## Architecture
This project contains all the logic inside of the source folder. Some of the folder you will find:

-- Features: Gherkin feature files with all the scenarios and steps.

-- Steps: Communication between features and steps functions.

-- Locators: Elements of the site to test. It could be xpath, classes, test id, etc.

-- Config: Files with general configurations of the project. Now contains the use of environments.

-- Utils: Files with reusable general functions of playwright.

## 📖 Documentation

[![Watch the video](https://img.youtube.com/vi/n7plezXinZ8/maxresdefault.jpg)](https://youtu.be/n7plezXinZ8)

## ⭐ License
This framework is Open Source :)

## 👥 Contributors
- Gianella Vezzoni
- Danilo Vezzoni
- Maximiliano Pintos


