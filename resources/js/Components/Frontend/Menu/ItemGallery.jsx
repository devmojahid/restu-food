import React from 'react';
import { motion } from 'framer-motion';
import { 
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/Components/ui/carousel";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

const ItemGallery = ({ item, activeImage, onImageChange }) => {
    return (
        <div className="space-y-6">
            <Carousel className="w-full">
                <CarouselContent>
                    <CarouselItem>
                        <motion.div
                            layoutId={`item-image-${item.id}`}
                            className="relative aspect-square rounded-3xl overflow-hidden group"
                        >
                            <img 
                                src={activeImage}
                                alt={item.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            {item.discount && (
                                <div className="absolute top-4 right-4">
                                    <Badge 
                                        variant="destructive"
                                        className="animate-pulse shadow-lg"
                                    >
                                        {item.discount}% OFF
                                    </Badge>
                                </div>
                            )}
                        </motion.div>
                    </CarouselItem>
                    {item.gallery?.map((image, index) => (
                        <CarouselItem key={index}>
                            <motion.div 
                                className="relative aspect-square rounded-3xl overflow-hidden group"
                                onClick={() => onImageChange(image)}
                            >
                                <img 
                                    src={image}
                                    alt={`${item.name} view ${index + 1}`}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                <motion.button
                    onClick={() => onImageChange(item.image)}
                    className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start",
                        activeImage === item.image && "ring-2 ring-primary"
                    )}
                >
                    <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </motion.button>
                {item.gallery?.map((image, index) => (
                    <motion.button
                        key={index}
                        onClick={() => onImageChange(image)}
                        className={cn(
                            "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start",
                            activeImage === image && "ring-2 ring-primary"
                        )}
                    >
                        <img 
                            src={image}
                            alt={`${item.name} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default ItemGallery; 