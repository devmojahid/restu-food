import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const NoData = ({ 
    title = "No Data Found", 
    description = "No matching data found for your criteria.",
    icon: Icon = SearchX 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4"
        >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                {description}
            </p>
        </motion.div>
    );
};

export default NoData; 