import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    define: {
       'process.env': {
            VITE_PUSHER_APP_KEY: JSON.stringify(process.env.VITE_PUSHER_APP_KEY),
            VITE_PUSHER_APP_CLUSTER: JSON.stringify(process.env.VITE_PUSHER_APP_CLUSTER),
        }
    },
    server: {
        port: 5177,
    }
});
