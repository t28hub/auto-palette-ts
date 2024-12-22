import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['**/*.test.ts'],
      exclude: ['**/*.browser.test.ts', '**/*.node.test.ts'],
      setupFiles: ['./test/setup.ts'],
      benchmark: {
        include: [],
      },
      testTimeout: 1_000,
      retry: 1,
    },
  },
  {
    extends: './vitest.config.ts',
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
      benchmark: {
        include: [],
      },
      testTimeout: 10_000,
      retry: 3,
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'e2e:node',
      environment: 'node',
      include: ['**/*.node.test.ts'],
      setupFiles: ['./test/setup.node.ts'],
      benchmark: {
        include: ['**/*.bench.ts'],
      },
      testTimeout: 10_000,
      retry: 3,
    },
  },
]);
