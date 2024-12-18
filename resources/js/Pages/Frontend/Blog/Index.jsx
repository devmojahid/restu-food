import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import BlogGrid from './Partials/BlogGrid';
import SearchSection from './Partials/SearchSection';
import FeaturedPosts from './Partials/FeaturedPosts';
import Categories from './Partials/Categories';
import PopularTags from './Partials/PopularTags';
import Newsletter from './Partials/Newsletter';
import { useDebounce } from '@/hooks/useDebounce';
import { router } from '@inertiajs/react';

const Index = ({ posts, featured, categories, tags, stats, popularPosts, recentPosts, filters }) => {
    const [view, setView] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        category: filters?.category ? [filters.category] : [],
        tags: [],
        sort: 'latest'
    });

    const debouncedSearch = useDebounce(searchQuery, 300);

    const handleFilterChange = (newFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            ...newFilters
        }));

        if (newFilters.category) {
            router.get(route('frontend.blogs'), { 
                category: newFilters.category[0] 
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }
    };

    const activeCategory = categories.find(cat => cat.slug === filters?.category);

    return (
        <Layout>
            <Head>
                <title>
                    {activeCategory ? `${activeCategory.name} - Blog` : 'Blog - Latest Articles and Updates'}
                </title>
                <meta 
                    name="description" 
                    content={activeCategory 
                        ? `Browse articles in ${activeCategory.name}` 
                        : "Discover our latest articles, recipes, and culinary insights."
                    } 
                />
            </Head>

            {/* Hero Section */}
            <Hero stats={stats} />

            {/* Featured Posts */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <FeaturedPosts posts={featured} />
                </div>
            </section>

            {/* Category Title */}
            {activeCategory && (
                <div className="container mx-auto px-4 py-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <span>Category:</span>
                        <span className="text-primary">{activeCategory.name}</span>
                        <span className="text-sm text-muted-foreground">
                            ({activeCategory.posts_count} posts)
                        </span>
                    </h2>
                </div>
            )}

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {/* Search and Filters */}
                    <SearchSection 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        view={view}
                        setView={setView}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mt-8">
                        {/* Blog Posts Grid */}
                        <main>
                            <BlogGrid 
                                posts={posts}
                                view={view}
                                searchQuery={debouncedSearch}
                                activeFilters={activeFilters}
                            />
                        </main>

                        {/* Sidebar */}
                        <aside className="space-y-8">
                            {/* Categories */}
                            <Categories 
                                categories={categories}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                            />

                            {/* Newsletter */}
                            <Newsletter />
                        </aside>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Index; 