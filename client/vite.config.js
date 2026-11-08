import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Calls to /api go to the Express server, so there are no CORS issues in dev.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
