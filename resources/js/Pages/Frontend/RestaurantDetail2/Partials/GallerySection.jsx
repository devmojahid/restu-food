import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Image as ImageIcon,
    Filter,
    Download,
    Instagram,
    Heart,
    Share2,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { AlertCircle } from 'lucide-react';

const GallerySection = ({ gallery = null }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // If gallery is null or empty, display placeholder message
    if (!gallery || !gallery.images || gallery.images.length === 0) {
        return (
            <section id="gallery" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Gallery</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Images Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We're currently updating our gallery. Check back soon to see beautiful photos of our venue and dishes.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Get unique categories from gallery images
    const categories = ['all', ...new Set(gallery.images.map(image => image.category))];

    // Filter images based on active category
    const filteredImages = activeFilter === 'all'
        ? gallery.images
        : gallery.images.filter(image => image.category === activeFilter);

    // Open lightbox with selected image
    const openLightbox = (image) => {
        setSelectedImage(image);
        setLightboxOpen(true);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    const closeLightbox = () => {
        setLightboxOpen(false);
        // Re-enable scrolling when lightbox is closed
        document.body.style.overflow = 'auto';
    };

    // Navigate to next/previous image in lightbox
    const navigateLightbox = (direction) => {
        const currentIndex = gallery.images.findIndex(img => img.id === selectedImage.id);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % gallery.images.length;
        } else {
            newIndex = (currentIndex - 1 + gallery.images.length) % gallery.images.length;
        }

        setSelectedImage(gallery.images[newIndex]);
    };

    // Handle keyboard navigation in lightbox
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            switch (e.key) {
                case 'ArrowRight':
                    navigateLightbox('next');
                    break;
                case 'ArrowLeft':
                    navigateLightbox('prev');
                    break;
                case 'Escape':
                    closeLightbox();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, selectedImage]);

    // Lightbox component
    const Lightbox = () => (
        <AnimatePresence>
            {lightboxOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="relative max-w-5xl w-full max-h-[90vh] bg-transparent rounded-xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative h-full">
                            <img
                                src={selectedImage?.url}
                                alt={selectedImage?.caption || 'Gallery image'}
                                className="w-full h-full object-contain"
                            />

                            {/* Caption */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                <h3 className="text-white text-lg font-medium">{selectedImage?.caption}</h3>
                                {selectedImage?.description && (
                                    <p className="text-white/80 text-sm mt-1">{selectedImage.description}</p>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                                    onClick={closeLightbox}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Navigation arrows */}
                            <Button
                                variant="ghost"
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateLightbox('prev');
                                }}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>

                            <Button
                                variant="ghost"
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateLightbox('next');
                                }}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>

                            {/* Actions */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Gallery image component
    const GalleryImage = ({ image, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
                "relative group overflow-hidden rounded-xl cursor-pointer",
                image.span === 'wide' ? 'col-span-2' : 'col-span-1',
                image.span === 'tall' ? 'row-span-2' : 'row-span-1',
                "shadow-sm hover:shadow-lg transition-shadow duration-300"
            )}
            onClick={() => openLightbox(image)}
        >
            <img
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Category badge */}
            <Badge
                className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm text-white border-none"
            >
                {image.category}
            </Badge>

            {/* Caption and controls on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-medium truncate">{image.caption}</h3>

                <div className="flex justify-between items-center mt-2">
                    <p className="text-white/80 text-sm truncate max-w-[200px]">
                        {image.description}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle like action
                            }}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle maximize action
                                openLightbox(image);
                            }}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <section id="gallery" className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-primary" />
                            {gallery.title || "Photo Gallery"}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {gallery.description || "Explore our beautiful venue and delicious dishes through our photo gallery"}
                        </p>
                    </div>

                    {gallery.instagramUsername && (
                        <a
                            href={`https://instagram.com/${gallery.instagramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-primary hover:text-primary/90 font-medium transition-colors"
                        >
                            <Instagram className="w-5 h-5" />
                            <span>@{gallery.instagramUsername}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {/* Filter buttons */}
                {categories.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={activeFilter === category ? "default" : "outline"}
                                size="sm"
                                className="rounded-full"
                                onClick={() => setActiveFilter(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Gallery grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <AnimatePresence>
                        {filteredImages.map((image, index) => (
                            <GalleryImage key={image.id} image={image} index={index} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* View all button */}
                {gallery.viewMoreLink && (
                    <div className="text-center mt-8">
                        <a
                            href={gallery.viewMoreLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                        >
                            <span>View More on Instagram</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <Lightbox />
        </section>
    );
};

export default GallerySection; 