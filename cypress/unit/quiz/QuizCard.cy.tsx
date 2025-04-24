import React from 'react';
import QuizCard from '@/components/quiz/QuizCard';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const makeRouter = () => ({
  push: cy.stub().as('push'),
  replace: cy.stub().as('replace'),
  prefetch: cy.stub().as('prefetch'),
  back: cy.stub().as('back'),
  events: {
    on: cy.stub(),
    off: cy.stub(),
    emit: cy.stub(),
  },
  forward: cy.stub().as('forward'),
  refresh: cy.stub().as('refresh'),
});

const quiz = {
  id: 0,
  name: 'Test Quiz',
  description: 'This is a test quiz.',
  questionCount: 5,
};

const Context = (props: { children: React.ReactNode }) => (
  <AppRouterContext.Provider value={makeRouter()}>{props.children}</AppRouterContext.Provider>
);

describe('<QuizCard />', () => {
  it('renders', () => {
    cy.mount(
      <Context>
        <QuizCard quiz={quiz} />
      </Context>
    );
  });

  it('displays quiz name', () => {
    cy.mount(
      <Context>
        <QuizCard quiz={quiz} />
      </Context>
    );
    cy.contains(quiz.name).should('be.visible');
  });

  it('displays quiz description', () => {
    cy.mount(
      <Context>
        <QuizCard quiz={quiz} />
      </Context>
    );
    cy.contains(quiz.description).should('be.visible');
  });
});
