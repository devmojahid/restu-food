import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    }
});

// Ensure Echo is initialized
// if (typeof window.Echo === 'undefined') {
//     console.error('Echo is not initialized');
//     return;
// }

// Connection status monitoring
// window.Echo.connector.pusher.connection.bind('connected', () => {
//     console.log('Successfully connected to Reverb server');
// });

// window.Echo.connector.pusher.connection.bind('error', (error) => {
//     console.error('Reverb connection error:', error);
// });