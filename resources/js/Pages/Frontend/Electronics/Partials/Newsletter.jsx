import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Alert, AlertDescription } from '@/Components/ui/alert';

const Newsletter = ({ data = {} }) => {
    const { 
        title = "Subscribe to Our Newsletter", 
        subtitle = "Stay updated with the latest products, exclusive offers, and tech news.",
        bgColor = "bg-gray-100 dark:bg-gray-800", 
        inputPlaceholder = "Enter your email",
        buttonText = "Subscribe" 
    } = data;

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Reset status
        setStatus(null);
        
        // Validate email
        if (!email.trim()) {
            setStatus('error');
            setMessage('Please enter your email address.');
            return;
        }
        
        if (!validateEmail(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }
        
        // Simulate API call
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            setStatus('success');
            setMessage('Thank you for subscribing to our newsletter!');
            setEmail("");
            
            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus(null);
                setMessage("");
            }, 5000);
        }, 1500);
    };

    return (
        <section className={cn("py-16", bgColor)}>
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 
                                 rounded-full text-sm font-medium mb-4"
                    >
                        <Bell className="h-4 w-4" />
                        <span>Stay Updated</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        {title}
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 mb-8"
                    >
                        {subtitle}
                    </motion.p>
                    
                    {/* Newsletter Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
                    >
                        <div className="relative flex-grow">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="email"
                                placeholder={inputPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12 rounded-full border-gray-200 dark:border-gray-700"
                                disabled={loading || status === 'success'}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="default"
                            className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white"
                            disabled={loading || status === 'success'}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : status === 'success' ? (
                                <span className="flex items-center">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Subscribed
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Send className="mr-2 h-4 w-4" />
                                    {buttonText}
                                </span>
                            )}
                        </Button>
                    </motion.form>
                    
                    {/* Status Messages */}
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                        >
                            <Alert 
                                variant={status === 'success' ? 'default' : 'destructive'}
                                className={cn(
                                    "text-sm border-0 bg-opacity-10",
                                    status === 'success' 
                                        ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                                        : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                )}
                            >
                                {status === 'success' ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                )}
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                    
                    {/* Privacy Note */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-xs text-gray-500 dark:text-gray-400 mt-4"
                    >
                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter; 