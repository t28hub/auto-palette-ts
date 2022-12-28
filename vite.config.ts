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
});
