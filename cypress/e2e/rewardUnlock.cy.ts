import { trpc } from '../support/trpc-client';
import Cookies from 'js-cookie';

describe('Reward Unlock', () => {
  beforeEach(() => {
    Cookies.set('seen_welcome', 'true', { expires: 365 });
  });

  it('should unlock a reward', () => {
    cy.visit('/');

    cy.get('a[href="/prizes"]', { timeout: 10000 }).click();

    cy.get('div').contains('0 / 2', { timeout: 10000 }).should('exist');
    cy.task('seedDbWithQrCodes').then(async (qrCodes) => {
      await trpc.qr.submitQr.mutate((qrCodes as string[])[0]);

      cy.reload()
        .then(() => {
          cy.get('div').contains('1 / 2', { timeout: 10000 }).should('exist');

          return trpc.qr.submitQr.mutate((qrCodes as string[])[1]);
        })
        .then(() => {
          return cy.reload();
        })
        .then(() => {
          cy.get('div').contains('Ukończono', { timeout: 10000 }).should('exist');
        });
    });
  });
});
