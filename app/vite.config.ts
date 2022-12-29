import react from '@vitejs/plugin-react-swc';

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [react()],
});
