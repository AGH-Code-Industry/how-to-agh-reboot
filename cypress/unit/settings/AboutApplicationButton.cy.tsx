import { mount } from 'cypress/react';
import AboutApplicationButton from '@/components/settings/AboutApplicationButton';

describe('AboutApplicationButton', () => {
  it('opens and closes WelcomeOverlay', () => {
    mount(<AboutApplicationButton />);
    cy.contains('O aplikacji').click();
    cy.contains('Witaj w HowToAGH!').should('be.visible');
    cy.getById('close-welcome-overlay').click();
    cy.contains('Witaj w HowToAGH!').should('not.exist');
  });
});
