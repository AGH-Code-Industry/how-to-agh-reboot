import React from 'react';
import { QuizQuestionAnswer } from '@/components/quiz/QuizQuestionAnswers';

const props: React.ComponentProps<typeof QuizQuestionAnswer> = {
  answer: {
    id: 0,
    text: 'Test answer',
  },
  variant: 'default',
  onSelectAnswer: (answerId: number) => {
    console.log(`Selected answer: ${answerId}`);
  },
  disabled: false,
};

describe('<QuizQuestionAnswer />', () => {
  it('renders', () => {
    cy.mount(<QuizQuestionAnswer {...props} />);
  });

  it('displays answer text', () => {
    cy.mount(<QuizQuestionAnswer {...props} />);
    cy.contains(props.answer.text).should('be.visible');
  });

  it('calls onSelectAnswer when clicked', () => {
    const onSelectAnswerSpy = cy.spy();
    cy.mount(<QuizQuestionAnswer {...props} onSelectAnswer={onSelectAnswerSpy} />);
    cy.getById('quiz-answer-button').click();
    cy.wrap(onSelectAnswerSpy).should('have.been.calledWith', props.answer.id);
  });

  it('is disabled when disabled prop is true', () => {
    cy.mount(<QuizQuestionAnswer {...props} disabled={true} />);
    cy.getById('quiz-answer-button').should('be.disabled');
  });

  it('is not disabled when disabled prop is false', () => {
    cy.mount(<QuizQuestionAnswer {...props} disabled={false} />);
    cy.getById('quiz-answer-button').should('not.be.disabled');
  });
});
