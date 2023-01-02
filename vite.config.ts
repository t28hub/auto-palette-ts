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
    threads: false, // Workaround https://github.com/vitest-dev/vitest/issues/740
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    reporters: ['default', 'html'],
    setupFiles: ['vitest.setup.ts'],
    testTimeout: 3000,
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['clover', 'cobertura', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
    },
  },
});
