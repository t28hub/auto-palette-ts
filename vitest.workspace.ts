import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'unit',
      include: ['**/*.test.ts'],
      exclude: ['**/*.browser.test.ts', '**/*.node.test.ts'],
      setupFiles: ['./test/setup.ts'],
      environment: 'jsdom',
      testTimeout: 1_000,
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'e2e:browser',
      include: ['**/*.browser.test.ts'],
      setupFiles: ['./test/setup.browser.ts'],
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        name: 'chromium',
        screenshotFailures: false,
      },
      retry: 3,
      testTimeout: 10_000,
    },
  },
  {
    extends: './vite.config.ts',
    test: {
      name: 'e2e:node',
      include: ['**/*.node.test.ts'],
      setupFiles: ['./test/setup.node.ts'],
      environment: 'node',
      retry: 3,
      testTimeout: 10_000,
    },
  },
]);
