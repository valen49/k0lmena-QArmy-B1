import { Given, When, Then } from '@cucumber/cucumber';

// Steps for User Registration feature
Given('the user is on the "Register" section', async function () {
  // ...
});

When('the user fills the registration form with valid unique data', async function (dataTable) {
  // ...
});

When('the user registers successfully with a unique email', async function () {
  // ...
});

When('the user tries to register again with the same email', async function () {
  // ...
});

When('the user submits the registration form empty and without agreeing to the Privacy Policy', async function () {
  // ...
});

When('the user selects "Subscribe" as "No"', async function () {
  // ...
});

When('the user agrees to the Privacy Policy', async function () {
  // ...
});

When('the user clicks "Continue"', async function () {
  // ...
});

Then('the system should display a successful registration message', async function () {
  // ...
});

Then('the system should display an inline error message about the email', async function () {
  // ...
});

Then('the system should display inline error messages:', async function (dataTable) {
  // ...
});

Then('the system should display the warning "You must agree to the Privacy Policy!"', async function () {
  // ...
});
