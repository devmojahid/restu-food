import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Tag, ChevronRight } from 'lucide-react';

const SpecialOffers = ({ offers }) => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Special Offers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't miss out on these amazing deals and discounts
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {offers?.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            {/* Background Image with Gradient Overlay */}
                            <div className="relative h-48">
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                
                                {/* Discount Badge */}
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {offer.discount}% OFF
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2">
                                    {offer.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {offer.description}
                                </p>

                                {/* Offer Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Tag className="h-4 w-4 mr-2" />
                                        <span>Code: <span className="font-semibold">{offer.code}</span></span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span>Valid until {offer.valid_until}</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={`/offers/${offer.id}`}
                                    className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors group"
                                >
                                    <span>Claim Offer</span>
                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/offers"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>View All Offers</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers; 