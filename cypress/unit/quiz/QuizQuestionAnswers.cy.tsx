import React from 'react';
import QuizQuestionAnswers from '@/components/quiz/QuizQuestionAnswers';

const props: React.ComponentProps<typeof QuizQuestionAnswers> = {
  answers: [
    { id: 1, text: 'Answer 1' },
    { id: 2, text: 'Answer 2' },
    { id: 3, text: 'Answer 3' },
    { id: 4, text: 'Answer 4' },
    { id: 5, text: 'Answer 5' },
  ],
  onSelectAnswer: (answerId: number) => {
    console.log(`Selected answer: ${answerId}`);
  },
  disabled: false,
  selectedAnswer: null,
  correctAnswerId: 1,
};

describe('<QuizQuestionAnswers />', () => {
  it('renders', () => {
    cy.mount(<QuizQuestionAnswers {...props} />);
  });

  it('shows first two answers in the first row', () => {
    cy.mount(<QuizQuestionAnswers {...props} />);
    cy.getById('quiz-answer-row1').children().should('have.length', 2);
  });

  it('shows last three answers in the second row', () => {
    cy.mount(<QuizQuestionAnswers {...props} />);
    cy.getById('quiz-answer-row2').children().should('have.length', 3);
  });

  it('calls onSelectAnswer when an answer is clicked', () => {
    const onSelectAnswerSpy = cy.spy();
    cy.mount(<QuizQuestionAnswers {...props} onSelectAnswer={onSelectAnswerSpy} />);
    cy.getById('quiz-answer-button').first().click();
    cy.wrap(onSelectAnswerSpy).should('have.been.calledWith', props.answers[0].id);
  });

  it('disables buttons when disabled prop is true', () => {
    cy.mount(<QuizQuestionAnswers {...props} disabled={true} />);
    cy.getById('quiz-answer-button').each((button) => {
      cy.wrap(button).should('be.disabled');
    });
  });
});
