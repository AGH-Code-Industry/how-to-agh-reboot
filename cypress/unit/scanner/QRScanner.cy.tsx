import QRScanner from '@/components/scanner/QRScanner';

describe('QRScanner - Camera Permissions', () => {
  it('renders message when camera permission is denied', () => {
    cy.stub(navigator.permissions, 'query').resolves({ state: 'denied', onchange: null });

    cy.mount(<QRScanner />);

    cy.contains(
      'Aby korzystać ze skanera, musisz pozwolić aplikacji na wykorzystanie kamery.'
    ).should('be.visible');
    cy.get('.QRScanner-container').should('not.exist');
  });

  it('renders scanner when camera permission is granted', () => {
    cy.stub(navigator.permissions, 'query').resolves({ state: 'granted', onchange: null });

    cy.mount(<QRScanner />);

    cy.contains('Umieść kod QR w ramce.').should('be.visible');
    cy.get('.QRScanner-container').should('exist');
  });
});
