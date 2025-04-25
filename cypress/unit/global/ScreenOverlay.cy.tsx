import React from 'react';
import ScreenOverlay from '../../../components/global/ScreenOverlay';

describe('<ScreenOverlay />', () => {
  it('renders', () => {
    cy.mount(
      <ScreenOverlay>
        <div>Test</div>
      </ScreenOverlay>
    );
  });

  it('renders children', () => {
    cy.mount(
      <ScreenOverlay>
        <div data-testid="child">Test</div>
      </ScreenOverlay>
    );

    cy.getById('child').should('exist');
  });

  it('applies passed className', () => {
    cy.mount(
      <ScreenOverlay className="custom-class">
        <div>Test</div>
      </ScreenOverlay>
    );

    cy.getById('screen-overlay').should('have.class', 'custom-class');
  });
});
