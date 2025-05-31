import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether a media query matches the current viewport
 * @param {string} query - CSS media query string
 * @returns {boolean} - Whether the media query matches
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Check if window exists (for SSR compatibility)
        if (typeof window !== 'undefined') {
            const media = window.matchMedia(query);

            // Set initial value
            setMatches(media.matches);

            // Create listener function
            const listener = (e) => {
                setMatches(e.matches);
            };

            // Add listener for changes
            media.addEventListener('change', listener);

            // Clean up function
            return () => {
                media.removeEventListener('change', listener);
            };
        }
    }, [query]);

    return matches;
} 