import React from 'react';
import RedeemReward from '@/components/reward/RedeemReward';

describe('<RedeemReward /> interactions', () => {
  const defaultProps = {
    code: undefined,
    redeemed: false,
    completed: 5,
    required: 10,
    rewardId: 1,
  };

  beforeEach(() => {
    cy.api.prizes.createRedeemCode.returnsPartial({ code: 'MOCKCODE' });
  });

  it('calls createRedeemCode when completed meets required', () => {
    const props = { ...defaultProps, completed: 10 };
    cy.mount(<RedeemReward {...props} />);
    cy.api.prizes.createRedeemCode.wait().should('exist');
  });

  it('renders the redeem code after mutation', () => {
    const props = { ...defaultProps, completed: 10 };
    cy.mount(<RedeemReward {...props} />);
    cy.contains('MOCKCODE').should('be.visible');
    cy.contains('Podaj ten kod przy odbiorze upominku.').should('be.visible');
  });

  it('renders redeemed message when redeemed is true', () => {
    const props = { ...defaultProps, code: 'MOCKCODE', redeemed: true };
    cy.mount(<RedeemReward {...props} />);
    cy.contains('Upominek odebrany.').should('be.visible');
  });
});
