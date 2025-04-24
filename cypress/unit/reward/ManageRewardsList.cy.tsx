import React from 'react';
import ManageRewardList from '../../../components/reward/ManageRewardsList';

describe('<ManageRewardList />', () => {
  it('renders a message when no codes are available', () => {
    cy.api.prizes.getRedeemCodes.returnsPartial([]);

    cy.mount(<ManageRewardList />);

    cy.contains('Brak kodów do odbioru upominków.').should('be.visible');
  });

  it('renders a list of redeem codes', () => {
    const mockData: PrizeRedeemCodeDTO[] = [
      { id: 1, code: 'CODE1', redeemed: false },
      { id: 2, code: 'CODE2', redeemed: false },
      { id: 3, code: 'CODE3', redeemed: false },
    ];

    cy.api.prizes.getRedeemCodes.returnsPartial(mockData);

    cy.mount(<ManageRewardList />);

    cy.contains('CODE1').should('be.visible');
    cy.contains('CODE2').should('be.visible');
    cy.contains('CODE3').should('be.visible');
  });
});
