import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

const PostHeader = ({ post }) => {
    return (
        <header className="space-y-6">
            {/* Category */}
            <div className="flex items-center gap-2">
                <Badge variant="secondary">
                    {post.category.name}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.reading_time} min read
                </span>
            </div>

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
                {post.title}
            </motion.h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>By {post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments_count} comments</span>
                </div>
            </div>

            {/* Featured Image */}
            <motion.figure
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-[21/9] overflow-hidden rounded-2xl"
            >
                <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                {post.image_caption && (
                    <figcaption className="absolute bottom-0 left-0 right-0 p-4
                                         bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-sm">
                            {post.image_caption}
                        </p>
                    </figcaption>
                )}
            </motion.figure>
        </header>
    );
};

export default PostHeader; 