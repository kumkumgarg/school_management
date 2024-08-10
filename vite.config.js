import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import reactRefresh from '@vitejs/plugin-react-refresh'
import fs from 'fs/promises';
// import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // 'resources/css/app.css',
                'src/assets/scss/app.scss',
                'src/index.jsx'
            ],
            refresh: true,
        }),
        reactRefresh(),
        // react(),
    ],
    server: {
        // fs: {
        //     cachedChecks: false
        // },
        host: 'localhost', //add localhost for windows otherwise set it to true
        // host: '192.168.137.77', //add localhost for windows otherwise set it to true
        // host: true, //add localhost for windows otherwise set it to true
    }
});
