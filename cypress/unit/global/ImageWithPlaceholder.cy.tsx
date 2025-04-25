import React from 'react';
import ImageWithPlaceholder from '../../../components/global/ImageWithPlaceholder';

describe('<ImageWithPlaceholder />', () => {
  it('renders', () => {
    cy.fixture('camp.png').then((src) => {
      cy.mount(
        <ImageWithPlaceholder
          src={`data:image/png;base64,${src}`}
          alt={'test'}
          width={100}
          height={100}
        />
      );
    });
  });

  it('has correct size', () => {
    cy.fixture('camp.png').then((src) => {
      cy.mount(
        <ImageWithPlaceholder
          src={`data:image/png;base64,${src}`}
          alt={'test'}
          width={100}
          height={100}
        />
      );
    });

    cy.getById('image').should('have.css', 'width', '100px');
    cy.getById('image').should('have.css', 'height', '100px');
  });

  it('has correct border', () => {
    cy.fixture('camp.png').then((src) => {
      cy.mount(
        <ImageWithPlaceholder
          src={`data:image/png;base64,${src}`}
          alt={'test'}
          width={100}
          height={100}
          border={'1px solid rgb(255, 0, 0)'}
        />
      );
    });

    cy.getById('image').should('have.css', 'border', '1px solid rgb(255, 0, 0)');
  });

  it('applies provided className', () => {
    cy.fixture('camp.png').then((src) => {
      cy.mount(
        <ImageWithPlaceholder
          src={`data:image/png;base64,${src}`}
          alt={'test'}
          width={100}
          height={100}
          className="custom-class"
        />
      );
    });

    cy.getById('image').should('have.class', 'custom-class');
  });
});
