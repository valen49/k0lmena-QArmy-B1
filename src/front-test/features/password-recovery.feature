Feature: Password Recovery

  Scenario: Attempt to recover password without entering email
    Given the user is on the "Forgot your password?" section
    When the user leaves the "Email Address" field empty
    And the user clicks the "Continue" button
    Then the system should display the error message "Warning: The E-Mail Address was not found in our records, please try again!"
