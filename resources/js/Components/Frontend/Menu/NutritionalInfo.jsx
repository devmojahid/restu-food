import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Flame, Apple, Droplet } from 'lucide-react';

const NutritionalInfo = ({ nutrition }) => {
    const nutritionItems = [
        { icon: Flame, label: 'Calories', value: nutrition?.calories, unit: 'kcal' },
        { icon: Scale, label: 'Protein', value: nutrition?.protein, unit: 'g' },
        { icon: Apple, label: 'Carbs', value: nutrition?.carbs, unit: 'g' },
        { icon: Droplet, label: 'Fat', value: nutrition?.fat, unit: 'g' }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            {nutritionItems.map((item) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <item.icon className="w-6 h-6 mx-auto text-primary" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.value || '---'}{item.unit}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default NutritionalInfo; 