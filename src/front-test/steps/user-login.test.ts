import { Given, When, Then } from '@cucumber/cucumber';

// Steps for User Login feature
Given('the user is on the "Login" section', async function () {
  // ...
});

When('the user fills the login form with valid credentials', async function (dataTable) {
  // ...
});

When('the user leaves the Email Address and Password fields empty', async function () {
  // ...
});

When('the user clicks the "Login" button', async function () {
  // ...
});

Then('the system should redirect the user to the "My Account" section', async function () {
  // ...
});

Then('the system should display an error message', async function () {
  // ...
});
