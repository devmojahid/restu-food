import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/Components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Button } from '@/Components/ui/button';

const Faq = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openQuestions, setOpenQuestions] = useState({});
    const [activeCategory, setActiveCategory] = useState(0);

    // Handle null data
    if (!data || !data.categories || data.categories.length === 0) {
        return null;
    }

    // Toggle question open/closed state
    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenQuestions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Filter questions based on search term
    const getFilteredQuestions = () => {
        if (!searchTerm) {
            return data.categories;
        }

        const searchTermLower = searchTerm.toLowerCase();

        return data.categories.map(category => ({
            ...category,
            questions: category.questions.filter(q =>
                q.question.toLowerCase().includes(searchTermLower) ||
                q.answer.toLowerCase().includes(searchTermLower)
            )
        })).filter(category => category.questions.length > 0);
    };

    const filteredCategories = getFilteredQuestions();

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

    return (
        <div className="mt-16 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {data.title || 'Frequently Asked Questions'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {data.description || 'Find answers to common questions about our policies'}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search questions..."
                        className="pl-10 pr-4 py-2 rounded-full border-gray-300 dark:border-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* FAQ Content */}
            {filteredCategories.length > 0 ? (
                searchTerm ? (
                    // Display all matching questions when searching
                    <div className="space-y-6">
                        {filteredCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {category.name}
                                </h3>

                                {category.questions.map((faq, questionIndex) => (
                                    <motion.div
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn(
                                            "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
                                            "bg-white dark:bg-gray-800"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                            className={cn(
                                                "flex items-center justify-between w-full p-4 text-left",
                                                "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                                openQuestions[`${categoryIndex}-${questionIndex}`] && "bg-gray-50 dark:bg-gray-700/50"
                                            )}
                                        >
                                            <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white pr-8">
                                                {highlightText(faq.question, searchTerm)}
                                            </h4>
                                            <ChevronDown
                                                className={cn(
                                                    "h-5 w-5 text-gray-500 transition-transform",
                                                    openQuestions[`${categoryIndex}-${questionIndex}`] && "transform rotate-180"
                                                )}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {openQuestions[`${categoryIndex}-${questionIndex}`] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            {highlightText(faq.answer, searchTerm)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Use tabs for categorized display when not searching
                    <Tabs
                        defaultValue="0"
                        onValueChange={(value) => setActiveCategory(parseInt(value))}
                        value={activeCategory.toString()}
                    >
                        <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto flex flex-nowrap md:flex-wrap">
                            {filteredCategories.map((category, index) => (
                                <TabsTrigger
                                    key={index}
                                    value={index.toString()}
                                    className="whitespace-nowrap"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {filteredCategories.map((category, categoryIndex) => (
                            <TabsContent key={categoryIndex} value={categoryIndex.toString()} className="space-y-4">
                                {category.questions.map((faq, questionIndex) => (
                                    <motion.div
                                        key={questionIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: questionIndex * 0.05 }}
                                        className={cn(
                                            "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
                                            "bg-white dark:bg-gray-800"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                            className={cn(
                                                "flex items-center justify-between w-full p-4 text-left",
                                                "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                                                openQuestions[`${categoryIndex}-${questionIndex}`] && "bg-gray-50 dark:bg-gray-700/50"
                                            )}
                                        >
                                            <h4 className="text-base md:text-lg font-medium text-gray-900 dark:text-white pr-8">
                                                {faq.question}
                                            </h4>
                                            <ChevronDown
                                                className={cn(
                                                    "h-5 w-5 text-gray-500 transition-transform",
                                                    openQuestions[`${categoryIndex}-${questionIndex}`] && "transform rotate-180"
                                                )}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {openQuestions[`${categoryIndex}-${questionIndex}`] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                )
            ) : (
                // No results state
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-gray-50 dark:bg-gray-800 p-8 text-center"
                >
                    <HelpCircle className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No questions found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        No FAQs match your search. Try different keywords.
                    </p>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setSearchTerm('')}
                        >
                            Clear Search
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Faq; 