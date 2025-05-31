import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Trophy, Medal, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';

const ChefAwards = ({ awards = [] }) => {
    if (!awards || awards.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-6">Awards & Recognitions</h3>
            
            <div className="grid gap-4">
                {awards.map((award, index) => (
                    <AwardItem 
                        key={award.id || index} 
                        award={award} 
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

const AwardItem = ({ award, index }) => {
    // Get icon based on award type
    const getAwardIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'michelin':
                return Star;
            case 'gold':
            case 'trophy':
                return Trophy;
            case 'medal':
                return Medal;
            default:
                return Award;
        }
    };
    
    // Get color based on award type
    const getAwardColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'michelin':
                return 'text-red-500';
            case 'gold':
                return 'text-yellow-500';
            case 'silver':
                return 'text-gray-400';
            case 'bronze':
                return 'text-amber-700';
            default:
                return 'text-primary';
        }
    };
    
    const AwardIcon = getAwardIcon(award.type);
    const iconColor = getAwardColor(award.type);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
        >
            {/* Award Icon */}
            <div className={cn(
                "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                "bg-gray-100 dark:bg-gray-700",
                iconColor
            )}>
                <AwardIcon className="w-6 h-6" />
            </div>
            
            {/* Award Content */}
            <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h4 className="text-lg font-semibold">{award.title}</h4>
                    
                    {/* Award Type Badge */}
                    {award.type && (
                        <Badge variant="outline" className={cn("border-current", iconColor)}>
                            {award.type}
                        </Badge>
                    )}
                </div>
                
                {/* Issuing Organization */}
                {award.issuer && (
                    <div className="flex items-center text-primary/90 font-medium text-sm mb-1">
                        {award.issuer}
                        
                        {award.issuer_url && (
                            <a 
                                href={award.issuer_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-1 text-gray-500 hover:text-primary"
                            >
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                )}
                
                {/* Year */}
                {award.year && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{award.year}</span>
                    </div>
                )}
                
                {/* Description */}
                {award.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {award.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default ChefAwards; 