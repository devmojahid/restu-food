import axios from 'axios';
import routes from './config/routes';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Initialize routes safely
// window.routes = Object.entries(routes).reduce((acc, [name, path]) => {
//     // Remove any regex special characters from the path
//     const safePath = path.replace(/[[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
//     acc[name] = safePath;
//     return acc;
// }, {});

import './echo';

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT,
//     wssPort: import.meta.env.VITE_REVERB_PORT,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });
