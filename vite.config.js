import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';

const host = 'restu-food.test';
// const host = 'localhost';

export default defineConfig({
    plugins: [
        mkcert(),
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'framer-motion', '@inertiajs/react'],
    },
	server: {
		// port: 5173,
        https: true,
        hmr: {
            host: "localhost",
        }
	}
});


// server: {
//     // port: 3006,
   
//     https: {
//         key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
//         cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
//     },
//     host: true,
//     hmr: {
//         host: 'localhost'
//     },
// }