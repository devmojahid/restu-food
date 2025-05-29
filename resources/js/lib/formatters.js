/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - Currency symbol (default: $)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = '$', locale = 'en-US') => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }

    return `${currency}${value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'short', 'medium', 'long'
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium', locale = 'en-US') => {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return 'Invalid date';

    const options = {
        short: { month: 'short', day: 'numeric', year: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' },
        long: {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }
    };

    return dateObj.toLocaleDateString(locale, options[format] || options.medium);
};

/**
 * Format a number with a specified number of decimal places
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 0, locale = 'en-US') => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }

    return value.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
};

/**
 * Format a file size in bytes to a human-readable string (KB, MB, GB)
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format a number as a percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercent = (value, decimals = 0) => {
    if (typeof value !== 'number') {
        value = parseFloat(value) || 0;
    }

    return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50) => {
    if (!str || typeof str !== 'string') return '';

    if (str.length <= length) return str;

    return str.substring(0, length) + '...';
};

/**
 * Format a phone number to a readable format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
    if (!phone) return '';

    // Remove all non-numeric characters
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length === 11) {
        return `+${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
    }

    return phone; // Return original if we can't format it
}; 