import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';

const RelatedPosts = ({ posts }) => {
    if (!posts?.length) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Related Posts</h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                    >
                        {/* Image */}
                        <Link 
                            href={route('frontend.blog.single', post.slug)}
                            className="block aspect-[16/9] overflow-hidden"
                        >
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className={cn(
                                        "w-full h-full object-cover",
                                        "transition duration-300 group-hover:scale-105"
                                    )}
                                />
                            )}
                        </Link>

                        {/* Content */}
                        <div className="p-4">
                            {/* Categories */}
                            {post.categories?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {post.categories.map(category => (
                                        <Badge
                                            key={category.id}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                <Link href={route('frontend.blog.single', post.slug)}>
                                    {post.title}
                                </Link>
                            </h3>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                                    </span>
                                </div>
                                {post.reading_time && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.reading_time} min read</span>
                                    </div>
                                )}
                            </div>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Read More Button */}
                            <Button
                                variant="ghost"
                                className="w-full justify-between group/btn"
                                asChild
                            >
                                <Link href={route('frontend.blog.single', post.slug)}>
                                    Read More
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts; 