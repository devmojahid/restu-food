import React from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const PostHeader = ({ 
    title, 
    excerpt, 
    author, 
    publishedAt, 
    readingTime, 
    categories = [], 
    image 
}) => {
    return (
        <header className="max-w-4xl mx-auto text-center space-y-8">
            {/* Categories */}
            {Array.isArray(categories) && categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map(category => (
                        <Link
                            key={category?.id}
                            href={category?.slug ? route('frontend.blog.index', { category: category.slug }) : '#'}
                            className="no-underline"
                        >
                            <Badge variant="secondary" className="hover:bg-secondary/80">
                                {category?.name || 'Uncategorized'}
                            </Badge>
                        </Link>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {title || 'Untitled Post'}
            </h1>

            {/* Excerpt */}
            {excerpt && (
                <p className="text-xl text-muted-foreground">
                    {excerpt}
                </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                {/* Author */}
                {author && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {author.avatar ? (
                                <img 
                                    src={author.avatar} 
                                    alt={author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                            <span>{author.name}</span>
                        </div>
                    </div>
                )}

                {/* Date */}
                {publishedAt && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <time dateTime={publishedAt}>
                            {format(new Date(publishedAt), 'MMMM d, yyyy')}
                        </time>
                    </div>
                )}

                {/* Reading Time */}
                {readingTime && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>{readingTime} min read</span>
                    </div>
                )}
            </div>

            {/* Featured Image */}
            {image && (
                <div className="mt-8 rounded-lg overflow-hidden aspect-video">
                    <img
                        src={image}
                        alt={title}
                        className={cn(
                            "w-full h-full object-cover",
                            "transition duration-300 hover:scale-105"
                        )}
                    />
                </div>
            )}
        </header>
    );
};

export default PostHeader; 