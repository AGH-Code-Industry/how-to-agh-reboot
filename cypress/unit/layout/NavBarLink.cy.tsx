import NavBarLink from '@/components/layout/NavBarLink';

const Icon = () => <span data-testid="icon">Icon</span>;

describe('NavBarLink', () => {
  it('should render the link with correct text and icon', () => {
    cy.mount(
      <NavBarLink text="Test Link" url="/test">
        <Icon />
      </NavBarLink>
    );

    cy.contains('Test Link').should('be.visible');
    cy.getById('icon').should('be.visible');
  });

  it('should apply inactive styles when the link is not active', () => {
    cy.mount(
      <NavBarLink text="Inactive Link" url="/inactive">
        <Icon />
      </NavBarLink>
    );

    cy.get('a').should('have.class', 'text-muted-foreground');
  });

  // Working router push needed
  // it('should apply active styles when the link is active', () => {
  //   cy.mount(
  //     <NavBarLink text="Active Link" url="/active">
  //       <Icon />
  //     </NavBarLink>
  //   );
  //
  //   cy.get('a').should('have.class', 'text-foreground');
  // });
  //
  // it('should navigate to the correct URL on click', () => {
  //   cy.mount(
  //     <NavBarLink text="Test Link" url="/test">
  //       <Icon />
  //     </NavBarLink>
  //   );
  //
  //   cy.contains('Test Link').click();
  //   cy.get('@push').should('have.been.calledWith', '/test');
  // });
});
