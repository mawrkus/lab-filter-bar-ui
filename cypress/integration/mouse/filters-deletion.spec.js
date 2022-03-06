/// <reference types="cypress" />

import { operatorsList } from "../../support/commands";
import { crewList } from "../../fixtures/api/crewList";

describe("Filter Bar - Deletion with the mouse", () => {
  it("should allow the user to delete existing filters", () => {
    cy.visitWithFilters("filters-full.json");

    cy.deleteFilter(9);
    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"swim"'
    );

    cy.deleteFilter(3);
    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDCharacterLIKE"smith"ANDCrewIS NOT NULLAND"swim"'
    );

    cy.deleteFilter(7);
    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDCharacterLIKE"smith"ANDCrewIS NOT NULL'
    );

    cy.deleteFilter(1);
    cy.filterBarShouldHaveText('CharacterLIKE"smith"ANDCrewIS NOT NULL');

    cy.deleteFilter(1);
    cy.filterBarShouldHaveText("CrewIS NOT NULL");

    cy.deleteFilter(1);
    cy.filterBarShouldBeEmpty();
  });

  describe("if there is already a partial filter", () => {
    it("should automatically display the partial suggestions after deleting", () => {
      cy.visitWithFilters("filters-triple.json");

      cy.clickOnSearchInput();

      cy.selectLogicalOperator("AND");
      cy.selectAttribute("Crew");

      cy.deleteFilter(1);

      cy.suggestionsShouldBe(operatorsList);

      cy.selectOperator("=");

      cy.deleteFilter(1, true);

      cy.suggestionsShouldBe(crewList);
    });
  });
});
