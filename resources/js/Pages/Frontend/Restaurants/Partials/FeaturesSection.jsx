import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Utensils, 
    Wifi, 
    CreditCard, 
    ParkingCircle,
    Baby,
    Accessibility,
    Music,
    Wind,
    Tv,
    Users,
    Shield,
    Award,
    CheckCircle2,
    Coffee,
    Wine,
    Sandwich,
    PackageX
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import NoData from '@/Components/ui/no-data';

// Feature icons mapping with null checks
const featureIcons = {
    wifi: Wifi,
    parking: ParkingCircle,
    'credit-card': CreditCard,
    'baby-chair': Baby,
    wheelchair: Accessibility,
    music: Music,
    'air-conditioning': Wind,
    tv: Tv,
    'private-dining': Users,
    'outdoor-seating': Utensils
};

const certificationIcons = {
    halal: Shield,
    'michelin-star': Award,
    'health-grade-a': CheckCircle2
};

const FeaturesSection = ({ features = [] }) => {
    const [showAll, setShowAll] = useState(false);

    // Ensure features is an array
    const featuresList = Array.isArray(features) ? features : [];

    // If no features, return null or a placeholder
    if (featuresList.length === 0) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Features & Amenities
                    </h2>
                    <NoData
                        icon={PackageX}
                        title="No Features Listed"
                        description="Information about restaurant features and amenities is not available at the moment."
                    />
                </div>
            </section>
        );
    }

    // Rest of your component code...
    return (
        <section className="py-12">
            {/* Your existing JSX with AnimatePresence */}
            <AnimatePresence>
                {/* ... */}
            </AnimatePresence>
        </section>
    );
};

export default FeaturesSection; 