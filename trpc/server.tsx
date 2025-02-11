import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { makeQueryClient } from './query-client';
import { createCallerFactory, createTRPCContext } from './init';
import { AppRouter, appRouter } from './router';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);

export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
