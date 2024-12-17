import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import PostHeader from './Partials/PostHeader';
import PostContent from './Partials/PostContent';
import PostAuthor from './Partials/PostAuthor';
import PostComments from './Partials/PostComments';
import RelatedPosts from './Partials/RelatedPosts';
import PostNavigation from './Partials/PostNavigation';
import TableOfContents from './Partials/TableOfContents';
import ShareButtons from './Partials/ShareButtons';
import ReadingProgress from './Partials/ReadingProgress';
import { useToast } from '@/Components/ui/use-toast';
import { Link } from '@inertiajs/react';

const Show = ({ post, relatedPosts, nextPost, previousPost, comments }) => {
    const [readingProgress, setReadingProgress] = useState(0);
    const { toast } = useToast();

    // Handle reading progress
    useEffect(() => {
        const updateReadingProgress = () => {
            const element = document.documentElement;
            const scrollTop = element.scrollTop || document.body.scrollTop;
            const scrollHeight = element.scrollHeight || document.body.scrollHeight;
            const clientHeight = element.clientHeight;
            
            const windowHeight = scrollHeight - clientHeight;
            const progress = Math.round((scrollTop / windowHeight) * 100);
            
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', updateReadingProgress);
        return () => window.removeEventListener('scroll', updateReadingProgress);
    }, []);

    return (
        <Layout>
            <Head>
                <title>{post.title}</title>
                <meta name="description" content={post.meta_description} />
                <meta name="keywords" content={post.meta_keywords} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.meta_description} />
                <meta property="og:image" content={post.featured_image} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            {/* Reading Progress Bar */}
            <ReadingProgress progress={readingProgress} />

            <article className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Post Header */}
                        <PostHeader post={post} />

                        {/* Share Buttons - Mobile */}
                        <div className="lg:hidden sticky top-4 z-10">
                            <ShareButtons post={post} />
                        </div>

                        {/* Post Content */}
                        <PostContent content={post.content} />

                        {/* Tags Section */}
                        <div className="flex flex-wrap gap-2 py-4">
                            {post.tags.map(tag => (
                                <Link 
                                    key={tag.id}
                                    href={route('frontend.blog.tag', tag.slug)}
                                    className="inline-flex items-center px-3 py-1 rounded-full
                                             text-sm bg-gray-100 hover:bg-gray-200 
                                             dark:bg-gray-800 dark:hover:bg-gray-700
                                             transition-colors duration-200"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>

                        {/* Author Bio */}
                        <PostAuthor author={post.author} />

                        {/* Comments Section */}
                        <PostComments 
                            comments={comments} 
                            postId={post.id}
                            onCommentSubmit={(comment) => {
                                toast({
                                    title: "Comment Posted",
                                    description: "Your comment has been submitted successfully."
                                });
                            }}
                        />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Share Buttons - Desktop */}
                        <div className="hidden lg:block sticky top-24">
                            <ShareButtons post={post} />
                        </div>

                        {/* Table of Contents */}
                        <TableOfContents content={post.content} />

                        {/* Related Posts */}
                        <RelatedPosts posts={relatedPosts} />
                    </aside>
                </div>

                {/* Post Navigation */}
                <PostNavigation 
                    previousPost={previousPost}
                    nextPost={nextPost}
                />
            </article>
        </Layout>
    );
};

export default Show; 