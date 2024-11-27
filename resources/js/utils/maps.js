export const getMapsConfig = () => {
  return window.googleMapsConfig || {
    key: '',
    libraries: 'places,geometry',
    defaultCenter: { lat: 0, lng: 0 },
    defaultZoom: 12
  };
};

export const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google.maps);
      return;
    }

    const config = getMapsConfig();
    
    if (!config.key) {
      reject(new Error('Google Maps API key is missing'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.key}&libraries=${config.libraries}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      resolve(window.google.maps);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });
}; 