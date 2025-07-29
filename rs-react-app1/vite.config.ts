/// <reference types="vitest" />
import { defineConfig } from 'vite';
import reactSWC from '@vitejs/plugin-react-swc';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'development' ? reactSWC() : react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  publicDir: 'public',
  test: {
    setupFiles: ['./vitest-setup.ts'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/main.{js,jsx,ts,tsx}',
        'src/**/*.d.ts',
        'types.ts',
      ],
      thresholds: { statements: 80, branches: 50, functions: 50, lines: 50 },
    },
  },
}));
