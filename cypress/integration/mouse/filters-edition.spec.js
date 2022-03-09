/// <reference types="cypress" />

import { operatorsList } from "../../support/commands";
import { seasonsList, crewList } from "../../fixtures/api";

describe("Filter Bar - Edition with the mouse", () => {
  it("should allow the user to edit a filter value", () => {
    cy.visitWithFilters("filters-single.json");

    cy.editFilterValue("1 (11 episodes)", "2 (10 episodes)");
    cy.filterBarShouldHaveText("Season=2 (10 episodes)");

    cy.editFilterValue("2 (10 episodes)", "5 (10 episodes)");
    cy.filterBarShouldHaveText("Season=5 (10 episodes)");

    cy.editFilterValue("5 (10 episodes)", "42{enter}");
    cy.filterBarShouldHaveText('Season="42"');
  });

  it("should allow the user to edit a logical operator", () => {
    cy.visitWithFilters("filters-triple.json");

    cy.editLogicalFilterOperator("AND", "OR");
    cy.filterBarShouldHaveText("Season=1 (11 episodes)OREpisode!=Pilot (S1E1)");

    cy.editLogicalFilterOperator("OR", "AND");
    cy.filterBarShouldHaveText(
      "Season=1 (11 episodes)ANDEpisode!=Pilot (S1E1)"
    );
  });

  describe("when editing filter operators", () => {
    describe("simple operators (=, !=, LIKE, NOT LIKE)", () => {
      it("should allow the user to edit them", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editFilterOperator("=", "!=");
        cy.filterBarShouldHaveText("Season!=1 (11 episodes)");

        cy.editFilterOperator("=", "LIKE");
        cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)");

        cy.editFilterOperator("LIKE", "NOT LIKE");
        cy.filterBarShouldHaveText("SeasonNOT LIKE1 (11 episodes)");
      });
    });

    describe("operators with a preset value (IS NULL, IS NOT NULL)", () => {
      it("should allow the user to switch from simple operators to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editFilterOperator("=", "IS NULL");
        cy.filterBarShouldHaveText("SeasonIS NULL");

        cy.editFilterOperator("IS NULL", "IS NOT NULL");
        cy.filterBarShouldHaveText("SeasonIS NOT NULL");

        cy.editFilterOperator("IS NOT NULL", "=", true);
        cy.chicletShouldValue('"null"');
        cy.suggestionsShouldBe(seasonsList);

        cy.selectValue("1 (11 episodes)");
        cy.filterBarShouldHaveText("Season=1 (11 episodes)");
      });
    });

    describe("operators that support multiple selections (IN, NOT IN)", () => {
      it("should allow the user to switch from simple operators to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editFilterOperator("=", "IN", true);
        cy.chicletShouldValue("1 (11 episodes)");

        cy.selectMultipleSuggestions(["1 (11 episodes)", "2 (10 episodes)"]);
        cy.chicletShouldValue("1 (11 episodes), 2 (10 episodes)");

        cy.filterBarShouldHaveText("SeasonIN1 (11 episodes), 2 (10 episodes)");

        cy.editFilterOperator("IN", "NOT IN");

        cy.filterBarShouldHaveText(
          "SeasonNOT IN1 (11 episodes), 2 (10 episodes)"
        );

        cy.clickOnChicletValue("1 (11 episodes), 2 (10 episodes)");

        cy.multiSuggestionsShouldBe({
          selected: ["1 (11 episodes)", "2 (10 episodes)"],
          list: ["3 (10 episodes)", "4 (10 episodes)", "5 (10 episodes)"],
        });

        cy.editFilterOperator("NOT IN", "LIKE");

        cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)");

        cy.clickOnChicletValue("1 (11 episodes)");

        cy.suggestionsShouldBe(seasonsList);
      });

      // TODO
      it.skip("should allow the user to switch from operators with preset values to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");
      });
    });
  });

  describe("when editing filters", () => {
    describe("when there is a partial filter attribute", () => {
      describe("when editing the completed filter operator", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");

          cy.editFilterOperator("=", "LIKE");
          cy.suggestionsShouldBe(operatorsList);

          cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)ANDCrew");
        });
      });

      describe("when editing the completed filter value", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");

          cy.editFilterValue("1 (11 episodes)", "2 (10 episodes)");

          cy.suggestionsShouldBe(operatorsList);

          cy.filterBarShouldHaveText("Season=2 (10 episodes)ANDCrew");
        });
      });

      describe("when editing the logical operator", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");

          cy.editLogicalFilterOperator("AND", "OR");

          cy.suggestionsShouldBe(operatorsList);

          cy.filterBarShouldHaveText("Season=1 (11 episodes)ORCrew");
        });
      });
    });

    describe("when there is a partial filter attribute and operator", () => {
      describe("when editing the completed filter operator", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");
          cy.selectOperator("!=");

          cy.editFilterOperator("=", "LIKE", true);

          cy.suggestionsShouldBe(crewList);

          cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)ANDCrew!=");
        });
      });

      describe("when editing the completed filter value", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");
          cy.selectOperator("!=");

          cy.editFilterValue("1 (11 episodes)", "2 (10 episodes)", true);

          cy.suggestionsShouldBe(crewList);

          cy.filterBarShouldHaveText("Season=2 (10 episodes)ANDCrew!=");
        });
      });

      describe("when editing the logical operator", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");
          cy.selectOperator("!=");

          cy.editLogicalFilterOperator("AND", "OR", true);

          cy.suggestionsShouldBe(crewList);

          cy.filterBarShouldHaveText("Season=1 (11 episodes)ORCrew!=");
        });
      });
    });
  });
});
