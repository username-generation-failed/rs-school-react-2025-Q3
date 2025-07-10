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
}));
