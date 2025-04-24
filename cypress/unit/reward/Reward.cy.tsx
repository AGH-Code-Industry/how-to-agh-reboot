import React from 'react';
import Reward from '../../../components/reward/Reward';

describe('<Reward />', () => {
  const defaultProps = {
    rewardId: 1,
    title: 'Nagroda testowa',
    description: 'Opis nagrody testowej',
    completed: 5,
    required: 10,
    code: 'TESTCODE',
    redeemed: false,
  };

  it('renders with default props', () => {
    cy.mount(<Reward {...defaultProps} />);
    cy.contains(defaultProps.title).should('be.visible');
    cy.contains(defaultProps.description).should('be.visible');
    cy.contains(`${defaultProps.completed} / ${defaultProps.required}`).should('be.visible');
  });

  it('shows "Ukończono" when completed equals required', () => {
    cy.mount(<Reward {...defaultProps} completed={10} required={10} />);
    cy.contains('Ukończono').should('be.visible');
  });

  it('does not render progress bar for redeemed rewards', () => {
    cy.mount(<Reward {...defaultProps} redeemed={true} />);
    cy.getById('progress').should('not.exist');
  });

  it('renders RedeemReward component when not redeemed', () => {
    cy.mount(<Reward {...defaultProps} />);
    cy.get('div').contains('Podaj ten kod przy odbiorze upominku.').should('be.visible');
  });

  it('does not render RedeemReward component for redeemed rewards', () => {
    cy.mount(<Reward {...defaultProps} redeemed={true} />);
    cy.contains('Podaj ten kod przy odbiorze upominku.').should('not.exist');
  });
});
