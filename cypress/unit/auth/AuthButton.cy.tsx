import { AuthButton } from '@/components/auth/AuthButton';

describe('<AuthButton />', () => {
  it('renders correctly with correct text', () => {
    cy.mount(<AuthButton path="/login" text="Login" />);
    cy.getById('AuthButton').contains('Login').should('exist');
  });

  it('calls router.push with the correct path when clicked', () => {
    cy.mount(<AuthButton path="/login" text="Login" />);
    cy.getById('AuthButton').click();
    cy.get('@push').should('have.been.calledWith', '/login');
  });
});
