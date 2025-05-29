import maplibregl from 'maplibre-gl';

declare global {
  interface Window {
    mapInstance?: maplibregl.Map;
  }
}

describe('Map has correct data', () => {
  beforeEach(() => {
    cy.visit('/map');
    cy.get('[data-testid="map-container"]', { timeout: 10000 }).should('be.visible');
    cy.wait(2000);
  });

  it('should display markers matching tRPC API data', () => {
    cy.intercept('GET', '/api/trpc/events.getEvents*').as('getEvents');
    cy.reload();

    cy.wait('@getEvents', { timeout: 1000000 }).then((interception) => {
      if (interception.response) {
        cy.wrap(interception.response.body[0].result.data.json).as('apiEvents');
      } else {
        cy.log('API response was not received');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(interception.response, 'API response should exist').to.exist;
      }
    });

    // Pobierz dane z API
    cy.get('@apiEvents').then((apiEventsWrapper) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiEvents = apiEventsWrapper as unknown as any[];
      expect(apiEvents).to.be.an('array');
      expect(apiEvents.length).to.be.greaterThan(0);

      cy.get('canvas').then(() => {
        const map = window.mapInstance;

        if (map) {
          const features = map.querySourceFeatures('events', {
            sourceLayer: undefined,
          });

          const eventFeatures = features.filter((feature) => !feature.properties.cluster);

          expect(eventFeatures.length).to.equal(apiEvents.length);

          apiEvents.forEach(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (apiEvent: { id: any; name: any; longitude: number; latidute: number }) => {
              const matchingFeature = eventFeatures.find(
                (feature) => feature.properties.id === apiEvent.id
              );

              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              expect(matchingFeature, `Event ${apiEvent.id} should have marker on map`).to.exist;

              if (matchingFeature) {
                expect(matchingFeature.properties.name).to.equal(apiEvent.name);
                expect(matchingFeature.properties.longitude).to.be.closeTo(
                  apiEvent.longitude,
                  0.0001
                );
                expect(matchingFeature.properties.latidute).to.be.closeTo(
                  apiEvent.latidute,
                  0.0001
                );
              }
            }
          );
        }
      });
    });
  });
});
