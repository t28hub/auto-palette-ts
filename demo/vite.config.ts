/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  root: './',
  plugins: [svelte()],
  test: {
    globals: true,
    threads: false, // Workaround https://github.com/vitest-dev/vitest/issues/740
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
    reporters: ['default', 'html'],
    testTimeout: 3000
  }
});
