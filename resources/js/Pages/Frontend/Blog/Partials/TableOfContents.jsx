import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

const TableOfContents = ({ content }) => {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // Parse content for headings
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const elements = Array.from(doc.querySelectorAll('h2, h3, h4'));
        
        const parsedHeadings = elements.map(heading => ({
            id: heading.id || heading.textContent.toLowerCase().replace(/\W+/g, '-'),
            text: heading.textContent,
            level: parseInt(heading.tagName.charAt(1))
        }));

        setHeadings(parsedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '0% 0% -80% 0%' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <List className="w-4 h-4" />
                <h3 className="font-medium">Table of Contents</h3>
            </div>
            <nav className="space-y-1">
                {headings.map((heading, index) => (
                    <motion.a
                        key={heading.id}
                        href={`#${heading.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "block py-1 px-2 text-sm rounded-md transition-colors",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            heading.level === 2 && "font-medium",
                            heading.level === 3 && "pl-4",
                            heading.level === 4 && "pl-6",
                            activeId === heading.id
                                ? "text-primary bg-primary/5"
                                : "text-gray-600 dark:text-gray-400"
                        )}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}
                    >
                        {heading.text}
                    </motion.a>
                ))}
            </nav>
        </div>
    );
};

export default TableOfContents; 