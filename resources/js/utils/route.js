const route = (name, params = {}) => {
    try {
        // Get the route pattern from the routes object
        const pattern = window.routes[name];
        if (!pattern) {
            console.error(`Route "${name}" not found.`);
            return '#';
        }

        // Replace named parameters in the route pattern
        let url = pattern;
        for (const [key, value] of Object.entries(params)) {
            // Safely replace both optional and required parameters
            const requiredPattern = new RegExp(`{${key}}`, 'g');
            const optionalPattern = new RegExp(`{${key}\\?}`, 'g');
            url = url.replace(requiredPattern, value);
            url = url.replace(optionalPattern, value);
        }

        // Safely remove any remaining optional parameters
        url = url.replace(/\/\{[^}]+\?\}/g, '');

        // Clean up any double slashes
        url = url.replace(/\/+/g, '/');

        return url;
    } catch (error) {
        console.error('Error generating route:', error);
        return '#';
    }
};

export default route; 