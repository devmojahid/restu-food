import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    Search,
    ChevronRight,
    ChevronLeft,
    Download,
    LineChart,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationWithTotal
} from "@/Components/ui/pagination";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return format(date, 'MMM dd, yyyy');
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// Helper function to truncate text
const truncate = (str, maxLength) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

const PointsHistory = ({ data = {} }) => {
    const {
        title = 'Points Activity',
        description = 'Track your points earning and spending history. View all your transactions in one place.',
        history = [],
        totalPages = 1,
        startDate = '',
        endDate = ''
    } = data;

    // Ensure history is an array
    const safeHistory = Array.isArray(history) ? history : [];

    // Default history if none provided
    const defaultHistory = [
        {
            id: 1,
            type: 'earned',
            description: 'Order #12345',
            amount: 250,
            date: '2023-11-15T10:30:00',
            details: 'Points earned for your order at Restaurant Name.',
            orderReference: '12345'
        },
        {
            id: 2,
            type: 'redeemed',
            description: 'Free Delivery',
            amount: 300,
            date: '2023-11-10T14:15:00',
            details: 'Points redeemed for free delivery on order #12346.',
            orderReference: '12346'
        },
        {
            id: 3,
            type: 'earned',
            description: 'Order #12347',
            amount: 180,
            date: '2023-11-05T19:45:00',
            details: 'Points earned for your order at Another Restaurant.',
            orderReference: '12347'
        },
        {
            id: 4,
            type: 'earned',
            description: 'Referral Bonus',
            amount: 300,
            date: '2023-10-28T12:00:00',
            details: 'Bonus points for referring a friend.',
            orderReference: null
        },
        {
            id: 5,
            type: 'redeemed',
            description: '$10 Discount',
            amount: 800,
            date: '2023-10-15T16:30:00',
            details: 'Points redeemed for $10 discount on order #12348.',
            orderReference: '12348'
        },
        {
            id: 6,
            type: 'earned',
            description: 'Order #12349',
            amount: 220,
            date: '2023-10-10T13:15:00',
            details: 'Points earned for your order at Third Restaurant.',
            orderReference: '12349'
        },
        {
            id: 7,
            type: 'earned',
            description: 'Birthday Bonus',
            amount: 500,
            date: '2023-10-05T00:00:00',
            details: 'Bonus points for your birthday!',
            orderReference: null
        },
        {
            id: 8,
            type: 'redeemed',
            description: 'Free Appetizer',
            amount: 500,
            date: '2023-09-20T19:30:00',
            details: 'Points redeemed for a free appetizer on order #12350.',
            orderReference: '12350'
        }
    ];

    // Use provided history or fallback to defaults
    const displayHistory = safeHistory.length > 0 ? safeHistory : defaultHistory;

    // States for filtering
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState('all-time');
    const [currentPage, setCurrentPage] = useState(data.currentPage || 1);

    // Filter history based on search, type, and date range
    const filteredHistory = displayHistory.filter(item => {
        // Type filter
        const matchesType =
            filterType === 'all' ||
            (filterType === 'earned' && item.type === 'earned') ||
            (filterType === 'redeemed' && item.type === 'redeemed');

        // Search filter
        const matchesSearch =
            !searchQuery ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.orderReference && item.orderReference.includes(searchQuery));

        // Date range filter would go here if implemented fully

        return matchesType && matchesSearch;
    });

    // Pagination constants
    const ITEMS_PER_PAGE = 10;
    const paginatedHistory = filteredHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Calculate stats
    const totalEarned = filteredHistory
        .filter(item => item.type === 'earned')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalRedeemed = filteredHistory
        .filter(item => item.type === 'redeemed')
        .reduce((sum, item) => sum + item.amount, 0);

    const netPoints = totalEarned - totalRedeemed;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1 mb-4 
                                 bg-primary/10 text-primary text-sm font-medium"
                    >
                        Transaction History
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Stats Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {/* Total Earned */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <ArrowUpRight className="w-5 h-5 mr-2 text-green-500" />
                                    Total Points Earned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {totalEarned.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    From {filteredHistory.filter(item => item.type === 'earned').length} transactions
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Total Redeemed */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <ArrowDownRight className="w-5 h-5 mr-2 text-amber-500" />
                                    Total Points Redeemed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {totalRedeemed.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    From {filteredHistory.filter(item => item.type === 'redeemed').length} transactions
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Net Points */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                    <LineChart className="w-5 h-5 mr-2 text-primary" />
                                    Net Points Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {netPoints.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    From {filteredHistory.length} total transactions
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search transactions..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Filter */}
                        <div className="flex space-x-2 items-center">
                            <Filter className="text-gray-400 h-4 w-4" />
                            <Select
                                value={filterType}
                                onValueChange={setFilterType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Transactions</SelectItem>
                                    <SelectItem value="earned">Points Earned</SelectItem>
                                    <SelectItem value="redeemed">Points Redeemed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="flex space-x-2 items-center">
                            <Calendar className="text-gray-400 h-4 w-4" />
                            <Select
                                value={filterDateRange}
                                onValueChange={setFilterDateRange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-time">All Time</SelectItem>
                                    <SelectItem value="this-month">This Month</SelectItem>
                                    <SelectItem value="last-month">Last Month</SelectItem>
                                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                                    <SelectItem value="this-year">This Year</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </motion.div>

                {/* Transaction Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
                >
                    {filteredHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Date</TableHead>
                                        <TableHead>Transaction</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                        <TableHead className="w-[100px] text-center">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedHistory.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                {formatDate(transaction.date)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start">
                                                    <div className={cn(
                                                        "mt-0.5 w-6 h-6 rounded-full mr-3 flex items-center justify-center",
                                                        transaction.type === 'earned'
                                                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                                    )}>
                                                        {transaction.type === 'earned'
                                                            ? <ArrowUpRight className="w-4 h-4" />
                                                            : <ArrowDownRight className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {transaction.description}
                                                        </div>
                                                        {transaction.orderReference && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                Order #{transaction.orderReference}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={cn(
                                                "text-right font-semibold",
                                                transaction.type === 'earned'
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-amber-600 dark:text-amber-400"
                                            )}>
                                                {transaction.type === 'earned' ? '+' : '-'}
                                                {transaction.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                            >
                                                                <Link href={`/rewards/history/${transaction.id}`}>
                                                                    <FileText className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View Transaction Details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Transactions Found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                No transactions match your current filters. Try adjusting your search or filters.
                            </p>
                            <Button onClick={() => {
                                setSearchQuery('');
                                setFilterType('all');
                                setFilterDateRange('all-time');
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {filteredHistory.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row justify-between items-center gap-4"
                    >
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium">{paginatedHistory.length}</span> of <span className="font-medium">{filteredHistory.length}</span> transactions
                        </div>

                        <PaginationWithTotal
                            currentPage={currentPage}
                            totalItems={filteredHistory.length}
                            pageSize={ITEMS_PER_PAGE}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                // In a real app, you would trigger a new page load here
                                console.log(`Navigate to page ${page}`);
                                // You might use router.visit() with Inertia to navigate
                            }}
                        />

                        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default PointsHistory; 