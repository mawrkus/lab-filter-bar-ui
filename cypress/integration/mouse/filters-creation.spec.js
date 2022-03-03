/// <reference types="cypress" />

describe('Filter Bar - Interacting with the mouse', () => {
  beforeEach(() => cy.visit('/'));

  it('should allow the creation of a diverse selection of filters', () => {
    // 1
    cy.clickOnSearchInput();

    cy.selectSuggestion('Season');
    cy.selectSuggestion('=', true);
    cy.selectSuggestion('2 (10 episodes)');

    cy.filterBarShouldHaveText('Season=2 (10 episodes)');

    // 2 + 3
    cy.clickOnSearchInput();

    cy.selectSuggestion('AND');
    cy.selectSuggestion('Episode');
    cy.selectSuggestion('!=', true);
    cy.selectSuggestion('Rick Potion #9 (S1E6)');

    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)');

    // 4 + 5
    cy.clickOnSearchInput();

    cy.selectSuggestion('OR');
    cy.selectSuggestion('Character');
    cy.selectSuggestion('LIKE', true);
    cy.typeInSearchInput('smith{enter}');

    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"');

    // 6 + 7
    cy.clickOnSearchInput();

    cy.selectSuggestion('AND');
    cy.selectSuggestion('Crew');
    cy.selectSuggestion('IS NOT NULL',);

    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULL');

    // 8 + 9
    cy.clickOnSearchInput();

    cy.selectSuggestion('AND');
    cy.typeInSearchInput('adult{enter}');

    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"');

    // 10 + 11
    cy.clickOnSearchInput();

    cy.typeInSearchInput('swim{enter}');

    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"');
  });

  it('should allow the user to edit the partial filter before the complete filter is created', () => {
    cy.clickOnSearchInput();

    cy.suggestionsShouldBe(['Season', 'Episode', 'Character', 'Crew']);

    cy.selectSuggestion('Episode');

    cy.suggestionsShouldBe(['=', '!=', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL']);

    // edit partial attribute
    cy.clickOnPartialAttribute();

    cy.suggestionsShouldBe(['Season', 'Episode', 'Character', 'Crew']);

    cy.selectSuggestion('Season');

    cy.suggestionsShouldBe(['=', '!=', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL']);

    cy.selectSuggestion('!=', true);

    cy.suggestionsShouldBe([
      '1 (11 episodes)',
      '2 (10 episodes)',
      '3 (10 episodes)',
      '4 (10 episodes)',
      '5 (10 episodes)',
    ]);

    // edit partial operator
    cy.clickOnPartialOperator();

    cy.suggestionsShouldBe(['=', '!=', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL']);

    cy.selectSuggestion('LIKE', true);

    cy.suggestionsShouldBe([
      '1 (11 episodes)',
      '2 (10 episodes)',
      '3 (10 episodes)',
      '4 (10 episodes)',
      '5 (10 episodes)',
    ]);

    // edit partial attribute when an operator is already seelcted
    cy.clickOnPartialAttribute();

    cy.suggestionsShouldBe(['Season', 'Episode', 'Character', 'Crew']);

    cy.selectSuggestion('Crew', true);

    cy.suggestionsShouldBe([
      "Justin Roiland (Creator)",
      "Justin Roiland (Executive Producer)",
      "James A. Fino (Executive Producer)",
      "Joe Russo II (Executive Producer)",
      "Dan Harmon (Creator)",
      "Dan Harmon (Executive Producer)",
      "Mehar Sethi (Supervising Producer)",
      "Dan Guterman (Co-Executive Producer)",
      "Dan Guterman (Producer)",
      "Ryan Ridley (Co-Executive Producer)",
      "Ryan Ridley (Producer)",
      "Keith Crofford (Executive Producer)",
      "Michael Lazzo (Executive Producer)",
      "Pete Michels (Supervising Producer)",
      "Tom Kauffman (Producer)",
      "Mike McMahan (Executive Producer)",
      "Mike McMahan (Supervising Producer)",
      "Lee Harting (Editor)",
      "Lee Harting (Producer)",
      "J. Michael Mendel (Producer)",
      "Wes Archer (Supervising Art Director)",
      "James McDermott (Art Director)",
      "Ruth Lambert (Casting Director)",
      "Ryan Elder (Music)",
      "Ryan Elder (Main Title Theme)",
      "James Siciliano (Co-Producer)",
      "Konrad Pinon (Re-Recording Mixer)",
      "Hunter Curra (Supervising Sound Editor)",
      "Ollie Green (Producer)",
      "Jeff Loveness (Co-Producer)",
      "Michael Waldron (Producer)",
      "Sydney Ryan (Producer)",
      "Robert McGee (Casting Director)",
      "Steve Levy (Associate Producer)",
      "Dave Otterby (Production Manager)",
    ]);

    cy.selectSuggestion('Dan Harmon (Creator)');

    cy.filterBarShouldHaveText('CrewLIKEDan Harmon (Creator)');
  });
});
