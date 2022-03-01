/// <reference types="cypress" />

describe('Filter Bar - Interacting with the mouse', () => {
  it('should allow the edition of the filter operator', () => {
    cy.visitWithFilters('filters-single.json');

    cy.editFilterOperator('!=', 'LIKE');
    cy.filterBarShouldHaveText('SeasonLIKE1 (11 episodes)');

    cy.editFilterOperator('LIKE', '=');
    cy.filterBarShouldHaveText('Season=1 (11 episodes)');

    cy.editFilterOperator('=', 'IS NULL');
    cy.filterBarShouldHaveText('SeasonIS NULL');

    cy.editFilterOperator('IS NULL', 'NOT LIKE', true);
    cy.selectSuggestion('2 (10 episodes)');

    cy.filterBarShouldHaveText('SeasonNOT LIKE2 (10 episodes)');
  });

  it('should allow the edition of the filter value', () => {
    cy.visitWithFilters('filters-single.json');

    cy.editFilterValue('1 (11 episodes)', '2 (10 episodes)');
    cy.filterBarShouldHaveText('Season!=2 (10 episodes)');

    cy.editFilterValue('2 (10 episodes)', '5 (10 episodes)');
    cy.filterBarShouldHaveText('Season!=5 (10 episodes)');

    cy.editFilterValue('5 (10 episodes)', '42{enter}');
    cy.filterBarShouldHaveText('Season!="42"');
  });

  it('should allow the edition of a logical operator', () => {
    cy.visitWithFilters('filters-triple.json');

    cy.editFilterOperator('AND', 'OR');
    cy.filterBarShouldHaveText('Season=1 (11 episodes)OREpisode!=Pilot (S1E1)');

    cy.editFilterOperator('OR', 'AND');
    cy.filterBarShouldHaveText('Season=1 (11 episodes)ANDEpisode!=Pilot (S1E1)');
  });
});
