import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Camera, ChevronLeft, ChevronRight, Download, ImageOff } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NoData from '@/Components/ui/no-data';

const GallerySection = ({ gallery = [] }) => {
    const [filter, setFilter] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const filterOptions = [
        { value: 'all', label: 'All Photos' },
        { value: 'food', label: '🍽️ Food' },
        { value: 'interior', label: '🏠 Interior' },
        { value: 'ambience', label: '✨ Ambience' },
        { value: 'events', label: '🎉 Events' }
    ];

    const images = Array.isArray(gallery) 
        ? gallery.filter(img => img?.url || img?.image)
        : [];

    if (images.length === 0) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Gallery
                    </h2>
                    <NoData
                        icon={ImageOff}
                        title="No Photos Available"
                        description="This restaurant hasn't uploaded any photos yet. Check back later for visual updates!"
                    />
                </div>
            </section>
        );
    }

    const filteredGallery = images.filter(item => 
        filter === 'all' ? true : item.type === filter
    );

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setLightboxOpen(true);
    };

    const handleNext = useCallback(() => {
        const currentIndex = images.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % images.length;
        setSelectedImage(images[nextIndex]);
    }, [selectedImage, images]);

    const handlePrevious = useCallback(() => {
        const currentIndex = images.findIndex(img => img.id === selectedImage.id);
        const previousIndex = (currentIndex - 1 + images.length) % images.length;
        setSelectedImage(images[previousIndex]);
    }, [selectedImage, images]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrevious();
        if (e.key === 'Escape') setLightboxOpen(false);
    }, [handleNext, handlePrevious]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
        >
            {/* Gallery Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {images.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Photos
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {images.filter(item => item.type === 'food').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Food Photos
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {images.filter(item => item.type === 'interior').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Interior Photos
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {images.filter(item => item.type === 'events').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Event Photos
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                {filterOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={filter === option.value ? "default" : "outline"}
                        onClick={() => setFilter(option.value)}
                        className="flex-none"
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGallery.map((image) => (
                    <motion.div
                        key={image.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                            "relative group cursor-pointer",
                            "aspect-square rounded-xl overflow-hidden",
                            "bg-gray-100 dark:bg-gray-800"
                        )}
                        onClick={() => handleImageClick(image)}
                    >
                        <img
                            src={image.url}
                            alt={image.caption}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <p className="text-sm font-medium line-clamp-2">
                                    {image.caption}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <button
                                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                                onClick={() => setLightboxOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrevious();
                                }}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>

                            {/* Image */}
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="relative max-w-5xl w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.caption}
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                />
                                
                                {/* Caption */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white rounded-b-lg">
                                    <p className="text-lg font-medium mb-1">
                                        {selectedImage.caption}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span>{selectedImage.type}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:text-white/80"
                                            onClick={() => window.open(selectedImage.url, '_blank')}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GallerySection; 