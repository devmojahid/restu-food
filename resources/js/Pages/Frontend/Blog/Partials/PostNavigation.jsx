import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';

const NavigationLink = ({ post, direction = 'next' }) => {
    if (!post) return null;

    const isNext = direction === 'next';
    
    return (
        <Link
            href={route('frontend.blog.single', post.slug)}
            className={cn(
                "group flex-1 flex items-start gap-4",
                isNext ? "text-right flex-row-reverse" : "text-left"
            )}
        >
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "shrink-0 transition-transform",
                    isNext 
                        ? "group-hover:translate-x-1" 
                        : "group-hover:-translate-x-1"
                )}
            >
                {isNext ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </Button>

            <div className="space-y-1">
                <p className={cn(
                    "text-sm text-muted-foreground",
                    isNext ? "text-right" : "text-left"
                )}>
                    {isNext ? 'Next Post' : 'Previous Post'}
                </p>
                
                <h4 className={cn(
                    "font-medium line-clamp-2 group-hover:text-primary transition-colors",
                    isNext ? "text-right" : "text-left"
                )}>
                    {post.title}
                </h4>

                {post.categories?.[0] && (
                    <p className={cn(
                        "text-sm text-muted-foreground",
                        isNext ? "text-right" : "text-left"
                    )}>
                        in {post.categories[0].name}
                    </p>
                )}
            </div>
        </Link>
    );
};

const PostNavigation = ({ previousPost, nextPost }) => {
    if (!previousPost && !nextPost) return null;

    return (
        <nav className="border-t dark:border-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-start gap-4">
                    <NavigationLink 
                        post={previousPost} 
                        direction="previous" 
                    />
                    
                    {previousPost && nextPost && (
                        <div className="hidden md:block w-px h-20 bg-gray-200 dark:bg-gray-800" />
                    )}
                    
                    <NavigationLink 
                        post={nextPost} 
                        direction="next" 
                    />
                </div>
            </div>
        </nav>
    );
};

export default PostNavigation; 