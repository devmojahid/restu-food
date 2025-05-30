import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Star, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import * as LucideIcons from 'lucide-react';

const FaqSection = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedQuestions, setExpandedQuestions] = useState({});

    // If data isn't available, return null
    if (!data) return null;

    // Handle search functionality
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Toggle question expanded state
    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setExpandedQuestions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Filter questions based on search query
    const getFilteredQuestions = () => {
        if (!data.categories) return [];

        // If no search query and showing all categories, return all questions
        if (!searchQuery.trim() && activeCategory === 'all') {
            return data.categories;
        }

        // Filter based on search query and/or active category
        return data.categories.filter(category => {
            // If filtering by category and this isn't the active one, exclude it
            if (activeCategory !== 'all' && category.name.toLowerCase() !== activeCategory.toLowerCase()) {
                return false;
            }

            // If no search query, include this category
            if (!searchQuery.trim()) {
                return true;
            }

            // Filter questions within this category based on search
            const matchingQuestions = category.questions.filter(q =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Only include category if it has matching questions
            return matchingQuestions.length > 0;
        }).map(category => {
            // If we're searching, filter the questions within each category
            if (searchQuery.trim()) {
                return {
                    ...category,
                    questions: category.questions.filter(q =>
                        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                };
            }

            // Otherwise return the category unchanged
            return category;
        });
    };

    const filteredCategories = getFilteredQuestions();

    // Check if we have any results
    const hasResults = filteredCategories.some(cat => cat.questions.length > 0);

    return (
        <div id="faq-section" className="py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {data.title || 'Frequently Asked Questions'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                    {data.description || 'Find quick answers to common questions'}
                </p>

                {/* Search Input */}
                <div className="max-w-xl mx-auto relative mb-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search for questions..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-12 pr-4 py-3 h-14 bg-white dark:bg-gray-800 
                               border-gray-200 dark:border-gray-700 rounded-full 
                               focus:ring-primary focus:border-primary w-full"
                    />
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
                {/* Category Tabs */}
                <Tabs
                    defaultValue="all"
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                    className="mb-8"
                >
                    <TabsList className="w-full flex overflow-x-auto scrollbar-hide space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <TabsTrigger
                            value="all"
                            className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                        >
                            All Categories
                        </TabsTrigger>
                        {data.categories?.map((category, index) => {
                            const IconComponent = category.icon && LucideIcons[category.icon] ?
                                LucideIcons[category.icon] :
                                null;

                            return (
                                <TabsTrigger
                                    key={index}
                                    value={category.name.toLowerCase()}
                                    className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 min-w-max"
                                >
                                    {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                                    {category.name}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {/* FAQ Accordion Content */}
                    <TabsContent value={activeCategory} className="mt-6">
                        {hasResults ? (
                            <div className="space-y-12">
                                {filteredCategories.map((category, categoryIndex) => (
                                    category.questions.length > 0 && (
                                        <div key={categoryIndex} className="space-y-6">
                                            {activeCategory === 'all' && (
                                                <div className="flex items-center space-x-3 mb-6">
                                                    {category.icon && LucideIcons[category.icon] && (
                                                        <div className="bg-primary/10 p-2 rounded-full">
                                                            {React.createElement(LucideIcons[category.icon], {
                                                                className: "w-5 h-5 text-primary"
                                                            })}
                                                        </div>
                                                    )}
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                {category.questions.map((question, questionIndex) => {
                                                    const isExpanded = expandedQuestions[`${categoryIndex}-${questionIndex}`];

                                                    return (
                                                        <motion.div
                                                            key={questionIndex}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: questionIndex * 0.05 }}
                                                            className={cn(
                                                                "bg-white dark:bg-gray-800",
                                                                "rounded-xl shadow-sm",
                                                                "border border-gray-200 dark:border-gray-700",
                                                                "overflow-hidden",
                                                                "transition-all duration-200",
                                                                isExpanded && "ring-1 ring-primary/30"
                                                            )}
                                                        >
                                                            {/* Question Header */}
                                                            <button
                                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                                className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                                                            >
                                                                <h4 className="font-medium text-gray-900 dark:text-white pr-8">
                                                                    {searchQuery ? (
                                                                        <HighlightedText text={question.question} highlight={searchQuery} />
                                                                    ) : (
                                                                        question.question
                                                                    )}
                                                                </h4>
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                                                )}
                                                            </button>

                                                            {/* Answer Content */}
                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        <div className="px-5 pb-5 pt-0 border-t border-gray-100 dark:border-gray-700">
                                                                            <p className="text-gray-600 dark:text-gray-400">
                                                                                {searchQuery ? (
                                                                                    <HighlightedText text={question.answer} highlight={searchQuery} />
                                                                                ) : (
                                                                                    question.answer
                                                                                )}
                                                                            </p>

                                                                            {/* Helpful Buttons */}
                                                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                                                <div className="flex items-center space-x-4">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="text-gray-500 hover:text-primary"
                                                                                    >
                                                                                        <Star className="w-4 h-4 mr-2" />
                                                                                        Helpful
                                                                                    </Button>
                                                                                </div>
                                                                                <Link
                                                                                    href="#support-ticket"
                                                                                    className="text-primary text-sm font-medium"
                                                                                >
                                                                                    Still need help?
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            // No Results State
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                            >
                                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    No matching questions found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    We couldn't find any questions matching "{searchQuery}".
                                    Try using different keywords or submit a new question.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('all');
                                    }}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    Clear Search
                                </Button>
                                <Link href="#support-ticket">
                                    <Button>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Ask a Question
                                    </Button>
                                </Link>
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Popular Questions */}
                {data.popular?.length > 0 && (
                    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Popular Questions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.popular.map((question, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Link
                                        href="#"
                                        className="flex items-start"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Find and expand this question
                                            data.categories.forEach((cat, catIndex) => {
                                                cat.questions.forEach((q, qIndex) => {
                                                    if (q.question === question) {
                                                        toggleQuestion(catIndex, qIndex);
                                                        // Scroll to the question
                                                        setTimeout(() => {
                                                            document.querySelectorAll('.faq-question')[catIndex * cat.questions.length + qIndex]?.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'center'
                                                            });
                                                        }, 100);
                                                    }
                                                });
                                            });
                                        }}
                                    >
                                        <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-900 dark:text-white font-medium">{question}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Can't Find Answer CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Can't find what you're looking for?
                    </p>
                    <Link href="#support-ticket">
                        <Button size="lg" className="rounded-full">
                            Submit a Support Ticket
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Helper component to highlight search matches
const HighlightedText = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) => (
                regex.test(part) ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-900 font-medium">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            ))}
        </span>
    );
};

export default FaqSection; 