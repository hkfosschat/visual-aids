import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npx vite preview --port 4173',
    url: 'http://localhost:4173/visual-aids/',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
