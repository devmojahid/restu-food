import { useMemo } from 'react';

/**
 * Hook for safely working with arrays that might come from JSON or unreliable sources
 * Provides utility functions to ensure arrays are properly handled
 */
export default function useArraySafety() {
    /**
     * Ensure a value is an array, return empty array if not
     * @param {any} possibleArray - The value to check
     * @param {Array} defaultValue - Optional default value to return if not an array
     * @returns {Array} - A guaranteed array
     */
    const ensureArray = (possibleArray, defaultValue = []) => {
        // First check if it's an array
        if (Array.isArray(possibleArray)) {
            return possibleArray;
        }

        // If it's a string that might be JSON, try to parse it
        if (typeof possibleArray === 'string') {
            try {
                const parsed = JSON.parse(possibleArray);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch (e) {
                // Parsing failed, not a JSON string
                console.debug('Failed to parse possible JSON array:', e.message);
            }
        }

        // If it's an object with numeric keys and a length property, try to convert
        if (
            possibleArray &&
            typeof possibleArray === 'object' &&
            !Array.isArray(possibleArray) &&
            possibleArray.length !== undefined
        ) {
            try {
                return Array.from(possibleArray);
            } catch (e) {
                console.debug('Failed to convert object to array:', e.message);
            }
        }

        // Return default empty array or provided default
        return defaultValue;
    };

    /**
     * Safely map over an array with fallback for non-arrays
     * @param {any} possibleArray - The array to map over
     * @param {Function} mapFn - The mapping function
     * @param {Array} defaultValue - Default value if not an array
     * @returns {Array} - The mapped array or default value
     */
    const safeMap = (possibleArray, mapFn, defaultValue = []) => {
        const array = ensureArray(possibleArray, null);
        if (array === null) {
            return defaultValue;
        }
        return array.map(mapFn);
    };

    /**
     * Get a value from an array at a specific index with safety checks
     * @param {any} possibleArray - The array to get from
     * @param {number} index - The index to access
     * @param {any} defaultValue - Default value if index doesn't exist
     * @returns {any} - The value at the index or default
     */
    const safeArrayValue = (possibleArray, index, defaultValue = null) => {
        const array = ensureArray(possibleArray);
        if (index >= 0 && index < array.length) {
            return array[index];
        }
        return defaultValue;
    };

    /**
     * Get the length of an array safely
     * @param {any} possibleArray - The array to get length from
     * @returns {number} - The length or 0 if not an array
     */
    const safeLength = (possibleArray) => {
        return ensureArray(possibleArray).length;
    };

    /**
     * Check if an array is empty
     * @param {any} possibleArray - The array to check
     * @returns {boolean} - True if array is empty or not an array
     */
    const isEmpty = (possibleArray) => {
        return safeLength(possibleArray) === 0;
    };

    return {
        ensureArray,
        safeMap,
        safeArrayValue,
        safeLength,
        isEmpty
    };
} 