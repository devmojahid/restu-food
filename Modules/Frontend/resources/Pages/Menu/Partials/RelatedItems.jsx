import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import ItemCard from '@/Components/Frontend/Menu/ItemCard';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const RelatedItems = ({ items }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!items?.length) return null;

    return (
        <section className="py-12">
            {/* Section Header */}
            <div className="container px-4 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            You May Also Like
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Similar items you might enjoy
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        className="hidden md:flex items-center gap-2 hover:text-primary"
                        asChild
                    >
                        <a href="/menu">
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </Button>
                </div>
            </div>

            {/* Items Scroll Area */}
            <ScrollArea className="w-full">
                <div className={cn(
                    "container px-4",
                    "flex space-x-6",
                    isMobile && "snap-x snap-mandatory"
                )}>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "flex-shrink-0",
                                isMobile ? "w-[280px] snap-center" : "w-[300px]"
                            )}
                        >
                            <ItemCard 
                                item={item}
                                index={index}
                                isListView={false}
                            />
                        </motion.div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden md:block" />
            </ScrollArea>

            {/* Mobile View All Button */}
            <div className="container px-4 mt-6 md:hidden">
                <Button
                    variant="outline"
                    className="w-full"
                    asChild
                >
                    <a href="/menu">
                        View All Menu Items
                    </a>
                </Button>
            </div>
        </section>
    );
};

export default RelatedItems; 