/* Actions */

const apiHost = Cypress.env('apiHost');

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

Cypress.Commands.add('visitWithFilters', (fixturePath) => {
  return cy
    .fixture(fixturePath)
    .then((filters) => cy.visit(`/?filters=${encodeURIComponent(JSON.stringify(filters))}`))
});

Cypress.Commands.add('clickOnSearchInput', (text) => {
  return cy
    .get('.filter-bar .suggestions input.search')
    .click();
});

Cypress.Commands.add('selectSuggestion', (text, checkForLoading = false) => {
  cy.log(`🖲️ Selecting "${text}"...`);

  if (checkForLoading) {
    cy.log(`📡 Intercepting "${apiHost}" requests...`);
    cy
      .intercept(`${apiHost}/**`)
      .as('fetchData');
  }

  cy
    .get('.filter-bar .suggestions [role="listbox"] [role="option"]')
    .contains(text)
    .click();

  if (checkForLoading) {
    cy.log('⏳ Waiting for request...');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy
      .wait('@fetchData')
      .wait(500);
  }
});

Cypress.Commands.add('selectAttribute', (text) => {
  cy.selectSuggestion(text);
  return cy.suggestionsShouldBe(['=', '!=', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL', 'IN', 'NOT IN']);
});

Cypress.Commands.add('selectOperator', (text) => {
  return cy.selectSuggestion(text, true);
});

Cypress.Commands.add('selectValue', (text) => {
  return cy.selectSuggestion(text);
});

Cypress.Commands.add('typeInSearchInput', (text) => {
  cy.log(`⌨️ Typing "${text}"...`);

  return cy
    .clickOnSearchInput()
    .type(text);
});

Cypress.Commands.add('deleteFilter', (index) => {
  cy.log(`🗑️ Deleting filter #${index}...`);

  return cy
    .get(`.filter-bar .chiclets .chiclet:nth-child(${index})`)
    .find('.icon.delete')
    .click();
});

Cypress.Commands.add('editFilterOperator', (from, to, checkForLoading=false) => {
  cy.log(`🕹️ Changing filter operator from "${from}" to "${to}"...`);

  cy
    .get('.filter-bar .chiclets .chiclet .operator')
    .contains(from)
    .click();

  return cy.selectSuggestion(to, checkForLoading);
});

Cypress.Commands.add('editFilterValue', (from, to) => {
  cy.log(`🕹️ Changing filter value from "${from}" to "${to}"...`);

  cy.log(`📡 Intercepting "${apiHost}" requests...`);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy
    .intercept(`${apiHost}/**`)
    .as('fetchData')
    .wait(500);

  cy
    .get('.filter-bar .chiclets .chiclet .value')
    .contains(from)
    .click();

  cy.log('⏳ Waiting for request...');
  cy.wait('@fetchData');

  if (to.includes('{enter}')) {
    return cy.typeInSearchInput(to);
  }

  return cy.selectSuggestion(to);
});

Cypress.Commands.add('clickOnPartialAttribute', (text) => {
  cy
    .get('.filter-bar .chiclet.partial .attribute')
    .click();

  return cy.suggestionsShouldBe(attributesList);
});

Cypress.Commands.add('clickOnPartialOperator', (text) => {
  cy
    .get('.filter-bar .chiclet.partial .operator')
    .click();

    return cy.suggestionsShouldBe(operatorsList);
});

/* Assertions */

Cypress.Commands.add('filterBarShouldHaveText', (text) => {
  return cy
    .get('.filter-bar .chiclets')
    .contains(text);
});

Cypress.Commands.add('filterBarShouldBeEmpty', (text) => {
  return cy
    .get('.filter-bar .chiclets .chiclet')
    .should('have.length', 0);
});

Cypress.Commands.add('suggestionsShouldBe', (expectedLabels) => {
  return cy
    .get('.suggestions [role="listbox"] [role="option"]')
    .then(($options) => {
      const labels = $options.map((i, $option) => $option.textContent);
      expect(labels.get()).to.deep.equal(expectedLabels);
    });
});
