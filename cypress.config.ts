import { defineConfig } from 'cypress';

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
      return config;
    },
  },
});
