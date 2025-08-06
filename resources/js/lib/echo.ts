// TEMPORARILY DISABLED: Laravel Reverb not available in Laravel Cloud
// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// // Declare global types
// declare global {
//     interface Window {
//         Echo: Echo<any>;
//         Pusher: typeof Pusher;
//     }
// }

// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
//     wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
//     wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
//     enabledTransports: ['ws', 'wss'],
//     authEndpoint: '/broadcasting/auth',
// });

// // Export for use in other files
// export { Echo };

// Placeholder for when Reverb becomes available
export const Echo = null;
