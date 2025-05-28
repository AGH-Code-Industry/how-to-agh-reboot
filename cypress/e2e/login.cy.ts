describe('User can login successfully', () => {
  const email = Cypress.env('user_email');
  const password = Cypress.env('user_password');

  it('passes', async () => {
    // Visits main page
    cy.visit('/');

    // Closes intro overlay
    cy.get('button[data-testid="close-welcome-overlay"]').click();
    // Goes to settings page
    cy.get('a[href="/settings"]', { timeout: 10000 }).click();

    // Goes to login page
    cy.get('button[data-testid="AuthButton"]').contains('Zaloguj się').click();

    // Fills in login form and submits
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Waits for the redirection to the map page
    cy.url({ timeout: 10000 }).should('include', '/map');

    // Goes to settings page again
    cy.get('a[href="/settings"]').click();

    // Checks whether the user email is displayed in the account settings
    cy.get('span').contains(email).should('exist');
  });
});
