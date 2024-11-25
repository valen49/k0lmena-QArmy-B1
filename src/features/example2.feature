Feature: Google search test 2 example
@NotSmoke
    Scenario: User search and validate results
        Given User navigates to Google page
        When User search for cars options
        Then It should show all the results according to the search