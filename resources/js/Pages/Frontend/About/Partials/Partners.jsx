import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, 
    Globe,
    Award,
    Users,
    ArrowRight,
    ExternalLink,
    Star,
    Calendar,
    TrendingUp,
    Shield,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const PartnerCard = ({ partner, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
                "group relative",
                "bg-white dark:bg-gray-800",
                "rounded-2xl overflow-hidden",
                "border border-gray-100 dark:border-gray-700",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300"
            )}
        >
            {/* Partner Logo Section */}
            <div className="relative aspect-video p-8 bg-gray-50 dark:bg-gray-800/50">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain 
                               filter dark:brightness-90 transition-all duration-300
                               group-hover:scale-110"
                    />
                </div>
                
                {/* Partnership Type Badge */}
                <div className="absolute top-4 left-4">
                    <Badge 
                        variant="secondary" 
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                    >
                        {partner.type}
                    </Badge>
                </div>

                {/* Partnership Duration */}
                <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 rounded-full text-xs font-medium 
                                bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm 
                                text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 inline-block mr-1" />
                        Since {partner.since}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {partner.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {partner.industry}
                        </p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            {partner.rating}
                        </span>
                    </div>
                </div>

                {/* Partnership Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {partner.highlights?.map((highlight, idx) => (
                        <div 
                            key={`${partner.id}-highlight-${idx}`}
                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                        >
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {highlight.value}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {highlight.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    {partner.description}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        className="flex-1 group"
                        onClick={() => window.open(partner.website, '_blank')}
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 
                                             transition-opacity" />
                    </Button>
                    <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => window.open(`/partners/${partner.id}`, '_blank')}
                    >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 border-2 border-primary scale-105 opacity-0 
                         group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
        </motion.div>
    );
};

const PartnerSearch = ({ onSearch, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search partners..."
                    className="pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Partners</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

const Partners = ({ data }) => {
    const [filteredPartners, setFilteredPartners] = useState(data.partners);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Handle search and filtering
    useEffect(() => {
        let filtered = data.partners;
        
        if (searchQuery) {
            filtered = filtered.filter(partner => 
                partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                partner.industry.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(partner => partner.type === filterType);
        }

        setFilteredPartners(filtered);
    }, [searchQuery, filterType, data.partners]);

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 
                             rounded-full blur-3xl opacity-50 dark:opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full 
                                bg-primary/10 dark:bg-primary/20 text-primary mb-6"
                    >
                        <Globe className="w-8 h-8" />
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {data.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.subtitle}
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <PartnerSearch
                    onSearch={setSearchQuery}
                    onFilterChange={setFilterType}
                />

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPartners.map((partner, index) => (
                        <PartnerCard 
                            key={partner.id || `partner-${index}`}
                            partner={partner} 
                            index={index}
                        />
                    ))}
                </div>

                {/* Partnership Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
                >
                    {[
                        {
                            icon: Building2,
                            value: '500+',
                            label: 'Partner Companies',
                            color: 'text-blue-500'
                        },
                        {
                            icon: Globe,
                            value: '50+',
                            label: 'Countries',
                            color: 'text-green-500'
                        },
                        {
                            icon: TrendingUp,
                            value: '85%',
                            label: 'Growth Rate',
                            color: 'text-yellow-500'
                        },
                        {
                            icon: Shield,
                            value: '10+',
                            label: 'Years of Trust',
                            color: 'text-purple-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-6 rounded-2xl",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "text-center group",
                                "hover:shadow-lg transition-shadow duration-300"
                            )}
                        >
                            <div className={cn(
                                "inline-flex items-center justify-center",
                                "w-12 h-12 rounded-full mb-4",
                                "bg-gray-50 dark:bg-gray-700/50",
                                stat.color,
                                "group-hover:scale-110",
                                "transition-transform duration-300"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Partners; 