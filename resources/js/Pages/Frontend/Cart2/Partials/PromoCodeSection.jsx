import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Tag,
    Check,
    X,
    Ticket,
    Loader2,
    Copy,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from "@/Components/ui/input";
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { cn } from '@/lib/utils';

const PromoCodeSection = ({
    promocodes = [],
    promoCode,
    setPromoCode,
    onApply,
    isApplying = false,
    appliedCode = null
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    // Default promo codes if none provided
    const defaultPromocodes = [
        {
            id: 'welcome10',
            code: 'WELCOME10',
            description: '10% off your first order',
            discount_type: 'percentage',
            discount_value: 10,
            min_order: 15,
            expiry_date: '2023-12-31'
        },
        {
            id: 'freeship',
            code: 'FREESHIP',
            description: 'Free delivery on orders over $25',
            discount_type: 'shipping',
            discount_value: 100,
            min_order: 25,
            expiry_date: '2023-12-31'
        },
        {
            id: 'lunch15',
            code: 'LUNCH15',
            description: '$15 off lunch orders over $50',
            discount_type: 'fixed',
            discount_value: 15,
            min_order: 50,
            expiry_date: '2023-12-31'
        }
    ];

    const displayPromocodes = promocodes?.length > 0 ? promocodes : defaultPromocodes;

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);

        // Reset copied state after 2 seconds
        setTimeout(() => {
            setCopiedCode(null);
        }, 2000);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Promo Code</h2>

                {displayPromocodes.length > 0 && (
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="w-full"
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-primary"
                            >
                                <Ticket className="h-4 w-4" />
                                <span>Available Codes</span>
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>
                )}
            </div>

            {/* Promo Code Input */}
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Tag className="h-4 w-4 text-gray-400" />
                    </div>

                    <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="pl-10"
                        disabled={isApplying || appliedCode}
                    />

                    {appliedCode && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <Check className="h-4 w-4 text-green-500" />
                        </div>
                    )}
                </div>

                <Button
                    onClick={onApply}
                    disabled={isApplying || !promoCode || appliedCode}
                    className="w-24"
                >
                    {isApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : appliedCode ? (
                        'Applied'
                    ) : (
                        'Apply'
                    )}
                </Button>
            </div>

            {/* Applied Promo Status */}
            {appliedCode && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Code <strong>{appliedCode}</strong> applied!</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-700 dark:text-green-400 hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => {
                            setPromoCode('');
                            // In a real app, this would call an API to remove the promo code
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Available Promo Codes */}
            {displayPromocodes.length > 0 && (
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full"
                >
                    <CollapsibleContent>
                        <div className="mt-2 space-y-3">
                            {displayPromocodes.map((promocode) => (
                                <div
                                    key={promocode.id}
                                    className={cn(
                                        "border border-dashed rounded-lg p-3",
                                        "border-gray-200 dark:border-gray-700",
                                        "hover:border-primary/40 dark:hover:border-primary/40",
                                        "transition-all duration-300"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">{promocode.code}</span>

                                                {promocode.discount_type === 'percentage' && (
                                                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                        {promocode.discount_value}% OFF
                                                    </Badge>
                                                )}

                                                {promocode.discount_type === 'fixed' && (
                                                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                        ${promocode.discount_value} OFF
                                                    </Badge>
                                                )}

                                                {promocode.discount_type === 'shipping' && (
                                                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                                                        FREE SHIPPING
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {promocode.description}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                {promocode.min_order > 0 && (
                                                    <span>Min. order ${promocode.min_order}</span>
                                                )}

                                                {promocode.expiry_date && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Expires {formatDate(promocode.expiry_date)}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => handleCopyCode(promocode.code)}
                                                    >
                                                        {copiedCode === promocode.code ? (
                                                            <Check className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{copiedCode === promocode.code ? 'Copied!' : 'Copy code'}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </motion.div>
    );
};

export default PromoCodeSection; 