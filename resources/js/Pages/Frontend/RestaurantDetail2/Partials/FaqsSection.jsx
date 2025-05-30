import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Search,
    PlusCircle,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { useForm } from '@inertiajs/react';

const FaqsSection = ({ faqs = null }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItems, setOpenItems] = useState({});
    const [showAskDialog, setShowAskDialog] = useState(false);

    // Inertia form for question submission
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        question: ''
    });

    // If faqs is null or empty, display placeholder message
    if (!faqs || (!faqs.categories?.length && !faqs.items?.length)) {
        return (
            <section id="faqs" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No FAQs Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We're currently compiling answers to common questions. Please check back later or contact us directly for any inquiries.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Toggle FAQ item
    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Filter FAQs based on search query
    const filterFaqs = (items) => {
        if (!searchQuery.trim()) return items;

        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        );
    };

    // Handle question submission
    const handleSubmitQuestion = (e) => {
        e.preventDefault();

        // Simulate API call
        setTimeout(() => {
            setShowAskDialog(false);
            reset();

            // Show success message (in a real app, you would handle this differently)
            alert('Your question has been submitted. We will get back to you soon!');
        }, 1000);
    };

    // Render FAQ items by category or as a flat list
    const renderFaqs = () => {
        // If organized by categories
        if (faqs.categories && faqs.categories.length > 0) {
            return (
                <div className="space-y-8">
                    {faqs.categories.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                {category.icon && (
                                    <span className="text-primary">{category.icon}</span>
                                )}
                                {category.name}
                            </h3>

                            <div className="space-y-3">
                                {filterFaqs(category.items).map((item, itemIndex) => (
                                    <FaqItem
                                        key={`${categoryIndex}-${itemIndex}`}
                                        id={`${categoryIndex}-${itemIndex}`}
                                        item={item}
                                        isOpen={openItems[`${categoryIndex}-${itemIndex}`]}
                                        toggleItem={toggleItem}
                                    />
                                ))}

                                {filterFaqs(category.items).length === 0 && (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                        No matching FAQs in this category
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // If flat list of FAQs
        return (
            <div className="space-y-3">
                {filterFaqs(faqs.items).map((item, index) => (
                    <FaqItem
                        key={index}
                        id={index}
                        item={item}
                        isOpen={openItems[index]}
                        toggleItem={toggleItem}
                    />
                ))}

                {filterFaqs(faqs.items).length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                        <p>No FAQs match your search. Try different keywords or ask a new question.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section id="faqs" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-primary" />
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Find answers to common questions about our restaurant, menu, and services
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Search and Ask */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search FAQs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Button
                            onClick={() => setShowAskDialog(true)}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Ask a Question
                        </Button>
                    </div>

                    {/* FAQ Items */}
                    {renderFaqs()}

                    {/* Contact For More Questions */}
                    <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 text-center shadow-md">
                        <MessageSquare className="w-10 h-10 mx-auto text-primary mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Still Have Questions?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
                            If you couldn't find the answer you were looking for, please feel free to contact us directly.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {faqs.contactEmail && (
                                <a
                                    href={`mailto:${faqs.contactEmail}`}
                                    className="inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    Email Us
                                </a>
                            )}
                            {faqs.contactPhone && (
                                <a
                                    href={`tel:${faqs.contactPhone}`}
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                >
                                    Call Us
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ask a Question Dialog */}
                <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Ask a Question</DialogTitle>
                            <DialogDescription>
                                Submit your question and we'll get back to you as soon as possible.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmitQuestion} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Your email"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="question">Your Question <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="question"
                                    value={data.question}
                                    onChange={(e) => setData('question', e.target.value)}
                                    placeholder="Type your question here..."
                                    rows={4}
                                    required
                                />
                                {errors.question && (
                                    <p className="text-red-500 text-sm">{errors.question}</p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAskDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Question'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

// FAQ Item Component
const FaqItem = ({ id, item, isOpen, toggleItem }) => {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={() => toggleItem(id)}
            className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden"
        >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left focus:outline-none">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.question}</h4>
                <div className="flex-shrink-0 ml-2">
                    {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                    >
                        {typeof item.answer === 'string' ? (
                            <p>{item.answer}</p>
                        ) : (
                            item.answer
                        )}
                    </motion.div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

export default FaqsSection; 