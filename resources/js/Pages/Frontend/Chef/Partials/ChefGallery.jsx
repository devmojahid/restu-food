import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefGallery = ({ gallery = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    
    if (!gallery || gallery.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    No gallery images have been added for this chef yet.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Chef Gallery</h2>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map((item, index) => (
                    <GalleryItem 
                        key={item.id || index} 
                        item={item} 
                        index={index}
                        onClick={() => setSelectedImage(item)}
                    />
                ))}
            </div>
            
            {/* Instagram Link */}
            {gallery[0]?.instagram_link && (
                <div className="mt-6 text-center">
                    <Button 
                        asChild
                        variant="outline" 
                        className="rounded-full"
                    >
                        <a 
                            href={gallery[0].instagram_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <Instagram className="w-4 h-4 mr-2" />
                            <span>View more on Instagram</span>
                        </a>
                    </Button>
                </div>
            )}
            
            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <Lightbox 
                        image={selectedImage} 
                        gallery={gallery}
                        onClose={() => setSelectedImage(null)}
                        onNext={() => {
                            const currentIndex = gallery.findIndex(item => 
                                item.id === selectedImage.id);
                            const nextIndex = (currentIndex + 1) % gallery.length;
                            setSelectedImage(gallery[nextIndex]);
                        }}
                        onPrev={() => {
                            const currentIndex = gallery.findIndex(item => 
                                item.id === selectedImage.id);
                            const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
                            setSelectedImage(gallery[prevIndex]);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const GalleryItem = ({ item, index, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <img 
                src={item.image} 
                alt={item.title || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay with Info */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                {item.title && (
                    <h4 className="text-white text-sm font-medium">{item.title}</h4>
                )}
                
                {item.date && (
                    <p className="text-white/80 text-xs">{item.date}</p>
                )}
                
                <div className="absolute top-2 right-2">
                    <Maximize2 className="w-5 h-5 text-white/80" />
                </div>
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 2).map((tag, i) => (
                            <Badge 
                                key={i}
                                variant="secondary" 
                                className="bg-white/20 text-white text-xs"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {item.tags.length > 2 && (
                            <span className="text-white/80 text-xs">+{item.tags.length - 2} more</span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Lightbox = ({ image, gallery, onClose, onNext, onPrev }) => {
    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                onClick={onClose}
            >
                <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            <button 
                className="absolute left-4 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
                className="absolute right-4 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
            >
                <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Image Container */}
            <div 
                className="max-h-[80vh] max-w-[80vw] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={image.image} 
                    alt={image.title || 'Gallery image'}
                    className="max-h-[80vh] max-w-[80vw] object-contain"
                />
                
                {/* Image Caption */}
                {(image.title || image.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                        {image.title && (
                            <h4 className="text-lg font-medium mb-1">{image.title}</h4>
                        )}
                        
                        {image.description && (
                            <p className="text-white/80 text-sm">{image.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center mt-2">
                            {image.date && (
                                <span className="text-white/60 text-xs">{image.date}</span>
                            )}
                            
                            {image.source && (
                                <span className="text-white/60 text-xs">{image.source}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Thumbnails */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
                {gallery.map((item, index) => (
                    <button
                        key={item.id || index}
                        className={cn(
                            "w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2",
                            image.id === item.id 
                                ? "border-white" 
                                : "border-transparent opacity-60 hover:opacity-100"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(item);
                        }}
                    >
                        <img 
                            src={item.thumbnail || item.image} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default ChefGallery; 