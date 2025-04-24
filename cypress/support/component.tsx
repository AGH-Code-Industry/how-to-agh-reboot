import '@/app/globals.scss'; // Import stylów globalnych (Tailwind)
import './commands'; // Importuje dodatkowe komendy z commands.ts
import { mount } from 'cypress/react';
import { TRPCProvider } from '@/trpc/client';
import { ReactNode } from 'react';
import { stubTRPC } from './trpc-stub';
import { AppRouter } from '@/trpc/router';
import { AppRouterMock } from './app-router-mock';

function withTrpcProvider(children: ReactNode) {
  return <TRPCProvider>{children}</TRPCProvider>;
}

// Nadpisanie `cy.mount` dla testów komponentowych
Cypress.Commands.add('mount', (component, options?) => {
  const wrapped = withTrpcProvider(<AppRouterMock>{component}</AppRouterMock>);
  return mount(wrapped, options);
});

const trpcStub = stubTRPC<AppRouter>();
cy.api = trpcStub;

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      api: typeof trpcStub;
    }
  }
}
