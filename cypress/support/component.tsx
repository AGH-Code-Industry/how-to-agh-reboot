import '@/app/globals.scss'; // Import stylów globalnych (Tailwind)
import './commands'; // Importuje dodatkowe komendy z commands.ts
import { mount } from 'cypress/react';
import { TRPCProvider } from '@/trpc/client';
import { ReactNode } from 'react';
import { stubTRPC } from './trpc-stub';
import { AppRouter } from '@/trpc/router';
import { ThemeProvider } from '@/components/theme-provider';
import { AppRouterMock } from './app-router-mock';

function withTrpcProvider(children: ReactNode) {
  return <TRPCProvider>{children}</TRPCProvider>;
}

function withThemeProvider(children: ReactNode) {
  return withTrpcProvider(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

Cypress.Commands.add('mount', (component, options) => {
  const wrapped = withTrpcProvider(<AppRouterMock>{component}</AppRouterMock>);
  return mount(wrapped, options);
});

Cypress.Commands.add('mountWithTheme', (component, options) => {
  const wrapped = withThemeProvider(component);
  return mount(wrapped, options);
});

const trpcStub = stubTRPC<AppRouter>();
cy.api = trpcStub;

// Augmentacja Cypress namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountWithTheme: typeof mount;
      api: typeof trpcStub;
    }
  }
}
