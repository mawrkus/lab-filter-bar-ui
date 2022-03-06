/* Actions */

const apiHost = Cypress.env("apiHost");

export const attributesList = ["Season", "Episode", "Character", "Crew"];

export const operatorsList = [
  "=",
  "!=",
  "LIKE",
  "NOT LIKE",
  "IS NULL",
  "IS NOT NULL",
  "IN",
  "NOT IN",
];

export const logicalOperatorsList = ["AND", "OR"];

Cypress.Commands.add("visitWithFilters", (fixturePath) => {
  return cy
    .fixture(fixturePath)
    .then((filters) =>
      cy.visit(`/?filters=${encodeURIComponent(JSON.stringify(filters))}`)
    );
});

Cypress.Commands.add("clickOnSearchInput", () => {
  return cy.get(".filter-bar .suggestions input.search").click();
});

Cypress.Commands.add("typeInSearchInput", (text) => {
  return cy.get(".filter-bar .suggestions input.search").type(text);
});

Cypress.Commands.add("selectSuggestion", (label, checkForLoading = false) => {
  cy.log(`🖲️ Selecting label "${label}"`);

  if (checkForLoading) {
    cy.log(`📡 Intercepting "${apiHost}" requests`);
    cy.intercept(`${apiHost}/**`).as("fetchData");
  }

  cy.get('.filter-bar .suggestions [role="listbox"] [role="option"]')
    .contains(label)
    .click();

  if (checkForLoading) {
    cy.log("⏳ Waiting for request...");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait("@fetchData").wait(500);
  }
});

Cypress.Commands.add("selectMultipleSuggestions", (suggestionLabels) => {
  cy.log(
    `🖲️ Selecting ${suggestionLabels.lenght} labels: "${suggestionLabels.join(
      ", "
    )}"`
  );

  cy.get('.filter-bar .suggestions [role="listbox"] [role="option"]')
    .find(suggestionLabels.map((label) => `:contains("${label}")`).join(", "))
    .each(($el) => cy.wrap($el).click());

  cy.get("body").click();
});

Cypress.Commands.add("selectAttribute", (label) => {
  cy.selectSuggestion(label);
  cy.suggestionsShouldBe(operatorsList);
});

Cypress.Commands.add("selectOperator", (label) => {
  return cy.selectSuggestion(label, true);
});

Cypress.Commands.add("selectLogicalOperator", (label) => {
  cy.selectSuggestion(label);
  cy.suggestionsShouldBe(attributesList);
});

Cypress.Commands.add("selectValue", (label) => {
  return cy.selectSuggestion(label);
});

Cypress.Commands.add("deleteFilter", (index, checkForLoading = false) => {
  cy.log(`🗑️ Deleting filter #${index}`);

  if (checkForLoading) {
    cy.log(`📡 Intercepting "${apiHost}" requests`);
    cy.intercept(`${apiHost}/**`).as("fetchData");
  }

  cy.get(`.filter-bar .chiclets .chiclet:nth-child(${index})`)
    .find(".icon.delete")
    .click();

  if (checkForLoading) {
    cy.log("⏳ Waiting for request...");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait("@fetchData").wait(500);
  }
});

Cypress.Commands.add(
  "editFilterOperator",
  (from, to, checkForLoading = false) => {
    cy.log(`🕹️ Changing operator from "${from}" to "${to}"`);

    cy.get(".filter-bar .chiclets .chiclet .operator").contains(from).click();

    cy.suggestionsShouldBe(operatorsList);

    return cy.selectSuggestion(to, checkForLoading);
  }
);

Cypress.Commands.add("editLogicalFilterOperator", (from, to) => {
  cy.log(`🕹️ Changing logical operator from "${from}" to "${to}"`);

  cy.get(".filter-bar .chiclets .chiclet .operator").contains(from).click();

  cy.suggestionsShouldBe(logicalOperatorsList);

  return cy.selectSuggestion(to);
});

Cypress.Commands.add("editFilterValue", (from, to) => {
  cy.log(`🕹️ Changing value from "${from}" to "${to}"`);

  cy.log(`📡 Intercepting "${apiHost}" requests`);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.intercept(`${apiHost}/**`).as("fetchData").wait(500);

  cy.get(".filter-bar .chiclets .chiclet .value").contains(from).click();

  cy.log("⏳ Waiting for request...");
  cy.wait("@fetchData");

  if (to.includes("{enter}")) {
    return cy.typeInSearchInput(to);
  }

  return cy.selectSuggestion(to);
});

Cypress.Commands.add("clickOnPartialAttribute", () => {
  cy.get(".filter-bar .chiclet.partial .attribute").click();
  cy.suggestionsShouldBe(attributesList);
});

Cypress.Commands.add("clickOnPartialOperator", () => {
  cy.get(".filter-bar .chiclet.partial .operator").click();
  cy.suggestionsShouldBe(operatorsList);
});

/* Assertions */

Cypress.Commands.add("filterBarShouldHaveText", (expectedText) => {
  cy.log(`🔍 The filter bar text should be "${expectedText}"`);
  return cy.get(".filter-bar .chiclets").contains(expectedText);
});

Cypress.Commands.add("filterBarShouldBeEmpty", () => {
  cy.log("🔍 The filter bar should be empty");
  return cy.get(".filter-bar .chiclets .chiclet").should("have.length", 0);
});

Cypress.Commands.add("suggestionsShouldBe", (expectedLabels) => {
  cy.log(
    `🔍 The suggestions should have the expected labels (${expectedLabels.length})`
  );

  return cy
    .get('.suggestions [role="listbox"] [role="option"]')
    .then(($options) => {
      const labels = $options.map((i, $option) => $option.textContent);
      expect(labels.get()).to.deep.equal(expectedLabels);
    });
});

Cypress.Commands.add("suggestionsShouldBeHidden", () => {
  cy.log("🔍 The suggestions should be hidden");

  return cy
    .get('.suggestions [role="listbox"] [role="option"]')
    .should("not.exist");
});

Cypress.Commands.add("chicletShouldValue", (expectedValue) => {
  cy.log(`🔍 The chiclet should have value "${expectedValue}"`);

  return cy
    .get(".filter-bar .chiclets .chiclet .value")
    .contains(expectedValue);
});
