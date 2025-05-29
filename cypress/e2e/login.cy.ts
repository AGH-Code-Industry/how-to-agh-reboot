describe('User can login successfully', () => {
  const email = Cypress.env('user_email');
  const password = Cypress.env('user_password');

  it('passes', async () => {
    // Visits main page
    cy.visit('/');

    // Closes intro overlay
    cy.get('button[data-testid="close-welcome-overlay"]', { timeout: 10000 }).click();
    // Goes to settings page
    cy.get('a[href="/settings"]', { timeout: 10000 }).click();

    // Goes to login page
    cy.get('button[data-testid="AuthButton"]', { timeout: 10000 }).contains('Zaloguj się').click();

    // Fills in login form and submits
    const emailInput = cy.get('input[name="email"]', { timeout: 10000 });
    const passwordInput = cy.get('input[name="password"]', { timeout: 10000 });
    const submitButton = cy.get('button[type="submit"]', { timeout: 10000 });
    emailInput.should('not.be.disabled', { timeout: 10000 });
    emailInput.type(email);
    passwordInput.should('not.be.disabled', { timeout: 10000 });
    passwordInput.type(password);
    submitButton.should('not.be.disabled', { timeout: 10000 });
    submitButton.click();

    // Waits for the redirection to the map page
    cy.url({ timeout: 10000 }).should('include', '/map');

    // Goes to settings page again
    cy.get('a[href="/settings"]', { timeout: 10000 }).click();

    // Checks whether the user email is displayed in the account settings
    cy.get('span', { timeout: 10000 }).contains(email).should('exist');
  });
});
