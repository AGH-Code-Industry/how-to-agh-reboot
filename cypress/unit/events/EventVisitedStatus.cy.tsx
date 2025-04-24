import React from 'react';
import EventVisitedStatus from '../../../components/events/EventVisitedStatus';

describe('<EventVisitedStatus />', () => {
  it('renders', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
  });

  it('shows the message indicating thet the event has been visited', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
    cy.getById('visit-status').should('exist');
    cy.getById('visit-status').should('be.visible');
  });

  it('does not show the message indicating thet the event has been visited, if the event is not visited', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={false} />);
    cy.getById('visit-status').should('not.exist');
  });

  it('shows the message about QR code if the event was not visited and is not ended', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={false} />);
    cy.getById('qr-message').should('exist');
    cy.getById('qr-message').should('be.visible');
  });

  it('does not show the message about QR code if the event was visited and not ended', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={false} />);
    cy.getById('qr-message').should('not.exist');
  });

  it('does not show the message about QR code if the event was visited and ended', () => {
    cy.mount(<EventVisitedStatus visited={true} ended={true} />);
    cy.getById('qr-message').should('not.exist');
  });

  it('does not show the message about QR code if the event is not visited and ended', () => {
    cy.mount(<EventVisitedStatus visited={false} ended={true} />);
    cy.getById('qr-message').should('not.exist');
  });
});
