import React from 'react';
import FieldOfStudyBadge from '../../../components/events/FieldOfStudyBadge';

const fieldOfStudy = {
  id: 0,
  name: 'Informatyka',
  faculty: {
    id: 0,
    name: 'Wydział Informatyki',
  },
};

describe('<FieldOfStudyBadge />', () => {
  it('renders', () => {
    cy.mount(<FieldOfStudyBadge fieldOfStudy={fieldOfStudy} />);
  });

  it('displays the name of the field of study', () => {
    cy.mount(<FieldOfStudyBadge fieldOfStudy={fieldOfStudy} />);
    cy.getById('field-of-study-badge').should('contain', fieldOfStudy.name);
  });

  it('displays tooltip with faculty name on click', () => {
    cy.mount(<FieldOfStudyBadge fieldOfStudy={fieldOfStudy} />);
    cy.getById('field-of-study-badge').click();
    cy.getById('tooltip-content').should('contain', fieldOfStudy.faculty.name);
  });

  it('does not display tooltip when badge was not clicked', () => {
    cy.mount(<FieldOfStudyBadge fieldOfStudy={fieldOfStudy} />);
    cy.getById('tooltip-content').should('not.exist');
  });
});
