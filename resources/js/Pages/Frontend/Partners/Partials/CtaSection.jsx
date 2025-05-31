import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

const CtaSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Ready to Get Started?';
    const description = data?.description || 'Join our platform today and start growing your business.';
    const primaryButton = data?.primary_button || { text: 'Apply Now', link: '#apply-form' };
    const secondaryButton = data?.secondary_button || { text: 'Learn More', link: '#how-it-works' };
    const image = data?.image || '/images/default-cta.jpg';

    return (
        <section className="py-20 bg-gray-900 text-white overflow-hidden" id="apply">
            <div className="container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />

                    {/* Content */}
                    <div className="relative p-12 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-8 md:mb-0 md:max-w-lg">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-4"
                            >
                                {title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-white/80 text-lg"
                            >
                                {description}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 group"
                                asChild
                            >
                                <Link href={primaryButton.link}>
                                    {primaryButton.text}
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10 rounded-full px-8"
                                asChild
                            >
                                <Link href={secondaryButton.link}>
                                    {secondaryButton.text}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Form */}
                <div className="mt-12 max-w-3xl mx-auto" id="apply-form">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                            Apply Now
                        </h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        placeholder="+1 (123) 456-7890"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Company/Restaurant Name
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        placeholder="Your Business Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tell us about yourself
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    placeholder="Share more details about your business or experience..."
                                ></textarea>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                                </label>
                            </div>

                            <div className="text-center">
                                <Button type="submit" size="lg" className="rounded-full px-8">
                                    Submit Application
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CtaSection; 