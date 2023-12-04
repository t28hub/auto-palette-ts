import { resolve } from 'path';

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
  ],
  test: {
    globals: true,
    threads: false, // Workaround https://github.com/vitest-dev/vitest/issues/740
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
      provider: 'v8',
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
      reporter: ['lcov', 'html', 'json'],
      reportsDirectory: 'coverage',
    },
  },
});
