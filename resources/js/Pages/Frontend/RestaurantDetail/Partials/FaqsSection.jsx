import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

const FaqsSection = ({ faqs = [] }) => {
    if (!faqs?.length) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center mb-4"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                </motion.div>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                    Find answers to common questions about our restaurant
                </motion.p>
            </div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl mx-auto mb-12"
            >
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search our FAQs..."
                        className="pl-12 py-6 text-base rounded-full bg-gray-50 dark:bg-gray-800 focus-visible:ring-primary"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </motion.div>

            {/* FAQs Accordion */}
            <div className="max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + (index * 0.1) }}
                        >
                            <AccordionItem
                                value={`item-${index}`}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4 shadow-sm"
                            >
                                <AccordionTrigger className="hover:no-underline px-6 py-4 text-left font-medium text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 dark:text-gray-300">
                                    <p>{faq.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>

            {/* Contact for more questions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="max-w-3xl mx-auto mt-12 text-center"
            >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                    <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        If you couldn't find the answer to your question, feel free to contact us directly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="outline" className="gap-2">
                            <MessageCircle className="w-4 h-4" />
                            <span>Live Chat</span>
                        </Button>
                        <Button className="gap-2">
                            <PlusCircle className="w-4 h-4" />
                            <span>Ask a Question</span>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FaqsSection; 