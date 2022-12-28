/// <reference types="vitest" />
import { resolve } from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AutoPalette',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
  },
  plugins: [dts({ include: 'src', rollupTypes: true })],
  test: {
    globals: true,
    include: ['src/**/*.test.(ts|tsx)'],
    reporters: ['html', 'verbose'],
    setupFiles: ['vitest.setup.ts'],
    testTimeout: 3000,
    coverage: {
      all: true,
      include: ['src/**', 'src/types.ts'],
      reportsDirectory: 'coverage',
      reporter: ['clover', 'lcov'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
});
