import React from 'react';
import { AlertCircle } from 'lucide-react';

const MapFallback = ({ error }) => {
    return (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/10 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
                Map Loading Error
            </h3>
            <p className="text-red-600 dark:text-red-300">
                {error?.message || 'Failed to load Google Maps. Please try again later.'}
            </p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/20 
                         text-red-700 dark:text-red-300 rounded-lg 
                         hover:bg-red-200 dark:hover:bg-red-900/40 
                         transition-colors"
            >
                Retry Loading
            </button>
        </div>
    );
};

export default MapFallback; 