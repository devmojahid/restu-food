import { Loader } from '@googlemaps/js-api-loader';

let googleMapsPromise = null;

export const loadGoogleMaps = () => {
    if (!googleMapsPromise) {
        const loader = new Loader({
            apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            version: 'weekly',
            libraries: ['places', 'geometry']
        });
        
        googleMapsPromise = loader.load();
    }
    return googleMapsPromise;
}; 