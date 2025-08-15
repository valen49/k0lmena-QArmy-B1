@Registration
Feature: User Registration

  Background:
    Given the user is on the registration page

  @Smoke @Regression
  Scenario: Successful registration with a dynamically generated email

    When the user fills the registration form with:
      | Field           | Value           |
      | First Name      | John            |
      | Last Name       | Doe             |
      | Email           | {{randomEmail}} |
      | Telephone       | 1234567890      |
      | Password        | Secret123!      |
      | PasswordConfirm | Secret123!      |

    And the user selects Suscription as No
    And the user clicks on the "Continue" button
    Then the user should be redirected to the "success" page


