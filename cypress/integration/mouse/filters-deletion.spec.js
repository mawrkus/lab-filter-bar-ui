/// <reference types="cypress" />

describe('Filter Bar - Interacting with the mouse', () => {
  it('should allow filters deletion', () => {
    cy.visitWithFilters('filters-full.json');

    cy.deleteFilter(9);
    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"swim"');

    cy.deleteFilter(3);
    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDCharacterLIKE"smith"ANDCrewIS NOT NULLAND"swim"');

    cy.deleteFilter(7);
    cy.filterBarShouldHaveText('Season=2 (10 episodes)ANDCharacterLIKE"smith"ANDCrewIS NOT NULL');

    cy.deleteFilter(1);
    cy.filterBarShouldHaveText('CharacterLIKE"smith"ANDCrewIS NOT NULL');

    cy.deleteFilter(1);
    cy.filterBarShouldHaveText('CrewIS NOT NULL');

    cy.deleteFilter(1);
    cy.filterBarShouldBeEmpty();
  });
});
