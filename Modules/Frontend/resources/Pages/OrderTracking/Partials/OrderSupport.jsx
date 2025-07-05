import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Check,
    HelpCircle,
    Clock
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

const OrderSupport = ({ supportInfo = {}, faqs = [] }) => {
    const [expanded, setExpanded] = useState(null);
    const [supportForm, setSupportForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Handle FAQ toggle
    const toggleFaq = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSupportForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle support form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);

            // Reset form
            setSupportForm({
                name: '',
                email: '',
                message: ''
            });

            // Reset submission status after 5 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Support Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Need Help?</h2>

                    {/* Contact Methods */}
                    <div className="space-y-4 mb-6">
                        {supportInfo?.phone && (
                            <div className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                                <div className="bg-primary/10 rounded-full p-2 mr-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Call Support</h3>
                                    <p className="text-sm text-gray-500">{supportInfo.phone}</p>
                                </div>
                            </div>
                        )}

                        {supportInfo?.email && (
                            <div className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                                <div className="bg-primary/10 rounded-full p-2 mr-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Email Support</h3>
                                    <p className="text-sm text-gray-500">{supportInfo.email}</p>
                                </div>
                            </div>
                        )}

                        {supportInfo?.chat && (
                            <div className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors">
                                <div className="bg-primary/10 rounded-full p-2 mr-3">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Live Chat</h3>
                                    <p className="text-sm text-gray-500">
                                        {supportInfo.chat.available ? 'Available Now' : 'Currently Unavailable'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hours */}
                    {supportInfo?.hours && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Support Hours
                            </h3>
                            <div className="text-sm text-gray-500 space-y-1">
                                {Object.entries(supportInfo.hours).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between">
                                        <span className="capitalize">{day}</span>
                                        <span>{hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Support Note */}
                    {supportInfo?.note && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    {supportInfo.note}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Contact Form & FAQs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
                <div className="p-6">
                    {/* Form Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-6">Contact Support</h2>

                        {submitted ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <Check className="w-5 h-5 mr-2" />
                                    <h3 className="font-medium">Support Request Submitted</h3>
                                </div>
                                <p className="text-sm">
                                    Thank you for contacting us. We'll get back to you as soon as possible.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                                            Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={supportForm.name}
                                            onChange={handleInputChange}
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={supportForm.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={supportForm.message}
                                        onChange={handleInputChange}
                                        placeholder="Please describe your issue..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* FAQs Section */}
                    <div>
                        <div className="flex items-center mb-6">
                            <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
                        </div>

                        <div className="space-y-4">
                            {faqs?.length > 0 ? (
                                faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden",
                                            expanded === index && "bg-gray-50 dark:bg-gray-800/80"
                                        )}
                                    >
                                        <button
                                            className="w-full flex justify-between items-center p-4 text-left"
                                            onClick={() => toggleFaq(index)}
                                        >
                                            <h3 className="font-medium">{faq.question}</h3>
                                            {expanded === index ? (
                                                <ChevronUp className="w-5 h-5 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 flex-shrink-0" />
                                            )}
                                        </button>

                                        <AnimatePresence>
                                            {expanded === index && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: 'auto' }}
                                                    exit={{ height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 text-gray-600 dark:text-gray-400 text-sm">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <p className="text-gray-500">No FAQs available at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSupport; 