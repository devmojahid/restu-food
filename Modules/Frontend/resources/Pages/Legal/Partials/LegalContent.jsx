import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import * as LucideIcons from 'lucide-react';

const LegalContent = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Handle null data
    if (!data || !data.sections) {
        return (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-8 text-center">
                <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No content available</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    The requested document could not be found.
                </p>
            </div>
        );
    }

    // Filter sections based on search term
    const filteredSections = data.sections.filter(section => {
        if (!searchTerm) return true;

        const searchTermLower = searchTerm.toLowerCase();
        return (
            section.title?.toLowerCase().includes(searchTermLower) ||
            section.content?.toLowerCase().includes(searchTermLower)
        );
    });

    // Highlight search terms in text
    const highlightText = (text, term) => {
        if (!term || !text) return text;

        const regex = new RegExp(`(${term})`, 'gi');
        return text.split(regex).map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">
                    {part}
                </span>
            ) : part
        );
    };

    // Get the correct icon component
    const getIconComponent = (iconName) => {
        if (!iconName || typeof iconName !== 'string') return LucideIcons.FileText;

        return LucideIcons[iconName] || LucideIcons.FileText;
    };

    return (
        <div id="legal-content" className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                    {data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Legal'} Policy
                </h2>

                {/* Search Bar */}
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search policy..."
                        className="pl-10 pr-4 py-2 rounded-full border-gray-300 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Download Options */}
            {data.downloadOptions && data.downloadOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.downloadOptions.map((option, index) => {
                        const Icon = getIconComponent(option.icon);
                        return (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => window.open(option.url, '_blank')}
                                        >
                                            <Icon className="h-4 w-4 mr-2" />
                                            <span>{option.format}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download as {option.format}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            )}

            {/* Sections */}
            <div className="space-y-8 mb-10">
                {filteredSections.length > 0 ? (
                    filteredSections.map((section, index) => {
                        const Icon = getIconComponent(section.icon);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn(
                                    "p-6 border border-gray-100 dark:border-gray-800 rounded-xl",
                                    "bg-white dark:bg-gray-900/50 shadow-sm hover:shadow-md transition-all"
                                )}
                            >
                                <div className="flex items-start">
                                    <div className="mr-4">
                                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                                        <div className="text-gray-700 dark:text-gray-300 prose prose-sm md:prose-base dark:prose-invert max-w-none">
                                            {searchTerm
                                                ? highlightText(section.content, searchTerm)
                                                : section.content
                                            }
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-8 text-center">
                        <Search className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No results found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            No sections match your search. Try different keywords.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalContent; 