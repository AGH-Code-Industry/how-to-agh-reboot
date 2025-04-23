import React from 'react';
import EventTypeBadge from './EventTypeBadge';
import { EventTypeDTO } from '@/types/Event';

describe('<EventTypeBadge />', () => {
  const eventTypes: EventTypeDTO[] = [
    { id: 1, name: 'Conference', color: 'rgb(255, 0, 0)' },
    { id: 2, name: 'Workshop', color: 'rgb(0, 255, 0)' },
    { id: 3, name: 'Webinar', color: 'rgb(0, 0, 255)' },
  ];

  eventTypes.forEach((eventType) => {
    it(`renders correctly for event type ${eventType.name} and color ${eventType.color}`, () => {
      cy.mount(<EventTypeBadge eventType={eventType} />);
      cy.contains(eventType.name).should('exist');
      cy.getById('EventTypeBadge').should('have.css', 'background-color', eventType.color);
    });
  });
});
