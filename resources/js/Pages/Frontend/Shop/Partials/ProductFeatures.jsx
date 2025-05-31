import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Timer, Leaf, Award, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductFeatures = ({ product }) => {
    // Skip rendering if no product data is available
    if (!product) return null;
    
    // Default features if none are provided
    const defaultFeatures = [
        {
            icon: ShieldCheck,
            title: 'Quality Assured',
            description: 'Premium quality guaranteed',
            color: 'text-green-500'
        },
        {
            icon: Timer,
            title: 'Fresh Products',
            description: 'Always fresh and high-quality',
            color: 'text-blue-500'
        },
        {
            icon: Leaf,
            title: 'Sustainable',
            description: 'Environmentally friendly practices',
            color: 'text-emerald-500'
        },
        {
            icon: Award,
            title: 'Award Winning',
            description: 'Recognized for excellence',
            color: 'text-amber-500'
        }
    ];
    
    // Use product features if available, otherwise use defaults
    const features = product.enhanced_features || defaultFeatures;
    
    // Feature card component
    const FeatureCard = ({ feature, index }) => {
        const Icon = feature.icon;
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
            >
                <div className={cn(
                    "p-2 rounded-lg mr-4",
                    "bg-opacity-10 dark:bg-opacity-20",
                    feature.color === 'text-green-500' && 'bg-green-100 dark:bg-green-900/20',
                    feature.color === 'text-blue-500' && 'bg-blue-100 dark:bg-blue-900/20',
                    feature.color === 'text-amber-500' && 'bg-amber-100 dark:bg-amber-900/20',
                    feature.color === 'text-emerald-500' && 'bg-emerald-100 dark:bg-emerald-900/20',
                    feature.color === 'text-purple-500' && 'bg-purple-100 dark:bg-purple-900/20',
                    feature.color === 'text-red-500' && 'bg-red-100 dark:bg-red-900/20',
                )}>
                    {Icon && <Icon className={cn("w-6 h-6", feature.color)} />}
                    {!Icon && <Tag className={cn("w-6 h-6", feature.color)} />}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                    </p>
                </div>
            </motion.div>
        );
    };
    
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <FeatureCard 
                        key={index} 
                        feature={feature}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductFeatures; 