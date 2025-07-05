import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Apple, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';

const NutritionalGuide = ({ data = {} }) => {
    const [activeTab, setActiveTab] = useState('categories');

    // Check if we have valid data
    if (!data || (!data.categories?.length && !data.allergen_information && !data.dietary_guides)) {
        return null;
    }

    // Get dynamic icon component
    const DynamicIcon = (iconName) => {
        if (!iconName) return Icons.Utensils;
        return Icons[iconName] || Icons.Utensils;
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <Badge variant="outline" className="mb-2 text-primary border-primary">
                        <Leaf className="w-3 h-3 mr-1" />
                        Nutrition
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Nutritional Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Making informed dietary choices is important. Explore our nutritional guides to find the perfect meal for your needs.
                    </p>
                </div>

                {/* Nutrition Tabs */}
                <Tabs
                    defaultValue="categories"
                    className="max-w-5xl mx-auto"
                    onValueChange={setActiveTab}
                >
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="categories">Dietary Categories</TabsTrigger>
                        <TabsTrigger value="allergens">Allergen Information</TabsTrigger>
                        <TabsTrigger value="guides">Dietary Guides</TabsTrigger>
                    </TabsList>

                    {/* Dietary Categories Tab */}
                    <TabsContent value="categories" className="focus:outline-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {data.categories?.map((category, index) => {
                                const IconComponent = DynamicIcon(category.icon);
                                return (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                                <IconComponent className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {category.description}
                                        </p>

                                        {/* Example Menu Items */}
                                        {category.items?.length > 0 && (
                                            <div className="space-y-3 mt-4">
                                                {category.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                                                        <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                                                        <div className="flex items-center">
                                                            <span className="text-gray-500 dark:text-gray-400 mr-2">{item.calories} cal</span>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <HelpCircle className="w-3 h-3 text-gray-400" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <div className="text-xs">
                                                                            <div>Protein: {item.protein}</div>
                                                                            <div>Carbs: {item.carbs}</div>
                                                                            <div>Fat: {item.fat}</div>
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <a
                                                href="#"
                                                className="text-primary text-sm font-medium flex items-center hover:underline"
                                            >
                                                <span>View all options</span>
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </TabsContent>

                    {/* Allergen Information Tab */}
                    <TabsContent value="allergens" className="focus:outline-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Allergen Information
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Items that contain common allergens
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.allergen_information && Object.entries(data.allergen_information).map(([allergen, items], index) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">
                                            {allergen}
                                        </h4>
                                        <ul className="space-y-2">
                                            {items.map((item, idx) => (
                                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                                    <span className="inline-block w-1 h-1 rounded-full bg-orange-500 mt-1.5 mr-2"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 mt-6 text-sm text-orange-800 dark:text-orange-200">
                                <p className="flex items-start">
                                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Our kitchen handles all common allergens. While we take precautions to avoid cross-contamination, we cannot guarantee that any menu item is completely free of allergens. Please inform your server of any allergies.
                                    </span>
                                </p>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Dietary Guides Tab */}
                    <TabsContent value="guides" className="focus:outline-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
                        >
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                                    <Apple className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Special Dietary Guides
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Recommendations for specific dietary preferences
                                    </p>
                                </div>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                {data.dietary_guides && Object.entries(data.dietary_guides).map(([diet, items], index) => (
                                    <AccordionItem key={index} value={`diet-${index}`}>
                                        <AccordionTrigger className="text-left">
                                            <span className="capitalize">{diet}</span> Diet Options
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-2 pl-2">
                                                {items.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                                        <span className="inline-block w-1 h-1 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 mt-6 text-sm text-green-800 dark:text-green-200">
                                <p className="flex items-start">
                                    <HelpCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Our nutrition experts have curated these recommendations. For specific dietary requirements or questions, please consult with our staff.
                                    </span>
                                </p>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default NutritionalGuide; 