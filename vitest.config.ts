import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'], // Optional setup file
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});