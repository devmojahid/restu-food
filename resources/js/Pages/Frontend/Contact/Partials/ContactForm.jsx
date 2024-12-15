import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, User, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const ContactForm = () => {
    const { toast } = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast({
                title: "Success!",
                description: flash.success,
                variant: "success",
            });
        }
        if (flash.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('contact.submit'), {
            onSuccess: () => {
                toast({
                    title: "Message Sent!",
                    description: "We'll get back to you as soon as possible.",
                    variant: "success",
                });
                reset();
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to send message. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    const inputClasses = (error) => cn(
        "h-12 w-full px-4",
        "bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700",
        "rounded-xl",
        "transition-all duration-200",
        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "dark:focus:ring-primary/20 dark:focus:border-primary",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        error && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
    );

    const formFields = [
        {
            id: 'name',
            label: 'Your Name',
            type: 'text',
            placeholder: 'John Doe',
            icon: User,
            required: true
        },
        {
            id: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'john@example.com',
            icon: Mail,
            required: true
        },
        {
            id: 'subject',
            label: 'Subject',
            type: 'text',
            placeholder: 'How can we help?',
            icon: MessageSquare,
            required: true
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            id="contact-form"
            className={cn(
                "relative p-4 md:p-8 rounded-2xl",
                "bg-white dark:bg-gray-900/50",
                "border border-gray-100 dark:border-gray-800",
                "shadow-lg backdrop-blur-sm",
                "hover:border-primary/20 dark:hover:border-primary/20",
                "transition-all duration-300",
                "w-full max-w-full"
            )}
        >
            <div className="mb-8">
                <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
                >
                    Send Us a Message
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 dark:text-gray-400"
                >
                    Fill out the form below and we'll get back to you as soon as possible.
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6 md:space-y-4">
                    {formFields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 1) }}
                            className="w-full"
                        >
                            <label 
                                htmlFor={field.id}
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                    <field.icon className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id={field.id}
                                    name={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={data[field.id]}
                                    onChange={e => setData(field.id, e.target.value)}
                                    className={cn(
                                        "h-12",
                                        "bg-gray-50 dark:bg-gray-800/50",
                                        "border-gray-200 dark:border-gray-700",
                                        "focus:border-primary/50 dark:focus:border-primary/50",
                                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                        "pl-12",
                                        "pr-4",
                                        "text-base",
                                        "placeholder:text-base",
                                        errors[field.id] && "border-red-500 focus:ring-red-500/20"
                                    )}
                                    style={{ 
                                        paddingLeft: "3rem"
                                    }}
                                    aria-label={field.label}
                                    aria-invalid={errors[field.id] ? "true" : "false"}
                                    aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                                    required={field.required}
                                />
                                <AnimatePresence>
                                    {errors[field.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center space-x-2 mt-2 text-red-500"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <p id={`${field.id}-error`} className="text-sm" role="alert">
                                                {errors[field.id]}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label 
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="message"
                            placeholder="Your message here..."
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            className={cn(
                                "min-h-[150px] resize-none",
                                "p-4",
                                "text-base",
                                "placeholder:text-base",
                                "bg-gray-50 dark:bg-gray-800/50",
                                "border-gray-200 dark:border-gray-700",
                                "focus:border-primary/50 dark:focus:border-primary/50",
                                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                                errors.message && "border-red-500 focus:ring-red-500/20"
                            )}
                            required
                        />
                        <AnimatePresence>
                            {errors.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center space-x-2 mt-2 text-red-500"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-sm" role="alert">{errors.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button 
                        type="submit" 
                        className={cn(
                            "w-full h-12 text-base",
                            "bg-primary hover:bg-primary/90 dark:hover:bg-primary/80",
                            "text-white",
                            "shadow-lg hover:shadow-primary/25",
                            "transition-all duration-300",
                            processing && "opacity-80"
                        )}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Send Message</span>
                            </>
                        )}
                    </Button>
                </motion.div>
            </form>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl animate-pulse" />
        </motion.div>
    );
};

export default ContactForm; 