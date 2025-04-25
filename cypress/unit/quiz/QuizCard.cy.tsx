import React from 'react';
import QuizCard from '@/components/quiz/QuizCard';

const quiz = {
  id: 0,
  name: 'Test Quiz',
  description: 'This is a test quiz.',
  questionCount: 5,
};

describe('<QuizCard />', () => {
  it('renders', () => {
    cy.mount(<QuizCard quiz={quiz} />);
  });

  it('displays quiz name', () => {
    cy.mount(<QuizCard quiz={quiz} />);
    cy.contains(quiz.name).should('be.visible');
  });

  it('displays quiz description', () => {
    cy.mount(<QuizCard quiz={quiz} />);
    cy.contains(quiz.description).should('be.visible');
  });
});
