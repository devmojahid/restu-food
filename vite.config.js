import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';
import collectModuleAssetsPaths from './vite-module-loader.js';

const host = 'restu-food.test';
// const host = 'localhost';

async function getConfig() {
    const paths = [
        'resources/css/app.css',
        'resources/js/app.jsx'
    ];
    const allPaths = await collectModuleAssetsPaths(paths, 'Modules');

    return defineConfig({  
        plugins: [
            mkcert(),
            laravel({
                input: allPaths,
                ssr: 'resources/js/ssr.jsx',
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './resources/js'),
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
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
}

export default getConfig();

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