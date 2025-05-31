import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

const FaqSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Frequently Asked Questions';
    const subtitle = data?.subtitle || 'Common Questions';
    const faqs = data?.faqs || [];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"
                    >
                        <span>{subtitle}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {title}
                    </motion.h2>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                            >
                                <AccordionItem
                                    value={`item-${index}`}
                                    className={cn(
                                        "rounded-xl overflow-hidden",
                                        "bg-white dark:bg-gray-800",
                                        "border border-gray-100 dark:border-gray-700",
                                        "shadow-sm"
                                    )}
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <span className="text-left font-semibold text-gray-900 dark:text-white">
                                            {faq.question}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-400">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FaqSection; 