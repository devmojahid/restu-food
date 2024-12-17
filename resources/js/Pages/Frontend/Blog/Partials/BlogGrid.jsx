import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import { Calendar, Clock, User, ArrowRight, Eye, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Pagination } from '@/Components/ui/pagination';
import BlogGridSkeleton from './BlogGridSkeleton';
import { useToast } from '@/Components/ui/use-toast';

const BlogGrid = ({ posts, view, searchQuery, activeFilters }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(posts.current_page);
    const { toast } = useToast();
    const allPosts = posts?.data || [];

    // Update currentPage when posts change
    useEffect(() => {
        setCurrentPage(posts.current_page);
    }, [posts.current_page]);

    // Handle loading state
    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => {
            setIsLoading(false);
        };

        document.addEventListener('inertia:start', handleStart);
        document.addEventListener('inertia:finish', handleComplete);

        return () => {
            document.removeEventListener('inertia:start', handleStart);
            document.removeEventListener('inertia:finish', handleComplete);
        };
    }, []);

    // Handle URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get('page')) || 1;
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }, [window.location.search]);

    // Filter and search posts with memoization
    const filteredPosts = useMemo(() => {
        if (!allPosts.length) return [];
        
        return allPosts.filter(post => {
            const matchesSearch = !searchQuery || 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !activeFilters.category.length ||
                activeFilters.category.includes(post.category?.slug);

            const matchesTags = !activeFilters.tags.length ||
                post.tags?.some(tag => activeFilters.tags.includes(tag.slug));

            return matchesSearch && matchesCategory && matchesTags;
        });
    }, [allPosts, searchQuery, activeFilters]);

    // Handle pagination with URL update
    const handlePageChange = (page) => {
        if (page === currentPage) return;
        
        setIsLoading(true);
        setCurrentPage(page);

        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        
        // Update URL without page reload
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);

        router.get(
            route('frontend.blogs'),
            { 
                page,
                category: activeFilters.category,
                tags: activeFilters.tags,
                sort: activeFilters.sort,
                search: searchQuery 
            },
            { 
                preserveState: true,
                preserveScroll: true,
                onBefore: () => setIsLoading(true),
                onSuccess: () => {
                    setIsLoading(false);
                    toast({
                        title: "Page Updated",
                        description: `Showing page ${page} of results`,
                    });
                },
                onError: () => {
                    setIsLoading(false);
                    setCurrentPage(posts.current_page); // Reset on error
                    toast({
                        title: "Error",
                        description: "Failed to load posts. Please try again.",
                        variant: "destructive"
                    });
                }
            }
        );
    };

    // Handle tag click
    const handleTagClick = (tagSlug) => {
        const newTags = [...activeFilters.tags, tagSlug];
        router.get(
            route('frontend.blogs'),
            { ...activeFilters, tags: newTags },
            { 
                preserveState: true,
                onSuccess: () => {
                    toast({
                        title: "Filter Applied",
                        description: "Posts filtered by selected tag."
                    });
                }
            }
        );
    };

    if (isLoading) {
        return <BlogGridSkeleton view={view} />;
    }

    if (!filteredPosts.length) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                </p>
                <Button
                    variant="outline"
                    onClick={() => {
                        router.get(route('frontend.blogs'), {}, { 
                            preserveState: true,
                            onSuccess: () => {
                                toast({
                                    title: "Filters Reset",
                                    description: "Showing all posts."
                                });
                            }
                        });
                    }}
                >
                    Reset Filters
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            <div className={cn(
                "grid gap-6",
                view === 'grid' 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
            )}>
                <AnimatePresence mode="wait">
                    {filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ 
                                delay: index * 0.1,
                                duration: 0.3 
                            }}
                            className={cn(
                                "group relative overflow-hidden",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-200 dark:border-gray-700",
                                "rounded-2xl shadow-sm hover:shadow-lg",
                                "transition-all duration-300",
                                view === 'list' && "flex gap-6"
                            )}
                        >
                            {/* Image Container */}
                            <Link 
                                href={route('frontend.blog.single', post.slug)}
                                className={cn(
                                    "block overflow-hidden",
                                    view === 'grid' ? "aspect-[16/9]" : "w-1/3 aspect-[4/3]"
                                )}
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform 
                                             group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Stats Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-2
                                              bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="flex items-center gap-3 text-white text-sm">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{post.views}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{post.comments_count || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Content */}
                            <div className={cn(
                                "p-6",
                                view === 'list' && "flex-1"
                            )}>
                                {/* Category */}
                                <Badge variant="secondary" className="mb-2">
                                    {post.category?.name}
                                </Badge>

                                {/* Title */}
                                <h3 className={cn(
                                    "font-semibold mb-2 group-hover:text-primary transition-colors",
                                    view === 'grid' ? "text-xl" : "text-2xl"
                                )}>
                                    <Link href={route('frontend.blog.single', post.slug)}>
                                        {post.title}
                                    </Link>
                                </h3>

                                {/* Excerpt */}
                                <p className={cn(
                                    "text-gray-600 dark:text-gray-400 mb-4",
                                    view === 'grid' ? "line-clamp-2" : "line-clamp-3"
                                )}>
                                    {post.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.published_at}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.reading_time} min read</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{post.author?.name}</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags?.map(tag => (
                                        <Badge 
                                            key={tag.slug}
                                            variant="outline"
                                            className="text-xs hover:bg-primary/10 cursor-pointer
                                                     transition-colors duration-200"
                                            onClick={() => {
                                                const newTags = [...activeFilters.tags, tag.slug];
                                                router.get(
                                                    route('frontend.blogs'),
                                                    { ...activeFilters, tags: newTags },
                                                    { preserveState: true },
                                                );
                                            }}
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Read More Button */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between group/btn"
                                    asChild={true}
                                >
                                    <Link href={route('frontend.blog.single', post.slug)}>
                                        Read More
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.article>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {posts.last_page > 1 && (
                <div className="flex flex-col items-center gap-4 mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={posts.last_page}
                        onPageChange={handlePageChange}
                        maxVisible={5}
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing page {currentPage} of {posts.last_page}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogGrid; 