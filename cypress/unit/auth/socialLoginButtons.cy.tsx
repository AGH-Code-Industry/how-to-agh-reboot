import SocialLoginButtons from '@/components/auth/socialLoginButtons';
import { createClient } from '@/supabase/client';

describe('<SocialLoginButtons />', () => {
  let mockSignInWithOAuth: sinon.SinonStub;
  let mockOnError: sinon.SinonStub;

  beforeEach(() => {
    mockSignInWithOAuth = cy.stub(createClient().auth, 'signInWithOAuth').resolves({ error: null });
    mockOnError = cy.stub();
  });

  it('renders correctly', () => {
    cy.mount(<SocialLoginButtons onError={mockOnError} />);
    cy.get('button').contains('Zaloguj przez Google').should('exist');
  });

  it('calls signInWithOAuth when Google login button is clicked', async () => {
    cy.mount(<SocialLoginButtons onError={mockOnError} />);

    cy.get('button').contains('Zaloguj przez Google').click();
    cy.wrap(mockSignInWithOAuth).should('have.been.calledWith', 'google');
  });

  it('displays loading state while login is in progress', async () => {
    cy.mount(<SocialLoginButtons onError={mockOnError} />);

    cy.get('button').contains('Zaloguj przez Google').click();

    cy.get('button').contains('Zaloguj przez Google').should('have.class', 'cursor-wait');
    cy.get('button').contains('Przekierowywanie...').should('exist');
  });

  it('handles error if social login fails', async () => {
    const errorMessage = 'Something went wrong';
    mockSignInWithOAuth.rejects({ error: { message: errorMessage } });

    cy.mount(<SocialLoginButtons onError={mockOnError} />);
    cy.get('button').contains('Zaloguj przez Google').click();
    cy.wrap(mockOnError).should('have.been.calledWith', errorMessage);
  });
});
