import { resolve } from 'node:path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AutoPalette',
      formats: ['cjs', 'es'],
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
