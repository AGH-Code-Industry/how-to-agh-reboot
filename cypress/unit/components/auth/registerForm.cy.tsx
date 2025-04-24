import RegisterForm from '@/components/auth/RegisterForm';
import { createClient } from '@/supabase/client';

describe('<RegisterForm />', () => {
  beforeEach(() => {
    cy.stub(createClient(), 'auth').get(() => ({
      updateUser: cy
        .stub()
        .resolves({ data: { user: { email: 'valid@example.com' } }, error: null }),
      getSession: cy
        .stub()
        .resolves({ data: { session: { user: { email: 'valid@example.com' } } } }),
    }));
  });

  it('renders the registration form correctly', () => {
    cy.mount(<RegisterForm />);
    cy.get('button[type="submit"]').contains('Zarejestruj się').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
  });

  it('shows an error message when registration fails', async () => {
    const errorMessage = 'Email is already in use';

    cy.stub(createClient(), 'auth').get(() => ({
      updateUser: cy.stub().resolves({ data: null, error: { message: errorMessage } }),
    }));

    cy.mount(<RegisterForm />);
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.contains(errorMessage).should('exist');
  });

  it('redirects to home on successful registration', async () => {
    cy.stub(createClient(), 'auth').get(() => ({
      updateUser: cy
        .stub()
        .resolves({ data: { user: { email: 'valid@example.com' } }, error: null }),
    }));

    cy.mount(<RegisterForm />);
    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('input[name="password"]').type('validpassword');
    cy.get('input[name="confirmPassword"]').type('validpassword');
    cy.get('button[type="submit"]').click();

    cy.get('@push').should('have.been.calledWith', '/');
  });

  it('disables the submit button when form is loading', async () => {
    cy.stub(createClient(), 'auth').get(() => ({
      updateUser: cy
        .stub()
        .resolves({ data: { user: { email: 'valid@example.com' } }, error: null }),
    }));

    cy.mount(<RegisterForm />);

    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('input[name="password"]').type('validpassword');
    cy.get('input[name="confirmPassword"]').type('validpassword');

    cy.get('button[type="submit"]').click();

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('validates email, password, and confirm password fields', async () => {
    cy.mount(<RegisterForm />);

    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('exist');
    cy.contains('Password is required').should('exist');
    cy.contains('Confirm password is required').should('exist');

    cy.get('input[name="email"]').type('invalidemail');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email format').should('exist');

    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password456');
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords must match').should('exist');
  });
});
