import axios from 'axios';
import routes from './config/routes';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Initialize routes safely
window.routes = Object.entries(routes).reduce((acc, [name, path]) => {
    // Remove any regex special characters from the path
    const safePath = path.replace(/[[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    acc[name] = safePath;
    return acc;
}, {});

import './echo';
