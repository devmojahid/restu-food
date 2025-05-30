import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';

const GallerySection = ({ gallery }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredImages = selectedCategory === 'All'
        ? gallery?.images
        : gallery?.images?.filter(image => image.category === selectedCategory);

    const openLightbox = (image) => {
        setSelectedImage(image);
        // Prevent body scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        // Restore body scrolling
        document.body.style.overflow = 'auto';
    };

    const goToNextImage = () => {
        if (!filteredImages || filteredImages.length === 0) return;

        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setSelectedImage(filteredImages[nextIndex]);
    };

    const goToPrevImage = () => {
        if (!filteredImages || filteredImages.length === 0) return;

        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage(filteredImages[prevIndex]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goToNextImage();
        if (e.key === 'ArrowLeft') goToPrevImage();
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {gallery?.title || 'Gallery'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {gallery?.description || 'View our restaurant and food photos'}
                    </p>
                </div>
            </div>

            {/* Category Filters */}
            {gallery?.categories?.length > 0 && (
                <div className="mb-6">
                    <ScrollArea>
                        <div className="flex pb-4">
                            <TabsList className="h-10 bg-transparent p-0">
                                <TabsTrigger
                                    value="All"
                                    onClick={() => setSelectedCategory('All')}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium",
                                        selectedCategory === 'All'
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    )}
                                >
                                    All Photos
                                </TabsTrigger>

                                {gallery.categories.filter(cat => cat !== 'All').map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={cn(
                                            "rounded-full px-4 py-2 text-sm font-medium ml-2",
                                            selectedCategory === category
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {category}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}

            {/* Image Gallery */}
            {filteredImages && filteredImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image) => (
                        <motion.div
                            key={image.id}
                            layoutId={`gallery-${image.id}`}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(image)}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img
                                src={image.url}
                                alt={image.caption || 'Gallery image'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                <p className="text-white text-sm font-medium">
                                    {image.caption}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        No gallery images available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Check back soon for photos of our restaurant and dishes.
                    </p>
                </div>
            )}

            {/* Videos Section */}
            {gallery?.videos && gallery.videos.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-6">Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gallery.videos.map((video) => (
                            <div
                                key={video.id}
                                className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video relative group"
                            >
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-16 w-16 rounded-full bg-white/90 text-primary hover:bg-white hover:text-primary/90 border-none"
                                    >
                                        <Play className="h-8 w-8 fill-current" />
                                    </Button>
                                </div>
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
                                    <h4 className="text-white font-medium">{video.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
                        onClick={closeLightbox}
                        onKeyDown={handleKeyDown}
                        tabIndex={0}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
                            onClick={closeLightbox}
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevImage();
                            }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <button
                            className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNextImage();
                            }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Image */}
                        <motion.div
                            layoutId={`gallery-${selectedImage.id}`}
                            className="relative max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.caption || 'Gallery image'}
                                className="max-w-full max-h-[85vh] object-contain"
                            />

                            {/* Caption */}
                            {selectedImage.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                                    <p className="text-lg font-medium">{selectedImage.caption}</p>
                                    {selectedImage.category && (
                                        <p className="text-sm text-white/70">{selectedImage.category}</p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GallerySection; 