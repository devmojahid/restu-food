import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { 
    Search, 
    ChevronDown, 
    HelpCircle, 
    Plus, 
    Minus, 
    ArrowRight,
    MessageCircle,
    Phone,
    Mail
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

const accordionAnimation = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] } }
};

const Faq = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [openItems, setOpenItems] = useState({});
    const [recentSearches, setRecentSearches] = useState([]);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('faqSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save search to recent searches
    const saveSearch = (query) => {
        if (query.trim()) {
            const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('faqSearches', JSON.stringify(updated));
        }
    };

    // Filter questions based on search query
    const filteredCategories = data.categories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    const handleItemClick = (itemKey) => {
        setOpenItems(prev => ({
            ...prev,
            [itemKey]: !prev[itemKey]
        }));
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        saveSearch(query);
        setShowSearchSuggestions(false);
    };

    // Quick contact options
    const contactOptions = [
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Chat with our support team',
            action: 'Start Chat',
            href: '#chat'
        },
        {
            icon: Phone,
            title: 'Call Us',
            description: '24/7 Support Available',
            action: 'Call Now',
            href: 'tel:+1234567890'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help via email',
            action: 'Send Email',
            href: 'mailto:support@example.com'
        }
    ];

    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-900/50" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />

            <div className="container mx-auto px-4 relative">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform cursor-pointer"
                    >
                        <HelpCircle className="w-10 h-10" />
                    </motion.div>
                    <motion.h2 
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {data.title}
                    </motion.h2>
                    <motion.p 
                        className="text-gray-600 dark:text-gray-400 text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {data.description}
                    </motion.p>
                </motion.div>

                {/* Enhanced Search with Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-colors" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                            <Input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSearchSuggestions(true)}
                                className={cn(
                                    "w-full pl-12 pr-4 h-14",
                                    "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                                    "border-2 border-gray-200 dark:border-gray-700",
                                    "rounded-xl",
                                    "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    "text-lg placeholder:text-gray-400",
                                    "transition-all duration-200",
                                    "hover:border-primary/50"
                                )}
                            />
                            
                            {/* Search Suggestions Dropdown */}
                            <AnimatePresence>
                                {showSearchSuggestions && recentSearches.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                                    >
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                Recent Searches
                                            </div>
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSearch(search)}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors flex items-center justify-between group"
                                                >
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {search}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Content */}
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Categories */}
                    {filteredCategories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: [0.04, 0.62, 0.23, 0.98] 
                            }}
                            className={cn(
                                "bg-white dark:bg-gray-800 rounded-2xl",
                                "shadow-lg border border-gray-200 dark:border-gray-700",
                                "overflow-hidden group",
                                "hover:border-primary/50 transition-all duration-300",
                                "hover:shadow-xl hover:scale-[1.01]"
                            )}
                        >
                            <motion.button
                                className={cn(
                                    "w-full px-6 py-4",
                                    "flex items-center justify-between",
                                    "bg-gray-50 dark:bg-gray-800/50",
                                    "transition-all duration-300",
                                    "group-hover:bg-primary/5",
                                    activeCategory === category.name && "bg-primary/10"
                                )}
                                onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                                whileHover={{ backgroundColor: "rgba(var(--primary), 0.1)" }}
                                whileTap={{ scale: 0.995 }}
                            >
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {category.name}
                                </span>
                                <motion.div
                                    animate={{ rotate: activeCategory === category.name ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <ChevronDown className="w-6 h-6 text-primary" />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence mode="wait">
                                {(activeCategory === category.name || searchQuery) && (
                                    <motion.div
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={accordionAnimation}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="p-6 space-y-4">
                                            {category.questions.map((item, qIndex) => (
                                                <motion.div
                                                    key={qIndex}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ 
                                                        delay: qIndex * 0.1,
                                                        duration: 0.3,
                                                        ease: "easeOut"
                                                    }}
                                                    className={cn(
                                                        "rounded-xl overflow-hidden",
                                                        "border border-gray-200 dark:border-gray-700",
                                                        "transition-all duration-300",
                                                        "hover:border-primary/50",
                                                        "group/item",
                                                        openItems[`${index}-${qIndex}`] && [
                                                            "border-primary",
                                                            "shadow-lg",
                                                            "scale-[1.02]"
                                                        ]
                                                    )}
                                                >
                                                    <motion.button
                                                        className={cn(
                                                            "w-full px-6 py-4",
                                                            "flex items-center justify-between",
                                                            "text-left",
                                                            "transition-all duration-300",
                                                            "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                                                            openItems[`${index}-${qIndex}`] && "bg-primary/5"
                                                        )}
                                                        onClick={() => handleItemClick(`${index}-${qIndex}`)}
                                                        whileHover={{ backgroundColor: "rgba(var(--primary), 0.05)" }}
                                                        whileTap={{ scale: 0.995 }}
                                                    >
                                                        <span className="font-medium text-gray-900 dark:text-white group-hover/item:text-primary transition-colors">
                                                            {item.question}
                                                        </span>
                                                        <motion.div
                                                            animate={{ 
                                                                rotate: openItems[`${index}-${qIndex}`] ? 180 : 0,
                                                                scale: openItems[`${index}-${qIndex}`] ? 1.1 : 1
                                                            }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        >
                                                            {openItems[`${index}-${qIndex}`] ? (
                                                                <Minus className="w-5 h-5 text-primary" />
                                                            ) : (
                                                                <Plus className="w-5 h-5 text-primary" />
                                                            )}
                                                        </motion.div>
                                                    </motion.button>

                                                    <AnimatePresence mode="wait">
                                                        {openItems[`${index}-${qIndex}`] && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ 
                                                                    height: "auto", 
                                                                    opacity: 1,
                                                                    transition: {
                                                                        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                                                                        opacity: { duration: 0.25, delay: 0.15 }
                                                                    }
                                                                }}
                                                                exit={{ 
                                                                    height: 0, 
                                                                    opacity: 0,
                                                                    transition: {
                                                                        height: { duration: 0.3, ease: "easeInOut" },
                                                                        opacity: { duration: 0.2 }
                                                                    }
                                                                }}
                                                                className="overflow-hidden"
                                                            >
                                                                <motion.div
                                                                    initial={{ y: 10, opacity: 0 }}
                                                                    animate={{ y: 0, opacity: 1 }}
                                                                    exit={{ y: -10, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="px-6 pb-4"
                                                                >
                                                                    <p className={cn(
                                                                        "text-gray-600 dark:text-gray-400",
                                                                        "prose prose-gray dark:prose-invert",
                                                                        "max-w-none",
                                                                        "transition-all duration-300"
                                                                    )}>
                                                                        {item.answer}
                                                                    </p>
                                                                </motion.div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                    {/* Enhanced No Results Message */}
                    <AnimatePresence>
                        {searchQuery && filteredCategories.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <HelpCircle className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    No results found for "<span className="text-primary font-medium">{searchQuery}</span>"
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 mt-2 mb-6">
                                    Try searching with different keywords
                                </p>

                                {/* Quick Contact Options */}
                                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                    {contactOptions.map((option, index) => (
                                        <motion.a
                                            key={index}
                                            href={option.href}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={cn(
                                                "p-4 rounded-xl",
                                                "bg-gray-50 dark:bg-gray-700/50",
                                                "border border-gray-200 dark:border-gray-600",
                                                "hover:border-primary/50 hover:bg-primary/5",
                                                "transition-all duration-200",
                                                "group"
                                            )}
                                        >
                                            <option.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                                {option.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                {option.description}
                                            </p>
                                            <span className="text-primary text-sm font-medium group-hover:underline">
                                                {option.action}
                                            </span>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Faq; 