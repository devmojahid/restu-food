import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/Components/ui/separator';

const PostContent = ({ content }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
        >
            <Separator className="my-8" />

            {/* Content */}
            <div
                dangerouslySetInnerHTML={{ __html: processContent(content) }}
                className={cn(
                    "prose-headings:scroll-mt-20",
                    "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8",
                    "prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:mb-4",
                    "prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4",
                    "prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4",
                    "prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:mb-2",
                    "prose-blockquote:border-l-4 prose-blockquote:border-primary",
                    "prose-blockquote:pl-4 prose-blockquote:italic",
                    "prose-img:rounded-lg prose-img:shadow-md",
                    "prose-table:w-full prose-table:border-collapse",
                    "prose-th:bg-gray-100 dark:prose-th:bg-gray-800",
                    "prose-th:p-2 prose-td:p-2",
                    "prose-th:border prose-td:border",
                    "prose-th:border-gray-200 dark:prose-th:border-gray-700",
                    "prose-td:border-gray-200 dark:prose-td:border-gray-700"
                )}
            />

            {/* Recipe Card (if content contains recipe) */}
            {content.includes('Ingredients') && (
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Recipe Card</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Ingredients</h4>
                            <ul className="space-y-2">
                                {extractIngredients(content).map((ingredient, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        <span>{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Instructions</h4>
                            <ol className="space-y-2">
                                {extractInstructions(content).map((instruction, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="font-medium min-w-[1.5rem]">{index + 1}.</span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// Helper functions
const processContent = (content) => {
    // Add IDs to headings for TOC
    return content.replace(
        /<h2>(.*?)<\/h2>/g,
        (match, text) => `<h2 id="${text.toLowerCase().replace(/\s+/g, '-')}">${text}</h2>`
    );
};

const extractIngredients = (content) => {
    const ingredientsMatch = content.match(/<ul>(.*?)<\/ul>/s);
    if (!ingredientsMatch) return [];
    
    return ingredientsMatch[1]
        .match(/<li>(.*?)<\/li>/g)
        ?.map(item => item.replace(/<\/?li>/g, '')) || [];
};

const extractInstructions = (content) => {
    const instructionsMatch = content.match(/<ol>(.*?)<\/ol>/s);
    if (!instructionsMatch) return [];
    
    return instructionsMatch[1]
        .match(/<li>(.*?)<\/li>/g)
        ?.map(item => item.replace(/<\/?li>/g, '')) || [];
};

export default PostContent; 