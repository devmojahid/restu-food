import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';

const FAQ = ({ faqs = [] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter FAQs based on search query
    const filteredFaqs = faqs.filter(faq => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
    });
    
    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Find answers to common questions about our chefs and culinary services
                            </p>
                        </motion.div>
                        
                        {/* Search Bar */}
                        <div className="relative max-w-md mx-auto mb-8">
                            <Input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 py-2 w-full rounded-full"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ChevronDown className="w-3 h-3 rotate-180" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* FAQs Accordion */}
                    <Accordion type="single" collapsible className="space-y-4">
                        <AnimatePresence initial={false}>
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, index) => (
                                    <motion.div
                                        key={faq.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <FaqItem 
                                            question={faq.question} 
                                            answer={faq.answer}
                                            category={faq.category}
                                            highlight={searchQuery}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-8"
                                >
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No questions found matching "{searchQuery}". Try a different search term.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Accordion>
                    
                    {/* Still Have Questions CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                    >
                        <h3 className="text-xl font-semibold mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            If you can't find the answer to your question, feel free to contact us directly.
                        </p>
                        <Button className="rounded-full">
                            Contact Support
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Function to highlight search terms in text
const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() 
            ? <span key={index} className="bg-yellow-200 dark:bg-yellow-700">{part}</span> 
            : part
    );
};

// Individual FAQ Item
const FaqItem = ({ question, answer, category = null, highlight = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <AccordionItem 
            value={question} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
            <AccordionTrigger 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "px-6 py-4 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "flex justify-between items-center w-full transition-colors",
                    isOpen && "bg-gray-50 dark:bg-gray-800/50"
                )}
            >
                <div className="flex-1 pr-4">
                    <span className="inline-flex items-center">
                        {highlight ? highlightText(question, highlight) : question}
                        {category && (
                            <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                {category}
                            </span>
                        )}
                    </span>
                </div>
                {isOpen ? (
                    <MinusCircle className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                    <PlusCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-gray-600 dark:text-gray-400">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    {highlight ? highlightText(answer, highlight) : answer}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default FAQ; 