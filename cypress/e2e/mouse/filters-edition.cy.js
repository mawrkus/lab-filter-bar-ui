/// <reference types="cypress" />

import { logicalOperatorsList, operatorsList } from "../../support/commands";
import { seasonsList, crewList } from "../../fixtures/api";

describe("Filter Bar - Edition with the mouse", () => {
  it("should allow the user to edit a filter value", () => {
    cy.visitWithFilters("filters-single.json");

    cy.editValue("1 (11 episodes)", "2 (10 episodes)");
    cy.filterBarShouldHaveText("Season=2 (10 episodes)");

    cy.editValue("2 (10 episodes)", "5 (10 episodes)");
    cy.filterBarShouldHaveText("Season=5 (10 episodes)");

    cy.editValue("5 (10 episodes)", "42{enter}");
    cy.filterBarShouldHaveText('Season="42"');
  });

  it("should allow the user to edit a logical operator", () => {
    cy.visitWithFilters("filters-single.json");

    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);

    cy.selectLogicalOperator("AND");
    cy.filterBarShouldHaveText("Season=1 (11 episodes)AND");

    cy.editLogicalOperator("AND", "OR");
    cy.filterBarShouldHaveText("Season=1 (11 episodes)OR");

    cy.selectAttribute("Season");
    cy.selectOperator("=");
    cy.selectValue("2 (10 episodes)");
    cy.filterBarShouldHaveText(
      "Season=1 (11 episodes)ORSeason=2 (10 episodes)"
    );

    cy.editLogicalOperator("OR", "AND", { checkForParens: true });
    cy.filterBarShouldHaveText(
      "Season=1 (11 episodes)ANDSeason=2 (10 episodes)"
    );
  });

  describe("when editing filter operators", () => {
    describe("simple operators (=, !=, LIKE, NOT LIKE)", () => {
      it("should allow the user to edit them", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editOperator("=", "!=");
        cy.filterBarShouldHaveText("Season!=1 (11 episodes)");

        cy.editOperator("!=", "LIKE");
        cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)");

        cy.editOperator("LIKE", "NOT LIKE");
        cy.filterBarShouldHaveText("SeasonNOT LIKE1 (11 episodes)");
      });
    });

    describe("operators with a preset value (IS NULL, IS NOT NULL)", () => {
      it("should allow the user to switch from simple operators to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editOperator("=", "IS NULL");
        cy.filterBarShouldHaveText("SeasonIS NULL");

        cy.editOperator("IS NULL", "IS NOT NULL");
        cy.filterBarShouldHaveText("SeasonIS NOT NULL");

        cy.editOperator("IS NOT NULL", "=", { checkForLoading: true });
        cy.suggestionsShouldBe(seasonsList);
        cy.filterBarShouldHaveText('Season="null"');

        cy.selectValue("1 (11 episodes)");
        cy.filterBarShouldHaveText("Season=1 (11 episodes)");
      });
    });

    describe("operators that support multiple selections (IN, NOT IN)", () => {
      it("should allow the user to switch from simple operators to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editOperator("=", "IN", { checkForLoading: true });
        cy.filterBarShouldHaveText("SeasonIN1 (11 episodes)");

        cy.selectMultipleSuggestions(["1 (11 episodes)", "2 (10 episodes)"]);
        cy.filterBarShouldHaveText("SeasonIN1 (11 episodes), 2 (10 episodes)");

        cy.editOperator("IN", "NOT IN");
        cy.filterBarShouldHaveText(
          "SeasonNOT IN1 (11 episodes), 2 (10 episodes)"
        );

        cy.clickOnChicletValue("1 (11 episodes), 2 (10 episodes)");

        cy.multiSuggestionsShouldBe({
          selected: ["1 (11 episodes)", "2 (10 episodes)"],
          list: [
            "3 (10 episodes)",
            "4 (10 episodes)",
            "5 (10 episodes)",
            "6 (10 episodes)",
            "7 (10 episodes)",
          ],
        });

        cy.editOperator("NOT IN", "LIKE", { checkForLoading: true });
        cy.suggestionsShouldBe(seasonsList);
        cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)");

        cy.selectValue("2 (10 episodes)");
        cy.filterBarShouldHaveText("SeasonLIKE2 (10 episodes)");
      });

      it("should allow the user to switch from preset values operators to them and vice versa", () => {
        cy.visitWithFilters("filters-single.json");

        cy.editOperator("=", "IS NULL");
        cy.filterBarShouldHaveText("SeasonIS NULL");

        cy.editOperator("IS NULL", "IN", { checkForLoading: true });
        cy.suggestionsShouldBe(seasonsList);
        cy.filterBarShouldHaveText("SeasonIN");

        cy.editOperator("IN", "NOT IN", { checkForLoading: true });
        cy.suggestionsShouldBe(seasonsList);
        cy.filterBarShouldHaveText("SeasonNOT IN");

        cy.editOperator("NOT IN", "IS NOT NULL");
        cy.filterBarShouldHaveText("SeasonIS NOT NULL");
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

          cy.editOperator("=", "LIKE");

          cy.suggestionsShouldBe(operatorsList);
          cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)ANDCrew");

          cy.editOperator("LIKE", "IN");
          cy.get("body").click();

          cy.suggestionsShouldBe(operatorsList);
          cy.filterBarShouldHaveText("SeasonIN1 (11 episodes)ANDCrew");
        });
      });

      describe("when editing the completed filter value", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");

          cy.editValue("1 (11 episodes)", "2 (10 episodes)");

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

          cy.editLogicalOperator("AND", "OR", { checkForParens: true });

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

          cy.editOperator("=", "LIKE", { checkForLoading: true });

          cy.suggestionsShouldBe(crewList);
          cy.filterBarShouldHaveText("SeasonLIKE1 (11 episodes)ANDCrew!=");

          cy.editOperator("LIKE", "IN", { checkForLoading: true });
          cy.get("body").click();

          // does not happen - see README (Quirks)
          // cy.suggestionsShouldBe(crewList);
          cy.filterBarShouldHaveText("SeasonIN1 (11 episodes)ANDCrew!=");
        });
      });

      describe("when editing the completed filter value", () => {
        it("should display automatically the partial filter attribute suggestions after edition", () => {
          cy.visitWithFilters("filters-single.json");

          cy.clickOnSearchInput();
          cy.selectLogicalOperator("AND");
          cy.selectAttribute("Crew");
          cy.selectOperator("!=");

          cy.editValue("1 (11 episodes)", "2 (10 episodes)", {
            checkForLoading: true,
          });

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

          cy.editLogicalOperator("AND", "OR", {
            checkForLoading: true,
            checkForParens: true,
          });

          cy.suggestionsShouldBe(crewList);

          cy.filterBarShouldHaveText("Season=1 (11 episodes)ORCrew!=");
        });
      });
    });
  });
});
