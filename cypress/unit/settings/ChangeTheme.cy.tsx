import { ThemeResetButton, ThemeToggleButton } from '@/app/settings/ChangeTheme';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

describe('ChangeTheme', () => {
  it('changes theme from the system default', () => {
    cy.mountWithTheme(<ThemeToggleButton />, {});
    cy.wait(500);

    cy.get('html').then(($html) => {
      const currentTheme = $html.hasClass('dark') ? 'dark' : 'light';
      const expectedTheme = currentTheme === 'light' ? 'dark' : 'light';

      cy.contains('Motyw').click();

      cy.get('html', { timeout: 5000 }).should(($htmlAfter) => {
        const newTheme = $htmlAfter.hasClass('dark') ? 'dark' : 'light';
        expect(newTheme).to.equal(expectedTheme);
      });
    });
  });

  it('resets theme to the system default', () => {
    cy.mountWithTheme(<ThemeResetButton />, {});

    cy.contains('Zresetuj motyw do domyślnego systemowego').click();

    cy.get('html').then(($html) => {
      if (getSystemTheme() === 'dark') {
        cy.wrap($html).should('have.class', 'dark');
      } else {
        cy.wrap($html).should('have.class', 'light');
      }
    });
  });
});
