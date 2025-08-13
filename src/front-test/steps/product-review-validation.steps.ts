import { Given, When, Then } from '@cucumber/cucumber';

// Steps for Product Review Validation feature
Given('the user is on the product page for any product', async function () {
  // ...
});

When('the user leaves the "Your Name" and "Your Review" fields empty', async function () {
  // ...
});

When('the user clicks the "Write Review" button', async function () {
  // ...
});

Then('the system should display the error message "Warning: Please select a review rating!"', async function () {
  // ...
});
