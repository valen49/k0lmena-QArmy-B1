Feature: Product Review Validation

  Scenario: Submit a review without selecting a rating
    Given the user is on the product page for any product
    When the user leaves the "Your Name" and "Your Review" fields empty
    And the user clicks the "Write Review" button
    Then the system should display the error message "Warning: Please select a review rating!"
