import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

const PromoCard = ({ promo, index }) => {
    const { title, description, image, link, bgColor, buttonText } = promo;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "rounded-2xl overflow-hidden shadow-lg relative",
                bgColor || "bg-gradient-to-r from-blue-500 to-indigo-600"
            )}
        >
            <div className="p-8 md:p-10 flex flex-col h-full z-10 relative">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {title}
                </h3>
                
                <p className="text-white/90 mb-6 max-w-md">
                    {description}
                </p>
                
                <div className="mt-auto">
                    <Link href={link || "#"}>
                        <Button 
                            variant="default" 
                            className="bg-white text-primary hover:bg-white/90 rounded-full"
                        >
                            <span>{buttonText || "Learn More"}</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            
            {/* Background Image with Overlay */}
            {image && (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            )}
        </motion.div>
    );
};

const ServiceFeature = ({ icon: Icon, title, description }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start space-x-4"
        >
            <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

const PromoSections = ({ data = [] }) => {
    // Default service features if not provided
    const defaultFeatures = [
        {
            icon: ShieldCheck,
            title: "Secure Shopping",
            description: "We protect your information with advanced encryption and secure payment methods."
        },
        {
            icon: Truck,
            title: "Fast Delivery",
            description: "Free shipping on all orders over $50 with quick and reliable delivery services."
        },
        {
            icon: Clock,
            title: "24/7 Support",
            description: "Our customer service team is available around the clock to assist you."
        },
        {
            icon: CreditCard,
            title: "Flexible Payment",
            description: "Choose from multiple payment options including credit cards and digital wallets."
        }
    ];
    
    // Check if data is empty or not properly formatted
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 space-y-16">
                {/* Promo Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.map((promo, index) => (
                        <PromoCard key={index} promo={promo} index={index} />
                    ))}
                </div>
                
                {/* Service Features */}
                <div className="mt-16">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                        >
                            Why Shop With Us
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            We're committed to providing the best shopping experience with quality products and exceptional service
                        </motion.p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(data.features || defaultFeatures).map((feature, index) => (
                            <ServiceFeature 
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoSections; 