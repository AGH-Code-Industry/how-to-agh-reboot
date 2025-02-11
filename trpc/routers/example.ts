import { z } from 'zod';
import { procedure, router } from '../init';

export const exampleRouter = router({
  getExampleData: procedure.query(() => {
    return 'Lorem ipsum dolor sit amet';
  }),
  getExampleDataWithInput: procedure.input(z.string()).query((opts) => {
    const { input } = opts;
    return `Input received: ${input}`;
  }),
});
