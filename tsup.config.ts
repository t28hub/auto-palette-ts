import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'AutoPalette',
  entry: ['src/index.ts'],
  target: 'esnext',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
});
