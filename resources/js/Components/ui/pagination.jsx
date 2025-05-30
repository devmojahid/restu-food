import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Main pagination container
const Pagination = React.forwardRef(({ className, ...props }, ref) => (
    <nav
        ref={ref}
        className={cn("mx-auto flex w-full justify-center", className)}
        role="navigation"
        aria-label="pagination"
        {...props}
    />
));
Pagination.displayName = "Pagination";

// Content container for pagination items
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

// Individual pagination item
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// Link component for pagination
const PaginationLink = React.forwardRef(
    ({ className, isActive = false, href = "#", ...props }, ref) => (
        <Link
            ref={ref}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium",
                "border border-gray-200 dark:border-gray-700",
                "transition-colors duration-200",
                isActive
                    ? "bg-primary text-white pointer-events-none"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                className
            )}
            {...props}
        />
    )
);
PaginationLink.displayName = "PaginationLink";

// Previous page link
const PaginationPrevious = React.forwardRef(({ className, href = "#", disabled = false, ...props }, ref) => (
    <PaginationLink
        ref={ref}
        href={disabled ? "#" : href}
        aria-label="Go to previous page"
        aria-disabled={disabled}
        className={cn(
            "gap-1",
            disabled && "opacity-50 pointer-events-none",
            className
        )}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:inline-block">Previous</span>
    </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

// Next page link
const PaginationNext = React.forwardRef(({ className, href = "#", disabled = false, ...props }, ref) => (
    <PaginationLink
        ref={ref}
        href={disabled ? "#" : href}
        aria-label="Go to next page"
        aria-disabled={disabled}
        className={cn(
            "gap-1",
            disabled && "opacity-50 pointer-events-none",
            className
        )}
        {...props}
    >
        <span className="sr-only sm:not-sr-only sm:inline-block">Next</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

// Ellipsis for pagination (...)
const PaginationEllipsis = React.forwardRef(({ className, ...props }, ref) => (
    <li
        ref={ref}
        className={cn("flex h-9 min-w-9 items-center justify-center text-gray-500 dark:text-gray-400", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </li>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

// Helper function to create an array of page numbers
const generatePagination = (currentPage, totalPages, maxDisplayed = 5) => {
    // Always display first and last page
    const pageNumbers = [];

    if (totalPages <= maxDisplayed) {
        // If not many pages, show all
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        // Calculate the range of pages to display
        const leftSideCount = Math.floor(maxDisplayed / 2);
        const rightSideCount = maxDisplayed - leftSideCount - 1;

        let startPage = Math.max(1, currentPage - leftSideCount);
        let endPage = Math.min(totalPages, currentPage + rightSideCount);

        // Adjust if we're near the start or end
        if (startPage <= 2) {
            startPage = 1;
            endPage = Math.min(maxDisplayed, totalPages);
        } else if (endPage >= totalPages - 1) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - maxDisplayed + 1);
        }

        // Add first page if not included
        if (startPage > 1) {
            pageNumbers.push(1);
            // Add ellipsis if there's a gap
            if (startPage > 2) {
                pageNumbers.push("start-ellipsis");
            }
        }

        // Add the range of pages
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Add last page if not included
        if (endPage < totalPages) {
            // Add ellipsis if there's a gap
            if (endPage < totalPages - 1) {
                pageNumbers.push("end-ellipsis");
            }
            pageNumbers.push(totalPages);
        }
    }

    return pageNumbers;
};

// Pagination component that generates pagination based on current page and total
const PaginationWithTotal = React.forwardRef(({
    className,
    currentPage = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
    maxDisplayed = 5,
    siblingCount = 1,
    ...props
}, ref) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pageNumbers = generatePagination(currentPage, totalPages, maxDisplayed);

    return (
        <Pagination ref={ref} className={className} {...props}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
                        onClick={(e) => {
                            if (currentPage > 1 && onPageChange) {
                                e.preventDefault();
                                onPageChange(currentPage - 1);
                            }
                        }}
                        disabled={currentPage <= 1}
                    />
                </PaginationItem>

                {pageNumbers.map((page, i) => {
                    if (page === "start-ellipsis" || page === "end-ellipsis") {
                        return (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href={`?page=${page}`}
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    if (onPageChange) {
                                        e.preventDefault();
                                        onPageChange(page);
                                    }
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
                        onClick={(e) => {
                            if (currentPage < totalPages && onPageChange) {
                                e.preventDefault();
                                onPageChange(currentPage + 1);
                            }
                        }}
                        disabled={currentPage >= totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
});
PaginationWithTotal.displayName = "PaginationWithTotal";

export {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
    PaginationWithTotal
};
