import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                mold: resolve(__dirname, 'mold.html'),
                water: resolve(__dirname, 'water.html'),
                sagging_floors: resolve(__dirname, 'sagging-floors.html')
            }
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
