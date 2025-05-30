import { trpc } from '../support/trpc-client';
import { EventDTO } from '@/types/Event';

describe('Event details', () => {
  let event: EventDTO;

  before(() => {
    cy.wrap(
      trpc.events.getEvents.query({}).then((events) => {
        expect(events).to.have.length.greaterThan(0);
        event = events[0];
      })
    ).then(() => {
      cy.setCookie('seen_welcome', 'true');
      cy.visit(`/events/${event.id}`);
    });
  });

  beforeEach(() => {
    cy.setCookie('seen_welcome', 'true');
    cy.visit(`/events/${event.id}`);
  });

  it('should display the correct event title', () => {
    cy.getById('event-title').should('contain', event.name);
  });

  it('should display the correct event description', () => {
    cy.getById('event-description').should('contain', event.description);
  });

  it('should display the correct event location', () => {
    cy.getById('event-location').should(
      'contain',
      `${event.building.name}, ${event.building.room}, ${event.building.floor}`
    );
  });

  it('should display the correct fields of study', () => {
    cy.getById('event-field-of-study')
      .children()
      .should('have.length', event.fieldOfStudy.length)
      .each((element, index) => {
        expect(element.text().trim()).to.equal(event.fieldOfStudy[index].name);
      });
  });

  it('should display the correct event type', () => {
    cy.getById('EventTypeBadge').should('contain', event.eventType.name);
  });

  it('should display the correct occurrences', () => {
    cy.getById('event-occurrences')
      .children()
      .should('have.length', event.occurrences.length)
      .each((element, index) => {
        const occurrence = event.occurrences[index];
        const startTime = new Date(occurrence.start).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const endTime = new Date(occurrence.end).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedTime = `${startTime} - ${endTime}`;
        cy.wrap(element).should('contain', formattedTime);
      });
  });

  it('should match tRPC endpoint data exactly', () => {
    // Get fresh data from tRPC endpoint for the specific event
    cy.wrap(trpc.events.getEvents.query({ eventId: event.id })).then((events) => {
      const typedEvents = events as EventDTO[];
      const eventData = typedEvents[0];
      cy.wrap(eventData).should('exist');

      // Verify event title matches exactly
      cy.getById('event-title').invoke('text').should('equal', eventData.name);

      // Verify event description matches exactly
      cy.getById('event-description').invoke('text').should('equal', eventData.description);

      // Verify event location matches exactly
      cy.getById('event-location')
        .invoke('text')
        .should(
          'equal',
          `${eventData.building.name}, ${eventData.building.room}, ${eventData.building.floor}`
        );

      // Verify fields of study match exactly
      cy.getById('event-field-of-study')
        .children()
        .should('have.length', eventData.fieldOfStudy.length)
        .each((element, index) => {
          cy.wrap(element).invoke('text').should('equal', eventData.fieldOfStudy[index].name);
        });

      // Verify event type matches exactly
      cy.getById('EventTypeBadge').invoke('text').should('equal', eventData.eventType.name);

      // Verify occurrences match exactly
      cy.getById('event-occurrences')
        .children()
        .should('have.length', eventData.occurrences.length)
        .each((element, index) => {
          const occurrence = eventData.occurrences[index];
          const startTime = new Date(occurrence.start).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const endTime = new Date(occurrence.end).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const formattedTime = `${startTime} - ${endTime}`;
          cy.wrap(element).invoke('text').should('equal', formattedTime);
        });
    });
  });
});
