import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    setupNodeEvents(on, config) {
      config.env.styles = '@/app/globals.scss';
      return config;
    },
  },
});
