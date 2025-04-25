import React from 'react';
import ManageRedeemCode from '../../../components/reward/ManageRedeemCode';
import { PrizeRedeemCodeDTO } from '@/types/Prize';

describe('<ManageRedeemCode />', () => {
  it('renders code and handles confirmation state', () => {
    const mockOnRemove = cy.stub();
    const mockPrizeRedeemCode: PrizeRedeemCodeDTO = { id: 1, code: 'TESTCODE', redeemed: false };

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
