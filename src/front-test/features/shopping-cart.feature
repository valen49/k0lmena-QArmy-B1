Feature: Shopping Cart

  Scenario: Remove product from shopping cart and verify empty cart message
    Given the user is logged in
    And the user is on the "Checkout" page
    When the user removes a product from the shopping cart
    Then the system should display the message "Shopping Cart is empty"
