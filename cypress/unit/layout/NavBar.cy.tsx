import NavBar from '@/components/layout/NavBar';

describe('<NavBar />', () => {
  it('should render all navigation links with correct text and icons', () => {
    cy.mount(<NavBar />);

    const links = [
      { text: 'Mapa', url: '/map' },
      { text: 'Wydarzenia', url: '/events' },
      { text: 'Skaner', url: '/scanner' },
      { text: 'Upominki', url: '/prizes' },
      { text: 'Ustawienia', url: '/settings' },
    ];

    links.forEach(({ text }) => {
      cy.contains(text).should('be.visible');
    });
  });
});
