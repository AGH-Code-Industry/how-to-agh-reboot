import React from 'react';
import EventOccurrence from '../../../components/events/EventOccurrence';

const props = {
  eventId: 1,
  eventName: 'Sample Event',
  eventLocation: 'Sample Location',
  occurrence: {
    id: 1,
    start: new Date(1745439271400),
    end: new Date(1748439271400),
  },
};

describe('<EventOccurrence />', () => {
  it('renders', () => {
    cy.mount(<EventOccurrence {...props} />);
  });

  it('enables notification button when more than 15 minutes before the event', () => {
    cy.clock(props.occurrence.start.getTime() - 16 * 60 * 1000);
    cy.mount(<EventOccurrence {...props} />);
    cy.getById('notification-button').should('not.be.disabled');
  });

  it('disables notification button 15 minutes before the event', () => {
    cy.clock(props.occurrence.start.getTime() - 15 * 60 * 1000);
    cy.mount(<EventOccurrence {...props} />);
    cy.getById('notification-button').should('be.disabled');
  });

  it('shows event start time', () => {
    cy.mount(<EventOccurrence {...props} />);
    cy.getById('event-occurrence').should(
      'contain',
      props.occurrence.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  });

  it('shows event end time', () => {
    cy.mount(<EventOccurrence {...props} />);
    cy.getById('event-occurrence').should(
      'contain',
      props.occurrence.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  });
});
