import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    ChevronRight, 
    Calendar, 
    User, 
    MessageSquare, 
    ArrowRight,
    ArrowUpRight,
    Clock,
    Bookmark,
    Share2,
    Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';

const BlogCard = ({ post, index, featured = false }) => {
    const formattedDate = post.published_at 
        ? format(new Date(post.published_at), 'MMM dd, yyyy') 
        : format(new Date(), 'MMM dd, yyyy');
    
    if (featured) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                         hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Image */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition-transform duration-500 
                                   group-hover:scale-105"
                        />
                        
                        {/* Category Badge */}
                        <Badge className="absolute top-4 left-4 bg-primary text-white">
                            {post.category}
                        </Badge>
                    </div>
                    
                    {/* Content */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formattedDate}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.read_time} min read</span>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white 
                                       mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                        </Link>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                            {post.excerpt}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{post.author.name}</span>
                            </div>
                            
                            <Link
                                href={`/blog/${post.slug}`}
                                className="flex items-center text-primary group"
                            >
                                <span className="mr-1">Read</span>
                                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 
                                                    group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                     hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-105"
                />
                
                {/* Category Badge */}
                <Badge className="absolute top-4 left-4 bg-primary/90 text-white">
                    {post.category}
                </Badge>
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                               hover:bg-white/40 text-white transition-colors"
                    >
                        <Bookmark className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                               hover:bg-white/40 text-white transition-colors"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formattedDate}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.read_time} min read</span>
                </div>
                
                <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white 
                               mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                    {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{post.author.name}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{post.comments_count}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Blog Posts Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're working on creating amazing content. Check back soon for updates!
        </p>
    </div>
);

const LatestBlogs = ({ data = {} }) => {
    const { 
        title = "Latest Articles", 
        subtitle = "Stay updated with our latest news, tips, and insights",
        posts = []
    } = data;
    
    // Default blog posts if none provided
    const defaultPosts = [
        {
            id: 1,
            title: "10 Essential Tips for Healthy Eating on a Budget",
            slug: "healthy-eating-budget-tips",
            excerpt: "Discover how to maintain a nutritious diet without breaking the bank with these practical tips and strategies.",
            image: "https://placehold.co/800x600?text=Food+Blog",
            published_at: "2023-07-15T12:00:00Z",
            read_time: 7,
            category: "Nutrition",
            comments_count: 24,
            author: {
                name: "Sarah Johnson",
                avatar: "https://placehold.co/100?text=SJ"
            }
        },
        {
            id: 2,
            title: "The Ultimate Guide to Plant-Based Proteins",
            slug: "plant-based-proteins-guide",
            excerpt: "Everything you need to know about getting enough protein on a plant-based diet, with delicious recipe ideas.",
            image: "https://placehold.co/800x600?text=Protein+Guide",
            published_at: "2023-07-10T14:30:00Z",
            read_time: 9,
            category: "Vegan",
            comments_count: 18,
            author: {
                name: "Mike Chen",
                avatar: "https://placehold.co/100?text=MC"
            }
        },
        {
            id: 3,
            title: "5 Quick and Easy Breakfast Ideas for Busy Mornings",
            slug: "quick-breakfast-ideas",
            excerpt: "Start your day right with these nutritious breakfast recipes that take less than 10 minutes to prepare.",
            image: "https://placehold.co/800x600?text=Breakfast",
            published_at: "2023-07-05T09:15:00Z",
            read_time: 5,
            category: "Recipes",
            comments_count: 32,
            author: {
                name: "Emma Davis",
                avatar: "https://placehold.co/100?text=ED"
            }
        },
        {
            id: 4,
            title: "The Science Behind Food Cravings and How to Beat Them",
            slug: "food-cravings-science",
            excerpt: "Understanding why we crave certain foods and practical strategies to manage unhealthy cravings.",
            image: "https://placehold.co/800x600?text=Cravings",
            published_at: "2023-06-28T11:45:00Z",
            read_time: 8,
            category: "Health",
            comments_count: 15,
            author: {
                name: "Dr. James Wilson",
                avatar: "https://placehold.co/100?text=JW"
            }
        },
        {
            id: 5,
            title: "International Street Food: A Culinary Journey Around the World",
            slug: "international-street-food",
            excerpt: "Explore the diverse and delicious world of street food from Asia to Latin America and everywhere in between.",
            image: "https://placehold.co/800x600?text=Street+Food",
            published_at: "2023-06-20T16:00:00Z",
            read_time: 12,
            category: "Culture",
            comments_count: 47,
            author: {
                name: "Sophia Rodriguez",
                avatar: "https://placehold.co/100?text=SR"
            }
        }
    ];
    
    const displayPosts = posts.length > 0 ? posts : defaultPosts;
    
    if (displayPosts.length === 0) {
        return <EmptyState />;
    }
    
    // Get the first post as featured
    const featuredPost = displayPosts[0];
    const regularPosts = displayPosts.slice(1, 5); // Take up to 4 more posts

    return (
        <section id="latest-blogs" className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 
                                     rounded-full text-sm font-medium mb-4"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Blog & Articles</span>
                        </motion.div>
                        
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                        >
                            {title}
                        </motion.h2>
                        
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-600 dark:text-gray-400 max-w-2xl"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <Link
                        href="/blog"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Articles</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                {/* Featured Post */}
                <div className="mb-10">
                    <BlogCard post={featuredPost} featured={true} />
                </div>
                
                {/* Regular Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {regularPosts.map((post, index) => (
                        <BlogCard key={post.id} post={post} index={index} />
                    ))}
                </div>
                
                {/* View All - Mobile Only */}
                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>Read More Articles</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestBlogs; 