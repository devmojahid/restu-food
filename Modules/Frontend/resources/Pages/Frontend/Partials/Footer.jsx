import React from 'react';
import { Link } from '@inertiajs/react';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Youtube,
    MapPin,
    Phone,
    Mail,
    Clock,
    ChevronRight,
    Loader2,
    ArrowRight,
    Lock,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import { useToast } from "@/Components/ui/use-toast";
import SocialLink from '@/Components/Frontend/SocialLink';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const Footer = () => {
    const { data, setData, post, processing, reset } = useForm({
        email: '',
    });
    const { toast } = useToast();
    const { theme } = useTheme();

    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'FAQ', href: '/faq' },
    ];

    const categories = [
        { name: 'Pizza', href: '/menu/pizza', count: '250+ items' },
        { name: 'Burger', href: '/menu/burger', count: '180+ items' },
        { name: 'Sushi', href: '/menu/sushi', count: '120+ items' },
        { name: 'Pasta', href: '/menu/pasta', count: '150+ items' },
        { name: 'Desserts', href: '/menu/desserts', count: '100+ items' },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Follow us on Facebook' },
        { icon: Twitter, href: '#', label: 'Follow us on Twitter' },
        { icon: Instagram, href: '#', label: 'Follow us on Instagram' },
        { icon: Youtube, href: '#', label: 'Subscribe to our Youtube channel' },
    ];

    const contactInfo = [
        {
            icon: MapPin,
            label: 'Address',
            value: '71 Madison Ave, New York, NY 10013',
            href: 'https://maps.google.com/?q=71+Madison+Ave,+New+York,+NY+10013'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+1 718-904-4450',
            href: 'tel:+17189044450'
        },
        {
            icon: Mail,
            label: 'Email',
            value: 'info@poco.com',
            href: 'mailto:info@poco.com'
        },
        {
            icon: Clock,
            label: 'Working Hours',
            value: 'Open: 8:00 AM - 10:00 PM',
            href: null
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('newsletter.subscribe'), {
            onSuccess: () => {
                toast({
                    title: "Success!",
                    description: "Thank you for subscribing to our newsletter.",
                    variant: "success",
                });
                reset('email');
            },
            onError: (errors) => {
                toast({
                    title: "Error",
                    description: errors.email || "Failed to subscribe. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    // Smoother, lighter animation variants
    const fadeInUp = {
        initial: { 
            opacity: 0, 
            y: 5 // Reduced from 10 for subtler animation
        },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3, // Reduced from 0.4
                ease: "easeOut"
            }
        }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.05 // Reduced from 0.1
            }
        }
    };

    // Enhanced newsletter section with fixed spacing
    const NewsletterSection = () => (
        <div className={cn(
            "relative border-b",
            "dark:border-gray-800 border-gray-200",
            "bg-gray-50 dark:bg-gray-900/50"
        )}>
            <div className="container mx-auto px-4 py-12">
                <motion.div 
                    className="max-w-3xl mx-auto text-center"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <motion.h2 
                        variants={fadeInUp}
                        className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        Subscribe to Our Newsletter
                    </motion.h2>

                    <motion.p 
                        variants={fadeInUp}
                        className="text-gray-600 dark:text-gray-400 mb-6"
                    >
                        Get exclusive offers and updates delivered to your inbox
                    </motion.p>

                    <motion.form 
                        variants={fadeInUp}
                        onSubmit={handleSubmit}
                        className="flex max-w-md mx-auto"
                    >
                        <div className="relative flex-1">
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="Enter your email"
                                className={cn(
                                    "h-12 pl-12 pr-4",
                                    "rounded-l-lg rounded-r-none",
                                    "border-r-0",
                                    "bg-white dark:bg-gray-800",
                                    "border-gray-200 dark:border-gray-700",
                                    "text-gray-900 dark:text-white",
                                    "focus:ring-2 focus:ring-primary/50"
                                )}
                                required
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={processing}
                            className={cn(
                                "h-12 px-6",
                                "rounded-r-lg rounded-l-none",
                                "bg-primary hover:bg-primary/90",
                                "text-white font-medium"
                            )}
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Subscribe"
                            )}
                        </Button>
                    </motion.form>

                    <motion.div 
                        variants={fadeInUp}
                        className="flex justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400"
                    >
                        <span className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Secure & Private
                        </span>
                        <span className="flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            No Spam
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );

    // Main footer content with 4 columns
    const MainContent = () => (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {/* Company Info Column */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <Link href="/">
                        <img 
                            src={theme === 'dark' ? "/images/logo-light.png" : "/images/logo.png"}
                            alt="Poco" 
                            className="h-12 w-auto mb-6"
                        />
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Discover the best food and drinks in your area. Order online for fast delivery.
                    </p>
                    <div className="space-y-4">
                        {contactInfo.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div 
                                    key={index}
                                    className="flex items-start space-x-3"
                                    variants={fadeInUp}
                                >
                                    <Icon className="w-5 h-5 text-primary mt-1" />
                                    {item.href ? (
                                        <a 
                                            href={item.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span>{item.value}</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Quick Links Column */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Quick Links
                    </h3>
                    <ul className="space-y-4">
                        {quickLinks.map((link, index) => (
                            <motion.li 
                                key={link.name}
                                variants={fadeInUp}
                            >
                                <Link 
                                    href={link.href}
                                    className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-primary"
                                >
                                    <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                    {link.name}
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Categories Column */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Categories
                    </h3>
                    <ul className="space-y-4">
                        {categories.map((category, index) => (
                            <motion.li 
                                key={category.name}
                                variants={fadeInUp}
                            >
                                <Link 
                                    href={category.href}
                                    className="group flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-primary"
                                >
                                    <span className="flex items-center">
                                        <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                                        {category.name}
                                    </span>
                                    <span className="text-sm text-gray-500">{category.count}</span>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Download App Column */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Download Our App
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Get our mobile app for a better ordering experience
                    </p>
                    <div className="flex flex-col space-y-4">
                        <a 
                            href="#" 
                            className="transition-transform hover:scale-105"
                            aria-label="Download on the App Store"
                        >
                            <img 
                                src="/images/app-store.png" 
                                alt="App Store" 
                                className="h-12"
                            />
                        </a>
                        <a 
                            href="#" 
                            className="transition-transform hover:scale-105"
                            aria-label="Get it on Google Play"
                        >
                            <img 
                                src="/images/google-play.png" 
                                alt="Google Play" 
                                className="h-12"
                            />
                        </a>
                    </div>
                    <div className="mt-8">
                        <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
                            Follow Us
                        </h4>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <SocialLink key={social.label} {...social} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );

    // Update the bottom footer with better dark/light mode support
    const BottomFooter = () => (
        <div className={cn(
            "border-t",
            "dark:border-gray-800/50 border-gray-100/50",
            "bg-gray-950/5 dark:bg-gray-900/50"
        )}>
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-center md:text-left text-gray-600 dark:text-gray-400">
                        © {new Date().getFullYear()} Poco. All rights reserved.
                    </p>
                    <motion.div 
                        className="flex items-center space-x-6 mt-4 md:mt-0"
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {['visa', 'mastercard', 'paypal', 'apple-pay'].map((payment) => (
                            <motion.img
                                key={payment}
                                src={`/images/payment/${payment}.png`}
                                alt={payment}
                                className={cn(
                                    "h-8",
                                    "transition-transform duration-300 ease-out",
                                    "hover:scale-110",
                                    theme === 'dark' ? 'brightness-90' : 'brightness-100'
                                )}
                                variants={fadeInUp}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );

    return (
        <footer 
            className={cn(
                "bg-white dark:bg-gray-900",
                "text-gray-600 dark:text-gray-400",
                "transition-colors duration-200"
            )} 
            role="contentinfo"
        >
            <NewsletterSection />
            <MainContent />
            <BottomFooter />
        </footer>
    );
};

export default Footer; 