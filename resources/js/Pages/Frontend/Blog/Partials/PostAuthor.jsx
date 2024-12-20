import React from 'react';
import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { cn } from '@/lib/utils';

const PostAuthor = ({ author }) => {
    if (!author) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <Avatar className="w-16 h-16">
                    <AvatarImage 
                        src={author.avatar} 
                        alt={author.name} 
                    />
                    <AvatarFallback>
                        {author.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>

                {/* Author Info */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                        {author.name}
                    </h3>
                    
                    {author.role && (
                        <p className="text-sm text-muted-foreground mb-2">
                            {author.role}
                        </p>
                    )}
                    
                    {author.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {author.bio}
                        </p>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {author.social?.website && (
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a 
                                    href={author.social.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary"
                                >
                                    <Globe className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                        
                        {author.social?.facebook && (
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a 
                                    href={author.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#1877F2]"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                        
                        {author.social?.twitter && (
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a 
                                    href={author.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#1DA1F2]"
                                >
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                        
                        {author.social?.linkedin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a 
                                    href={author.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-[#0A66C2]"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Author Posts Link */}
            {author.posts_count > 0 && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <Link
                        href={route('frontend.blogs', { author: author.id })}
                        className={cn(
                            "text-sm text-primary hover:text-primary/80",
                            "transition-colors duration-200"
                        )}
                    >
                        View all posts by {author.name} ({author.posts_count})
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PostAuthor; 