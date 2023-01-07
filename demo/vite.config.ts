/// <reference types="@sveltejs/kit" />
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    threads: false, // Workaround https://github.com/vitest-dev/vitest/issues/740
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    reporters: ['default', 'html'],
    testTimeout: 3000
  }
});
