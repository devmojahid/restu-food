import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

const Faq = ({ data = {} }) => {
    const {
        title = 'Frequently Asked Questions',
        description = 'Find answers to common questions about our rewards program.',
        faqs = [],
        contactEmail = 'support@restufood.com',
        contactPhone = '+1 (555) 123-4567'
    } = data;

    // Ensure faqs is an array
    const safeFaqs = Array.isArray(faqs) ? faqs : [];

    // Default FAQs if none provided
    const defaultFaqs = [
        {
            question: 'How do I join the rewards program?',
            answer: 'Joining is easy! You can sign up for our rewards program through our website or mobile app. Just create an account or log in to your existing account and opt in to the rewards program.'
        },
        {
            question: 'How do I earn points?',
            answer: 'You earn points every time you make a purchase. You get 1 point for every $1 you spend. You can also earn bonus points through special promotions, referrals, and on your birthday.'
        },
        {
            question: 'When do my points expire?',
            answer: 'Points expire 12 months after they are earned if not redeemed. Active members who make at least one purchase every 6 months may have their points extended automatically.'
        },
        {
            question: 'How do I redeem my points?',
            answer: 'You can redeem your points through our website or mobile app. Simply log in to your account, go to the rewards section, and choose from the available redemption options.'
        },
        {
            question: 'How do I check my points balance?',
            answer: 'You can check your points balance by logging into your account on our website or mobile app and visiting the rewards section. Your current balance will be displayed on your dashboard.'
        },
        {
            question: 'How do I move up to the next tier?',
            answer: 'You move up to the next tier by earning a certain number of points within a calendar year. Bronze starts at 0 points, Silver at 500 points, Gold at 1,000 points, and Platinum at 2,500 points.'
        },
        {
            question: 'What happens to my tier status at the end of the year?',
            answer: 'Your tier status is evaluated annually. If you maintain the required points threshold, you will remain at your current tier. Otherwise, you may be moved to a lower tier based on your points earned.'
        },
        {
            question: 'Can I transfer my points to someone else?',
            answer: 'Currently, points cannot be transferred between accounts. They are tied to your personal account and can only be redeemed by you.'
        }
    ];

    // Use provided FAQs or fallback to defaults
    const displayFaqs = safeFaqs.length > 0 ? safeFaqs : defaultFaqs;

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1 mb-4 
                                 bg-primary/10 text-primary text-sm font-medium"
                    >
                        Support
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            placeholder="Search frequently asked questions..."
                            className="pl-10 py-6 rounded-full"
                        />
                        <Button
                            className="absolute right-1.5 top-1.5 rounded-full"
                            size="sm"
                        >
                            Search
                        </Button>
                    </div>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {displayFaqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
                            >
                                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left font-medium">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                {/* Contact Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mx-auto mt-12 text-center"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <HelpCircle className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3">Still have questions?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                            If you cannot find the answer to your question in our FAQ, please contact our support team.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Button variant="outline" asChild>
                                <Link href={`mailto:${contactEmail}`} className="flex items-center justify-center gap-2">
                                    <span>Email Support</span>
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="flex items-center justify-center gap-2">
                                    <span>Call Support</span>
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/contact" className="flex items-center justify-center gap-2">
                                    <span>Contact Us</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Faq; 