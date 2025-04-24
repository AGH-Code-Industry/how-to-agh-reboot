import React from 'react';
import StarsRating from '../../components/events/rate/StarsRating';

const props = {
  starCount: 5,
  initialRating: 3,
};

describe('<StarsRating />', () => {
  it('renders', () => {
    cy.mount(<StarsRating {...props} />);
  });

  it('shows number of stars passed in props', () => {
    cy.mount(<StarsRating {...props} />);
    cy.getById('star').should('have.length', props.starCount);
  });

  it('shows the initial rating passed in props', () => {
    cy.mount(<StarsRating {...props} />);
    cy.getById('star').each((star, index) => {
      if (index < props.initialRating) {
        cy.wrap(star).should('have.class', 'fill-primary');
      } else {
        cy.wrap(star).should('have.class', 'fill-muted stroke-muted-foreground');
      }
    });
  });

  it('changes number of filled stars on click', () => {
    cy.mount(<StarsRating {...props} />);
    cy.getById('star').eq(4).click();
    cy.getById('star').each((star, index) => {
      if (index < 5) {
        cy.wrap(star).should('have.class', 'fill-primary');
      } else {
        cy.wrap(star).should('have.class', 'fill-muted stroke-muted-foreground');
      }
    });
  });

  it('correctly handles initialRating higher than starCount', () => {
    const newProps = { ...props, initialRating: 10 };
    cy.mount(<StarsRating {...newProps} />);
    cy.getById('star').each((star) => {
      cy.wrap(star).should('have.class', 'fill-primary');
    });
  });
});
