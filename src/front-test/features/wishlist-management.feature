Feature: Wishlist Management

  Background:
    Given a user is registered in the system

  Scenario: Add a product to the wishlist from top products section
    Given the user is logged into the system
    And the user is on the home page
    When the user scrolls to the "Top Products" section
    And the user adds a product to the wishlist
    And the user navigates to the wishlist page
    Then the wishlist should contain the added product

  Scenario: Add and remove a product from the wishlist
    Given the user is logged into the system
    And the user is on the home page
    When the user scrolls to the "Top Products" section
    And the user adds a product to the wishlist
    And the user navigates to the wishlist page
    And the user removes the product from the wishlist
    Then the system should not display that product in the wishlist

