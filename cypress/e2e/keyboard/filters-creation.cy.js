/// <reference types="cypress" />

import { attributesList } from "../../support/commands";
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
    cy.typeInSearchInput("Cr{downArrow}{enter}")
      .typeInSearchInput("{enter}", { checkForLoading: true }) // =
      .typeInSearchInput("Lee{downArrow}{downArrow}{enter}");

    cy.filterBarShouldHaveText("Crew=Lee Harting (Producer)");

    // 2 + 3 -> AND + attribute-operator-value
    cy.typeInSearchInput("AND{enter}");

    cy.filterBarShouldHaveText("Crew=Lee Harting (Producer)AND");

    cy.typeInSearchInput("{downArrow}{enter}") // Episode
      .typeInSearchInput("{downArrow}{enter}", { checkForLoading: true }) // !=
      .typeInSearchInput("{enter}"); // !=

    cy.filterBarShouldHaveText(
      "Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)"
    );

    // 4 + 5 -> OR + attribute-operator-value (search text)
    cy.typeInSearchInput("or{downArrow}{enter}");

    cy.filterBarShouldHaveText(
      "Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)OR"
    );

    cy.typeInSearchInput("Ch{downArrow}{enter}")
      .typeInSearchInput("LIKE{enter}", { checkForLoading: true })
      .typeInSearchInput("smith{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"'
    );

    // 6 + 7 -> AND + attribute-operator (preset value)
    cy.typeInSearchInput("AN{downArrow}{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"AND'
    );

    cy.typeInSearchInput("Crew{enter}").typeInSearchInput("IS NOT NULL{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULL'
    );

    // 8 + 9 -> AND + search text
    cy.typeInSearchInput("AND{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND'
    );

    cy.typeInSearchInput("adult{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"'
    );

    // 10 + 11 -> search text with automatic AND
    cy.typeInSearchInput("swim{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"'
    );

    // 12 + 13 -> OR + attribute-operator-value (multiple selections)
    cy.typeInSearchInput("OR{enter}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"OR'
    );

    cy.typeInSearchInput("Season{enter}").typeInSearchInput("IN{enter}", {
      checkForLoading: true,
    });

    cy.typeInSearchInput("2 (10 episodes){enter}")
      .typeInSearchInput("1 (11 episodes){enter}")
      .typeInSearchInput("{esc}");

    cy.filterBarShouldHaveText(
      'Crew=Lee Harting (Producer)ANDEpisode!=Pilot (S1E1)ORCharacterLIKE"smith"ANDCrewIS NOT NULLAND"adult"AND"swim"ORSeasonIN2 (10 episodes), 1 (11 episodes)'
    );
  });

  describe("when creating a new filter", () => {
    describe("if there is only a partial filter attribute", () => {
      const tests = [
        { keyLabel: "down arrow key", characterSequence: "{downArrow}" },
        { keyLabel: "enter key", characterSequence: "{enter}" },
      ];

      tests.forEach(({ keyLabel, characterSequence }) => {
        it(`should allow the user to edit it, using shift-tab and the ${keyLabel}`, () => {
          cy.typeInSearchInput("Episode{enter}")
            .tab({ shift: true })
            .type(characterSequence)
            .suggestionsShouldBe(attributesList);

          cy.typeInSearchInput("Character{enter}")
            .tab({ shift: true })
            .type(characterSequence)
            .suggestionsShouldBe(attributesList);

          cy.typeInSearchInput("Crew{enter}")
            .tab({ shift: true })
            .type(characterSequence)
            .suggestionsShouldBe(attributesList);

          cy.typeInSearchInput("Season{enter}")
            .typeInSearchInput("LIKE{enter}", { checkForLoading: true })
            .typeInSearchInput("2 (10 episodes){enter}");

          cy.filterBarShouldHaveText("SeasonLIKE2 (10 episodes)");
        });
      });

      it("should allow the user to complete it with a search text", () => {
        cy.typeInSearchInput("Episode{enter}")
          .tab({ shift: true })
          .type("{downArrow}")
          .suggestionsShouldBe(attributesList);

        cy.typeInSearchInput("pilot{enter}");

        cy.filterBarShouldHaveText('"pilot"');
      });
    });

    describe("if there is a partial filter attribute & operator", () => {
      it("should allow the user to edit the operator", () => {
        cy.typeInSearchInput("Season{enter}")
          .typeInSearchInput("={enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("!={enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("LIKE{enter}", {
            checkForLoading: true,
          })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("IN{enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("={enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("IN{enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true }).type("{downArrow}IS NULL{enter}");

        cy.filterBarShouldHaveText("SeasonIS NULL");
      });

      it("should allow the user to edit the attribute", () => {
        cy.typeInSearchInput("Season{enter}")
          .typeInSearchInput("={enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("Episode{enter}", { checkForLoading: true })
          .suggestionsShouldBe(episodesList);

        cy.tab({ shift: true })
          .tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("Character{enter}", { checkForLoading: true })
          .suggestionsShouldBe(charactersList);

        cy.tab({ shift: true })
          .tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("Crew{enter}", { checkForLoading: true })
          .suggestionsShouldBe(crewList);

        cy.typeInSearchInput("Dan Harmon (Creator){enter}");

        cy.filterBarShouldHaveText("Crew=Dan Harmon (Creator)");
      });

      it("should allow the user to complete the attribute with a search text", () => {
        cy.typeInSearchInput("Season{enter}")
          .typeInSearchInput("={enter}", { checkForLoading: true })
          .suggestionsShouldBe(seasonsList);

        cy.tab({ shift: true })
          .tab({ shift: true })
          .type("{downArrow}")
          .typeInSearchInput("spring{enter}");

        cy.filterBarShouldHaveText('"spring"');
      });
    });

    describe("if there is an error while fetching the suggestions", () => {
      it("should display a fetch error that disappear when closing the suggestions", () => {
        cy.intercept(`${TvMazeApiClient.apiHost}/**`, { statusCode: 500 }).as(
          "fetchData"
        );

        cy.typeInSearchInput("Season{enter}").typeInSearchInput("={enter}", {
          checkForLoading: false,
        });

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
        cy.intercept(`${TvMazeApiClient.apiHost}/**`, { statusCode: 500 });

        cy.typeInSearchInput("Season{enter}").typeInSearchInput("={enter}", {
          checkForLoading: false,
        });

        cy.typeInSearchInput("winter?{enter}");

        cy.filterBarShouldHaveText('Season="winter?"');
      });
    });
  });
});
