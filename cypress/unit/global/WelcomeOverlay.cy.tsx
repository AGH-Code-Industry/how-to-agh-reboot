import React from 'react';
import WelcomeOverlay from '../../../components/global/WelcomeOverlay';

describe('<WelcomeOverlay />', () => {
  it('renders', () => {
    cy.mount(<WelcomeOverlay mode={'automatic'} />);
  });

  it('closes when close button is clicked', () => {
    cy.mount(<WelcomeOverlay mode={'automatic'} />);
    cy.getById('close-welcome-overlay').click();
    cy.getById('screen-overlay').should('not.exist');
  });

  it('is hidden when mode is automatic and cookie is set', () => {
    cy.setCookie('seen_welcome', 'true');
    cy.mount(<WelcomeOverlay mode={'automatic'} />);
    cy.getById('screen-overlay').should('not.exist');
  });

  it('is visible when mode is automatic and cookie is not set', () => {
    cy.clearCookie('seen_welcome');
    cy.mount(<WelcomeOverlay mode={'automatic'} />);
    cy.getById('screen-overlay').should('exist');
  });

  it('is visible when mode is force-open', () => {
    cy.mount(<WelcomeOverlay mode={'force-open'} forceOpen={true} />);
    cy.getById('screen-overlay').should('exist');
  });
});
