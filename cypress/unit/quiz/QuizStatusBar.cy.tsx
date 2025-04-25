import React from 'react';
import QuizStatusBar from '@/components/quiz/QuizStatusBar';

describe('<QuizStatusBar />', () => {
  it('renders', () => {
    cy.mount(<QuizStatusBar currentQuestion={0} totalQuestions={0} boolAnswers={[]} />);
  });

  it('displays as large when large prop is true', () => {
    cy.mount(<QuizStatusBar currentQuestion={0} totalQuestions={0} boolAnswers={[]} large />);
    cy.getById('quiz-status-bar').should('have.class', 'scale-x-110');
  });

  it('does not display as large when large prop is false', () => {
    cy.mount(<QuizStatusBar currentQuestion={0} totalQuestions={0} boolAnswers={[]} />);
    cy.getById('quiz-status-bar').should('not.have.class', 'scale-x-110');
  });

  it('displays the correct number of circles', () => {
    const totalQuestions = 5;
    cy.mount(
      <QuizStatusBar currentQuestion={0} totalQuestions={totalQuestions} boolAnswers={[]} />
    );
    cy.getById('quiz-status-bar').children().should('have.length', totalQuestions);
  });

  it('displays the correct color for answered questions', () => {
    const boolAnswers = [true, false, true];
    cy.mount(<QuizStatusBar currentQuestion={0} totalQuestions={5} boolAnswers={boolAnswers} />);
    cy.getById('quiz-status-bar')
      .children()
      .eq(0)
      .should('have.class', 'bg-successAlert-foreground/75');
    cy.getById('quiz-status-bar')
      .children()
      .eq(1)
      .should('have.class', 'bg-errorAlert-foreground/75');
    cy.getById('quiz-status-bar')
      .children()
      .eq(2)
      .should('have.class', 'bg-successAlert-foreground/75');
  });

  it('displays the correct color for unanswered questions', () => {
    const boolAnswers = [true, false, true];
    cy.mount(<QuizStatusBar currentQuestion={1} totalQuestions={5} boolAnswers={boolAnswers} />);
    cy.getById('quiz-status-bar').children().eq(3).should('have.class', 'bg-muted-foreground');
    cy.getById('quiz-status-bar').children().eq(4).should('have.class', 'bg-muted-foreground');
  });
});
