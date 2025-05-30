import { defineConfig } from 'cypress';
import { prisma } from './prisma/prisma';

export default defineConfig({
  component: {
    supportFile: 'cypress/support/component.tsx',
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      config.env.styles = '@/app/globals.scss';
      return config;
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = 'http://localhost:3000';

      on('task', {
        seedDbWithQrCodes: async () => {
          await prisma.qR.upsert({
            where: { qr_id: 1 },
            update: { code: 'QR1' },
            create: { qr_id: 1, code: 'QR1' },
          });
          await prisma.qR.upsert({
            where: { qr_id: 2 },
            update: { code: 'QR2' },
            create: { qr_id: 2, code: 'QR2' },
          });
          console.log(await prisma.qR.findMany());
          return ['QR1', 'QR2'];
        },
      });

      return config;
    },
  },
});
