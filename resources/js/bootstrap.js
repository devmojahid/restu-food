import axios from 'axios';
import routes from './config/routes';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Add CSRF token to all requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found');
}

// Initialize routes safely
// window.routes = Object.entries(routes).reduce((acc, [name, path]) => {
//     // Remove any regex special characters from the path
//     const safePath = path.replace(/[[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//     acc[name] = safePath;
//     return acc;
// }, {});

import './echo';
