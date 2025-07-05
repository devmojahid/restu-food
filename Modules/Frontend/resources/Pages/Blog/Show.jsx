import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import ShareButtons from './Partials/ShareButtons';
import ReadingProgress from './Partials/ReadingProgress';
import PostHeader from './Partials/PostHeader';
import PostContent from './Partials/PostContent';
import PostAuthor from './Partials/PostAuthor';
import PostComments from './Partials/PostComments';
import RelatedPosts from './Partials/RelatedPosts';
import PostNavigation from './Partials/PostNavigation';
import { cn } from '@/lib/utils';
import { Calendar, Clock, User, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

const Show = ({ post, relatedPosts, nextPost, previousPost, comments }) => {
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        if (!post) return;

        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [post]);

    if (!post) {
        return (
            <Layout>
                <Head title="Post Not Found" />
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-4">Post Not Found</h1>
                        <p className="text-muted-foreground">
                            The post you're looking for doesn't exist or has been removed.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.excerpt || post.meta_description} />
                {/* Open Graph tags */}
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt || post.meta_description} />
                {post.featured_image && (
                    <meta property="og:image" content={post.featured_image} />
                )}
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt || post.meta_description} />
                {post.featured_image && (
                    <meta name="twitter:image" content={post.featured_image} />
                )}
            </Head>

            {/* Reading Progress Bar */}
            <ReadingProgress progress={readingProgress} />

            {/* Back to Blog Button */}
            <div className="container mx-auto px-4 py-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    asChild
                >
                    <Link href={route('frontend.blog.index')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Link>
                </Button>
            </div>

            {/* Hero Section with Featured Image */}
            {post.featured_image && (
                <div className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${post.featured_image})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
                    </div>
                    <div className="relative container mx-auto h-full flex items-center justify-center px-4">
                        <div className="text-center text-white space-y-6 max-w-3xl">
                            {post.categories?.length > 0 && (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {post.categories.map(category => (
                                        <Link
                                            key={category.id}
                                            href={route('frontend.blog.index', { category: category.slug })}
                                            className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                                    {post.excerpt}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <article className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
                        {/* Main Content */}
                        <div className="space-y-8">
                            {/* Post Header (if no featured image) */}
                            {!post.featured_image && (
                                <PostHeader
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    author={post.author}
                                    publishedAt={post.published_at}
                                    readingTime={post.reading_time}
                                    categories={post.categories || []}
                                />
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        {post.author.avatar && (
                                            <img 
                                                src={post.author.avatar} 
                                                alt={post.author.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <span>{post.author.name}</span>
                                    </div>
                                )}
                                {post.published_at && (
                                    <time dateTime={post.published_at}>
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </time>
                                )}
                                {post.reading_time && (
                                    <span>{post.reading_time} min read</span>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className={cn(
                                "prose prose-lg dark:prose-invert max-w-none",
                                "prose-headings:scroll-mt-20"
                            )}>
                                <PostContent 
                                    content={post.content} 
                                    id="post-content"
                                />
                            </div>

                            {/* Author Info */}
                            {post.author && (
                                <PostAuthor author={post.author} />
                            )}

                            {/* Comments Section */}
                            <PostComments 
                                comments={comments || []}
                                currentUser={post.current_user}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8 lg:sticky lg:top-20">
                            {/* Share Buttons */}
                            <ShareButtons 
                                url={window.location.href}
                                title={post.title}
                                description={post.excerpt}
                                image={post.featured_image}
                            />

                            {/* Related Posts Preview */}
                            {Array.isArray(relatedPosts) && relatedPosts.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                                    <div className="space-y-4">
                                        {relatedPosts.slice(0, 3).map(relatedPost => (
                                            <div key={relatedPost.id} className="flex gap-4">
                                                {relatedPost.image && (
                                                    <img 
                                                        src={relatedPost.image} 
                                                        alt={relatedPost.title}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-medium line-clamp-2">
                                                        {relatedPost.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(relatedPost.published_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts Section with Better Design */}
            {Array.isArray(relatedPosts) && relatedPosts.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-900 py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Related Posts</h2>
                            <p className="text-muted-foreground">
                                Continue reading more interesting articles
                            </p>
                        </div>
                        <RelatedPosts posts={relatedPosts} />
                    </div>
                </section>
            )}

            {/* Enhanced Post Navigation */}
            <PostNavigation
                previousPost={previousPost}
                nextPost={nextPost}
            />
        </Layout>
    );
};

export default Show; 