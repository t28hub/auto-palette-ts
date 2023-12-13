import { resolve } from 'path';

import codspeedPlugin from '@codspeed/vitest-plugin';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AutoPalette',
      formats: ['cjs', 'es', 'iife'],
      fileName: (format) => {
        if (format === 'cjs') {
          return 'index.cjs';
        }
        if (format === 'es') {
          return 'index.mjs';
        }
        return `index.${format}.js`;
      },
    },
    sourcemap: true,
    // minify: process.env.NODE_ENV === 'production',
  },
  plugins: [
    dts({
      include: 'src',
      rollupTypes: true,
      copyDtsFiles: false,
    }),
    codspeedPlugin(),
  ],
  test: {
    globals: true,
    // The 'pool' option needs to be set to 'forks' when the project depends on a library written in a native language.
    // In this project, we are using the 'canvas' library, which is written in a native language.
    // Reference: https://vitest.dev/config/#threads
    pool: 'forks',
    dir: 'test',
    include: ['**/*.test.{ts,tsx}'],
    alias: {
      'auto-palette': resolve(__dirname, 'src/index.ts'),
      '@internal': resolve(__dirname, 'src'),
    },
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    setupFiles: ['./test/setup.ts'],
    testTimeout: 1000,
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
