import { resolve } from 'path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/image.ts'),
      name: 'AutoPalette',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
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
    threads: false, // Workaround https://github.com/vitest-dev/vitest/issues/740
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    reporters: ['default', 'html'],
    setupFiles: ['vitest.setup.ts'],
    testTimeout: 3000,
    coverage: {
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.d.ts', '**/*/types.ts'],
      reporter: ['clover', 'cobertura', 'lcov', 'html'],
      reportsDirectory: 'coverage',
    },
  },
});
