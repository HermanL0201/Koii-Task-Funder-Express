import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    hookTimeout: 30000, // Increase hook timeout
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    setupFiles: ['./tests/setup.ts'],
  },
});