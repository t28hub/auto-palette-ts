import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    dir: 'test',
    alias: {
      'auto-palette': resolve(__dirname, 'src/index.ts'),
      '@internal': resolve(__dirname, 'src'),
    },
    coverage: {
      all: false,
      provider: 'v8',
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
      reporter: ['lcov', 'html', 'json', 'text'],
      reportsDirectory: 'coverage',
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
