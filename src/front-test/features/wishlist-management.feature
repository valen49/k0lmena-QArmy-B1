Feature: Wishlist Management

  Scenario: Add a product to the wishlist
    Given the user is on the product page
    When the user adds the product to the wishlist
    And the user goes to the wishlist page
    Then the wishlist should contain the added product
