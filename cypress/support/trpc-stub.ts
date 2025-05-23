// https://github.com/dosu-ai/trpc-cypress
import {
  AnyProcedure,
  AnyRootTypes,
  AnyRouter,
  CombinedDataTransformer,
  createFlatProxy,
  createRecursiveProxy,
  defaultTransformer,
  inferProcedureOutput,
  RouterRecord,
} from '@trpc/server/unstable-core-do-not-import';
// since this is only used in the test environment, it should be safe to import these
// it may make upgrading in the future harder, but it's only one location you have to update
import { PartialDeep } from 'type-fest';

type CypressTRPCMock<$Value extends AnyProcedure> = {
  // saving as comments incase they're useful
  // input: inferProcedureInput<$Value>;
  // output: inferTransformedProcedureOutput<TRoot, $Value>;
  // transformer: TRoot['transformer'];
  // errorShape: TRoot['errorShape'];
  returns: (value: inferProcedureOutput<$Value>) => Cypress.Chainable<null>;
  // helpful utility if you don't want to mock the full response, can be deleted if not needed
  returnsPartial: (value: PartialDeep<inferProcedureOutput<$Value>>) => Cypress.Chainable<null>;
  intercept: (
    transformValue?: (value: inferProcedureOutput<$Value>) => unknown
  ) => Cypress.Chainable<null>;
  wait: (options?: Parameters<typeof cy.wait>[1]) => Cypress.Chainable<null>;
  path: string;
  // add any more cypress methods or other methods here
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TRPCMockStub = keyof CypressTRPCMock<any>;

type DecorateRouterRecord<TRoot extends AnyRootTypes, TRecord extends RouterRecord> = {
  [TKey in keyof TRecord]: TRecord[TKey] extends infer $Value
    ? $Value extends RouterRecord
      ? DecorateRouterRecord<TRoot, $Value>
      : $Value extends AnyProcedure
        ? CypressTRPCMock<$Value>
        : never
    : never;
};

type TRPCStub<TRouter extends AnyRouter> = DecorateRouterRecord<
  TRouter['_def']['_config']['$types'],
  TRouter['_def']['record']
>;

interface StubOptions {
  transformer?: CombinedDataTransformer;
}

export function stubTRPC<T extends AnyRouter, Stub = TRPCStub<T>>(options?: StubOptions) {
  const transformer = options?.transformer ?? defaultTransformer;

  const proxy = createFlatProxy<Stub>((key) => {
    return createRecursiveProxy((opts) => {
      const pathCopy = [key, ...opts.path];
      const lastArg: TRPCMockStub = pathCopy.pop() as TRPCMockStub;
      const path = pathCopy.join('.');
      if (lastArg === 'path') {
        return path;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedOpts = opts.args as Parameters<CypressTRPCMock<any>[typeof lastArg]>;
      if (lastArg === 'returns' || lastArg === 'returnsPartial') {
        return cy
          .intercept(`/api/trpc/${path}*`, {
            statusCode: 200,
            body: {
              result: {
                data: { json: transformer.output.serialize(typedOpts[0]) },
              },
            },
          })
          .as(path);
      }
      if (lastArg === 'intercept') {
        return cy
          .intercept(`/api/trpc/${path}*`, (req) => {
            req.continue((res) => {
              if (typedOpts[0]) {
                const output =
                  res?.body?.result?.data && transformer.output.deserialize(res.body.result.data);
                const transformedOutput = typedOpts[0](output);
                res.body.result.data = transformer.output.serialize(transformedOutput);
              }
            });
          })
          .as(path);
      }
      if (lastArg === 'wait') {
        const timeout = typedOpts[0]?.timeout;

        return cy.wait(`\@${path}`, {
          timeout,
        });
      }
    });
  });
  return proxy;
}
