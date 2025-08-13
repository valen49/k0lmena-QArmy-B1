Feature: User Login

  Scenario: User logs in with valid credentials
    Given the user is on the "Login" section
    When the user fills the login form with valid credentials
      | Email Address | <generated_email> |
      | Password      | Secret123!        |
    And the user clicks the "Login" button
    Then the system should redirect the user to the "My Account" section

  Scenario: Attempt to log in without filling required fields
    Given the user is on the "Login" section
    When the user leaves the Email Address and Password fields empty
    And the user clicks the "Login" button
    Then the system should display an error message
