Feature: Wishlist Management

  Scenario: Add a product to the wishlist from top products section
    Given the user is logged into the system
    And the user is on the home page
    When the user scrolls to the "Top Products" section
    And the user adds a product to the wishlist
    Then the system should display the wishlist
    And the wishlist should contain the added product

  Scenario: Add and remove a product from the wishlist
    Given the user is logged into the system
    And the user is on the home page
    When the user adds a product to the wishlist
    And the user removes the product from the wishlist
    Then the system should not display that product in the wishlist

  Scenario: Add a product from wishlist to cart and proceed to checkout
    Given the user is logged into the system
    And the user is on the wishlist page
    When the user adds a product from the wishlist to the cart
    And the user proceeds to checkout
    Then the system should display the checkout section
    And the checkout section should display the product added from the wishlist
