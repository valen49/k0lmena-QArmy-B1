@user-login @smoke @regression
Feature: User Login

 @negative-test @validation @critical
 Scenario: Attempt to log in without filling required fields
   Given the user is on the "Login" section
   When the user leaves the Password field empty
   And the user clicks the "Login" button
   Then the system should display an error message