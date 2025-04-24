import React from 'react';
import EventVisitedStatus from '../../components/events/EventVisitedStatus';

describe('<EventVisitedStatus />', () => {
  it('renders', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
  });

  it('shows the message indicating thet the event has been visited', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
    cy.get('[data-testid="visit-status"]').should('exist');
    cy.get('[data-testid="visit-status"]').should('be.visible');
  });

  it('does not show the message indicating thet the event has been visited, if the event is not visited', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={false} />);
    cy.get('[data-testid="visit-status"]').should('not.exist');
  });

  it('shows the message about QR code if the event was not visited and is not ended', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={false} />);
    cy.get('[data-testid="qr-message"]').should('exist');
    cy.get('[data-testid="qr-message"]').should('be.visible');
  });

  it('does not show the message about QR code if the event was visited and not ended', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
    cy.get('[data-testid="qr-message"]').should('not.exist');
  });

  it('does not show the message about QR code if the event was visited and ended', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={true} />);
    cy.get('[data-testid="qr-message"]').should('not.exist');
  });

  it('does not show the message about QR code if the event is not visited and ended', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={true} />);
    cy.get('[data-testid="qr-message"]').should('not.exist');
  });
});
