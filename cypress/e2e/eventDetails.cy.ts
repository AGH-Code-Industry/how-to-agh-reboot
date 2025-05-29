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
        const startTime = new Date(occurrence.start).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const endTime = new Date(occurrence.end).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const formattedTime = `${startTime} - ${endTime}`;
        cy.wrap(element).should('contain', formattedTime);
      });
  });
});
