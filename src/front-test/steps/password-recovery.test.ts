import { Given, When, Then } from '@cucumber/cucumber';

// Steps for Password Recovery feature
Given('the user is on the "Forgot your password?" section', async function () {
  // ...
});

When('the user leaves the "Email Address" field empty', async function () {
  // ...
});

When('the user clicks the "Continue" button', async function () {
  // ...
});

Then('the system should display the error message "Warning: The E-Mail Address was not found in our records, please try again!"', async function () {
  // ...
});
