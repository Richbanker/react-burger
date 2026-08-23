import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === 'test'
      ? []
      : [
          checker({
            typescript: true,
          }),
        ]),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ],
  base: mode === 'production' ? '/react-burger/' : '/',
  test: {
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
    setupFiles: ['./vitest-setup.ts'],
  },
  server: {
    open: mode !== 'test',
  },
}));
