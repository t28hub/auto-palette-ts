import * as path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'c10e',
      formats: ['es', 'umd'],
      fileName: (format) => `c10e.${format}.js`,
    },
  },
});