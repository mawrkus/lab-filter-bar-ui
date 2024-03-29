/// <reference types="cypress" />

import { attributesList, logicalOperatorsList } from "../../support/commands";
import {
  seasonsList,
  episodesList,
  charactersList,
  crewList,
} from "../../fixtures/api";
import { TvMazeApiClient } from "../../../src/infrastructure/http/TvMazeApiClient";

describe("Filter Bar - Creation with the mouse", () => {
  beforeEach(() => cy.visit("/"));

  it("should allow the user to create a diverse selection of filters", () => {
    // 1 -> attribute-operator-value
    cy.clickOnSearchInput();

    cy.selectAttribute("Season");
    cy.selectOperator("=");
    cy.selectValue("2 (10 episodes)");

    cy.filterBarShouldHaveText("Season=2 (10 episodes)");

    // 2 + 3 -> AND + attribute-operator-value
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);
    cy.selectLogicalOperator("AND");

    cy.filterBarShouldHaveText("Season=2 (10 episodes)AND");

    cy.selectAttribute("Episode");
    cy.selectOperator("!=");
    cy.selectValue("Rick Potion #9 (S1E6)");

    cy.filterBarShouldHaveText(
      "Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)"
    );

    // 4 + 5 -> OR + attribute-operator-value (search text)
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);
    cy.selectLogicalOperator("OR");

    cy.filterBarShouldHaveText(
      "Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)OR"
    );

    cy.selectAttribute("Character");
    cy.selectOperator("LIKE");
    cy.typeInSearchInput("smith{enter}");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"'
    );

    // 6 + 7 -> AND + attribute-operator (preset value)
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);
    cy.selectLogicalOperator("AND");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"AND'
    );

    cy.selectAttribute("Crew");
    cy.selectOperator("IS NOT NULL");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULL'
    );

    // 8 + 9 -> AND + search text
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);
    cy.selectLogicalOperator("AND");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND'
    );

    cy.typeInSearchInput("adult{enter}");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"'
    );

    // 10 + 11 -> search text with automatic AND
    cy.clickOnSearchInput();

    cy.typeInSearchInput("swim{enter}");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"'
    );

    // 12 + 13 -> OR + attribute-operator-value (multiple selections)
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(logicalOperatorsList);
    cy.selectLogicalOperator("OR");

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"OR'
    );

    cy.selectAttribute("Season");
    cy.selectOperator("IN");
    // note: the order of the array passed will not be respected
    cy.selectMultipleSuggestions(["2 (10 episodes)", "1 (11 episodes)"]);

    cy.filterBarShouldHaveText(
      'Season=2 (10 episodes)ANDEpisode!=Rick Potion #9 (S1E6)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"ORSeasonIN1 (11 episodes), 2 (10 episodes)'
    );
  });

  describe("when creating a new filter", () => {
    describe("if there is only a partial filter attribute", () => {
      it("should allow the user to edit it", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.selectAttribute("Episode");

        cy.clickOnPartialAttribute();
        cy.selectAttribute("Character");

        cy.clickOnPartialAttribute();
        cy.selectAttribute("Crew");

        cy.clickOnPartialAttribute();
        cy.selectAttribute("Season");

        cy.selectOperator("LIKE");
        cy.suggestionsShouldBe(seasonsList);
        cy.selectValue("2 (10 episodes)");

        cy.filterBarShouldHaveText("SeasonLIKE2 (10 episodes)");
      });

      it("should allow the user to complete it with a search text", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.selectAttribute("Episode");

        cy.clickOnPartialAttribute();
        cy.typeInSearchInput("pilot{enter}");

        cy.filterBarShouldHaveText('"pilot"');
      });
    });

    describe("if there is a partial filter attribute & operator", () => {
      it("should allow the user to edit the operator", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.selectAttribute("Season");
        cy.selectOperator("=");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("!=");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("LIKE");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("IN");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("=");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("IN");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialOperator();
        cy.selectOperator("IS NULL");

        cy.filterBarShouldHaveText("SeasonIS NULL");
      });

      it("should allow the user to edit the attribute", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.selectAttribute("Season");
        cy.selectOperator("=");
        cy.suggestionsShouldBe(seasonsList);

        // we don't use selectAttribute() because we don't expect the operators suggestions
        cy.clickOnPartialAttribute();
        cy.selectSuggestion("Episode", { checkForLoading: true });
        cy.suggestionsShouldBe(episodesList);

        cy.clickOnPartialAttribute();
        cy.selectSuggestion("Character", { checkForLoading: true });
        cy.suggestionsShouldBe(charactersList);

        cy.clickOnPartialAttribute();
        cy.selectSuggestion("Crew", { checkForLoading: true });
        cy.suggestionsShouldBe(crewList);

        cy.selectValue("Dan Harmon (Creator)");

        cy.filterBarShouldHaveText("Crew=Dan Harmon (Creator)");
      });

      it("should allow the user to complete the attribute with a search text", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.selectAttribute("Season");
        cy.selectOperator("=");
        cy.suggestionsShouldBe(seasonsList);

        cy.clickOnPartialAttribute();
        cy.typeInSearchInput("spring{enter}");

        cy.filterBarShouldHaveText('"spring"');
      });
    });

    describe("if there is an error while fetching the suggestions", () => {
      it("should display a fetch error that disappear when closing the suggestions", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.intercept(`${TvMazeApiClient.apiHost}/**`, { statusCode: 500 }).as(
          "fetchData"
        );

        cy.selectAttribute("Season");
        cy.selectOperator("=");

        cy.get('.suggestions [role="listbox"] .message').contains(
          "💥 Ooops! Fetch error."
        );

        cy.get('.suggestions [role="combobox"]').should("have.class", "error");

        cy.get("body").click();

        cy.get('.suggestions [role="combobox"]').should(
          "not.have.class",
          "error"
        );
      });

      it("should allow the user to enter a free search text", () => {
        cy.clickOnSearchInput();
        cy.suggestionsShouldBe(attributesList);

        cy.intercept(`${TvMazeApiClient.apiHost}/**`, { statusCode: 500 });

        cy.selectAttribute("Season");
        cy.selectOperator("=");

        cy.typeInSearchInput("winter?{enter}");

        cy.filterBarShouldHaveText('Season="winter?"');
      });
    });
  });
});
