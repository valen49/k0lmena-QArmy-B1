Feature: User Registration

  Scenario: User registers with valid data
    Given the user is on the "Register" section
    When the user fills the registration form with valid unique data
      | First Name       | John       |
      | Last Name        | Doe        |
      | Email            | <generated_email> |
      | Telephone        | 1234567890 |
      | Password         | Secret123! |
      | Password Confirm | Secret123! |
    And the user selects "Subscribe" as "No"
    And the user agrees to the Privacy Policy
    And the user clicks "Continue"
    Then the system should display a successful registration message

  Scenario: Attempt to register with an already used email
    Given the user is on the "Register" section
    When the user registers successfully with a unique email
    And the user tries to register again with the same email
    Then the system should display an inline error message about the email

  Scenario: Display validation errors on empty registration form submission
    Given the user is on the "Register" section
    When the user submits the registration form empty and without agreeing to the Privacy Policy
    Then the system should display inline error messages:
      | Field       | Error Message                                     |
      | First Name  | First Name must be between 1 and 32 characters! |
      | Last Name   | Last Name must be between 1 and 32 characters!  |
      | E-Mail      | E-Mail Address does not appear to be valid!      |
      | Telephone   | Telephone must be between 3 and 32 characters!  |
      | Password    | Password must be between 4 and 20 characters!   |
    And the system should display the warning "You must agree to the Privacy Policy!"
