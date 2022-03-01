/// <reference types="cypress" />

describe('Filter Bar - Interacting with the mouse', () => {
  it('should allow the creation of a diverse selection of filters', () => {
    cy.visit('/');

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
});
