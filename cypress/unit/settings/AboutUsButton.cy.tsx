import { mount } from 'cypress/react';
import AboutUsButton from '@/components/settings/AboutUsButton';

describe('AboutUsButton', () => {
  it('opens and closes About Us', () => {
    mount(<AboutUsButton />);
    cy.contains('O nas').click();
    cy.contains('AGH Code Industry').should('be.visible');
    cy.getById('close-about-us-overlay').click();
    cy.contains('AGH Code Industry').should('not.exist');
  });
});
