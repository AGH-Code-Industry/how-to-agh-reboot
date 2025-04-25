import LoginForm from '@/components/auth/loginForm';
import { createClient } from '@/supabase/client';

describe('<LoginForm />', () => {
  it('renders the login form correctly', () => {
    const errorMessage = 'An error occurred'; // Define the error message
    cy.stub(createClient(), 'auth').get(() => ({
      signInWithPassword: cy.stub().resolves({ error: { message: errorMessage } }),
    }));

    cy.mount(<LoginForm />);

    cy.get('button[type="submit"]').contains('Zaloguj się').should('exist');
  });

  it('shows an error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';

    // Mockowanie nieudanej próby logowania
    cy.stub(createClient(), 'auth').get(() => ({
      signInWithPassword: cy.stub().resolves({ error: { message: errorMessage } }),
    }));

    cy.mount(<LoginForm />);
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.getById('AuthButton').click();

    // Sprawdzamy, czy komunikat o błędzie został wyświetlony
    cy.contains(errorMessage).should('exist');
  });

  it('redirects to home on successful login', async () => {
    const mockPush = cy.stub();

    // Mockowanie createClient, zwracamy klienta z zamockowaną metodą signInWithPassword

    // Mockowanie udanego logowania
    cy.stub(createClient(), 'auth').get(() => ({
      signInWithPassword: cy.stub().resolves({ error: null }),
    }));

    cy.mount(<LoginForm />);
    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('input[name="password"]').type('validpassword');
    cy.getById('AuthButton').click();

    // Sprawdzamy, czy metoda router.push została wywołana
    cy.wrap(mockPush).should('have.been.calledWith', '/');
  });

  it('disables the submit button when form is loading', async () => {
    // Mockowanie procesu logowania z oczekiwaniem na wynik
    cy.stub(createClient(), 'auth').get(() => ({
      signInWithPassword: cy.stub().resolves({ error: null }),
    }));

    cy.mount(<LoginForm />);
    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('input[name="password"]').type('validpassword');

    // Sprawdzamy, czy przycisk logowania jest wyłączony podczas ładowania
    cy.getById('AuthButton').click();
    cy.getById('AuthButton').should('be.disabled');
  });

  it('validates email and password fields', async () => {
    cy.mount(<LoginForm />);

    // Wysłanie pustego formularza
    cy.getById('AuthButton').click();
    cy.contains('Email is required').should('exist');
    cy.contains('Password is required').should('exist');

    // Wpisanie niepoprawnego emaila
    cy.get('input[name="email"]').type('invalidemail');
    cy.getById('AuthButton').click();
    cy.contains('Invalid email format').should('exist');
  });
});
