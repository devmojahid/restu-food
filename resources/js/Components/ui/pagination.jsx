import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    maxVisible = 5 
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const leftOffset = Math.floor(maxVisible / 2);
        const rightOffset = maxVisible - leftOffset - 1;

        let start = Math.max(1, currentPage - leftOffset);
        let end = Math.min(totalPages, currentPage + rightOffset);

        // Show dots at start
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('start-ellipsis');
            }
        }

        // Add pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Show dots at end
        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('end-ellipsis');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <nav 
            className="flex items-center gap-1" 
            role="navigation" 
            aria-label="Pagination"
        >
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNumber, index) => {
                    if (typeof pageNumber === 'string') {
                        return (
                            <div 
                                key={pageNumber}
                                className="px-2 text-gray-400"
                                aria-hidden="true"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </div>
                        );
                    }

                    return (
                        <Button
                            key={pageNumber}
                            variant={pageNumber === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(pageNumber)}
                            className={cn(
                                "min-w-[2.25rem]",
                                pageNumber === currentPage && "pointer-events-none"
                            )}
                            aria-current={pageNumber === currentPage ? "page" : undefined}
                            aria-label={`Page ${pageNumber}`}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </nav>
    );
};
