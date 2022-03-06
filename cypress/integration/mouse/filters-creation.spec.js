/// <reference types="cypress" />

import { attributesList } from "../../support/commands";
import { seasonsList } from "../../fixtures/api/seasonsList";
import { episodesList } from "../../fixtures/api/episodesList";
import { crewList } from "../../fixtures/api/crewList";
import { charactersList } from "../../fixtures/api/charactersList";

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

  it('should allow the user to edit the partial filter attribute', () => {
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(attributesList);

    cy.selectAttribute('Episode');

    cy.clickOnPartialAttribute();
    cy.selectAttribute('Character');

    cy.clickOnPartialAttribute();
    cy.selectAttribute('Crew');

    cy.clickOnPartialAttribute();
    cy.selectAttribute('Season');

    cy.selectOperator('LIKE');
    cy.suggestionsShouldBe(seasonsList);
    cy.selectValue('2 (10 episodes)');

    cy.filterBarShouldHaveText('SeasonLIKE2 (10 episodes)');
  });

  it('should allow the user to edit the partial filter operator', () => {
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(attributesList);

    cy.selectAttribute('Season');
    cy.selectOperator('=');
    cy.suggestionsShouldBe(seasonsList);

    cy.clickOnPartialOperator();
    cy.selectOperator('!=');
    cy.suggestionsShouldBe(seasonsList);

    cy.clickOnPartialOperator();
    cy.selectOperator('LIKE');
    cy.suggestionsShouldBe(seasonsList);

    cy.clickOnPartialOperator();
    cy.selectOperator('IN');
    cy.suggestionsShouldBe(seasonsList);

    cy.clickOnPartialOperator();
    cy.selectOperator('IS NULL');

    cy.filterBarShouldHaveText('SeasonIS NULL');
  });

  it('should allow the user to edit the partial filter attribute when there is already a partial filter operator', () => {
    cy.clickOnSearchInput();
    cy.suggestionsShouldBe(attributesList);

    cy.selectAttribute('Season');
    cy.selectOperator('=');
    cy.suggestionsShouldBe(seasonsList);

    // we don't use selectAttribute() because we don't expect the operators suggestions
    cy.clickOnPartialAttribute();
    cy.selectSuggestion('Episode', true);
    cy.suggestionsShouldBe(episodesList);

    cy.clickOnPartialAttribute();
    cy.selectSuggestion('Character', true);
    cy.suggestionsShouldBe(charactersList);

    cy.clickOnPartialAttribute();
    cy.selectSuggestion('Crew', true);
    cy.suggestionsShouldBe(crewList);

    cy.selectValue('Dan Harmon (Creator)');

    cy.filterBarShouldHaveText('Crew=Dan Harmon (Creator)');
  });
});
