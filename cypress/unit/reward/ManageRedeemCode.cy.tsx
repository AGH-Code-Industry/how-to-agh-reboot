import React from 'react';
import ManageRedeemCode from '../../../components/reward/ManageRedeemCode';

describe('<ManageRedeemCode />', () => {
  it('renders code and handles confirmation state', () => {
    const mockOnRemove = cy.stub();
    const mockPrizeRedeemCode = { id: '1', code: 'TESTCODE' };

    cy.mount(
      <ManageRedeemCode
        prizeRedeemCode={mockPrizeRedeemCode}
        className="test-class"
        onRemove={mockOnRemove}
      />
    );

    cy.contains('TESTCODE').should('be.visible');
    cy.contains('button', 'Zużyj kod').click();
    cy.contains('button', 'Na pewno?').should('be.visible');
  });
});
