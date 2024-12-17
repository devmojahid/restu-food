import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';

const FeaturedPosts = ({ posts }) => {
    if (!posts?.length) return null;

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Featured Posts</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                        Discover our most popular and trending articles
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-200 dark:border-gray-700",
                                "rounded-2xl shadow-lg hover:shadow-xl",
                                "transition-all duration-300"
                            )}
                        >
                            {/* Featured Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <Badge variant="default" className="bg-primary">
                                    Featured
                                </Badge>
                            </div>

                            {/* Image */}
                            <Link 
                                href={route('frontend.blog.single', post.slug)}
                                className="block aspect-[16/9] overflow-hidden"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform 
                                             group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>

                            {/* Content */}
                            <div className="p-6">
                                <Badge 
                                    variant="secondary"
                                    className="mb-4"
                                >
                                    {post.category.name}
                                </Badge>

                                <h3 className="text-xl font-semibold mb-3 
                                             group-hover:text-primary transition-colors">
                                    <Link href={route('frontend.blog.single', post.slug)}>
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {post.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.published_at}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.reading_time} min read</span>
                                    </div>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t 
                                              border-gray-200 dark:border-gray-700">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {post.author.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Author
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedPosts; 