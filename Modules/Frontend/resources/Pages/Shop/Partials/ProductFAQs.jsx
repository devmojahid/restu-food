import React, { useState } from 'react';
import { 
    Search, 
    X, 
    HelpCircle, 
    MessageCircle, 
    Plus,
    ThumbsUp,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Textarea } from '@/Components/ui/textarea';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';

const ProductFAQs = ({ faqs = [], productId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const { toast } = useToast();
    
    // Filter FAQs based on search query
    const filteredFaqs = faqs.filter(faq => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
    });
    
    // Limit displayed FAQs
    const displayedFaqs = showAll 
        ? filteredFaqs 
        : filteredFaqs.slice(0, 5);
    
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setShowAll(false);
    };
    
    const handleClearSearch = () => {
        setSearchQuery('');
    };
    
    const handleHelpfulClick = (faqId) => {
        // This would normally update a database
        toast({
            title: "Thanks for your feedback!",
            description: "You've marked this answer as helpful.",
        });
    };
    
    const handleSubmitQuestion = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close the form and show success message
            setShowQuestionForm(false);
            toast({
                title: "Question Submitted",
                description: "Thank you for your question! We'll answer it as soon as possible.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "There was a problem submitting your question. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Group FAQs by category if available
    const groupedFaqs = displayedFaqs.reduce((acc, faq) => {
        const category = faq.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
    }, {});
    
    // Calculate number of hidden FAQs
    const hiddenCount = filteredFaqs.length - displayedFaqs.length;
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-semibold mb-1">Frequently Asked Questions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Find answers to common questions about this product
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full rounded-none"
                                onClick={handleClearSearch}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    
                    <Button 
                        onClick={() => setShowQuestionForm(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Ask a Question
                    </Button>
                </div>
            </div>
            
            {/* Display FAQs */}
            {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        No Questions Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchQuery
                            ? "No FAQs match your search query."
                            : "There are no FAQs for this product yet."
                        }
                    </p>
                    {searchQuery && (
                        <Button 
                            variant="outline"
                            onClick={handleClearSearch}
                        >
                            Clear Search
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    {/* FAQs grouped by category */}
                    {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                        <div key={category} className="mb-6">
                            {/* Show category heading only if there are multiple categories */}
                            {Object.keys(groupedFaqs).length > 1 && (
                                <h4 className="text-md font-medium mb-3 flex items-center">
                                    {category}
                                    <Badge variant="outline" className="ml-2">
                                        {categoryFaqs.length}
                                    </Badge>
                                </h4>
                            )}
                            
                            <Accordion type="single" collapsible className="w-full">
                                {categoryFaqs.map((faq, index) => (
                                    <AccordionItem 
                                        key={faq.id || index} 
                                        value={`item-${faq.id || index}`}
                                        className="border-b dark:border-gray-700"
                                    >
                                        <AccordionTrigger className="text-left hover:no-underline">
                                            <span className="font-medium">{faq.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="text-gray-700 dark:text-gray-300 mb-4">
                                                {faq.answer}
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="text-gray-500">
                                                    {faq.answered_by && `Answered by ${faq.answered_by}`}
                                                    {faq.answered_date && ` • ${faq.answered_date}`}
                                                </div>
                                                
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleHelpfulClick(faq.id)}
                                                    className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                                                >
                                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                                    Helpful ({faq.helpful_count || 0})
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                    
                    {/* Load more button */}
                    {hiddenCount > 0 && (
                        <div className="text-center pt-2">
                            <Button 
                                variant="outline"
                                onClick={() => setShowAll(true)}
                            >
                                Show {hiddenCount} More {hiddenCount === 1 ? 'Question' : 'Questions'}
                            </Button>
                        </div>
                    )}
                </>
            )}
            
            {/* Separator before common questions */}
            <Separator className="my-8" />
            
            {/* Common questions section */}
            <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Don't see your question?</h4>
                <Button
                    className="w-full md:w-auto"
                    onClick={() => setShowQuestionForm(true)}
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask a Question
                </Button>
            </div>
            
            {/* Ask Question Dialog */}
            <Dialog open={showQuestionForm} onOpenChange={setShowQuestionForm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ask a Question</DialogTitle>
                        <DialogDescription>
                            Have a question about this product? We'll respond as soon as possible.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitQuestion}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="question" className="text-sm font-medium">
                                    Your Question
                                </label>
                                <Textarea 
                                    id="question"
                                    placeholder="What would you like to know about this product?"
                                    rows={4}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email (optional)
                                </label>
                                <Input 
                                    id="email"
                                    type="email"
                                    placeholder="We'll notify you when your question is answered"
                                />
                                <p className="text-xs text-gray-500">
                                    We'll only use your email to send you the answer to your question.
                                </p>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Question"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductFAQs; 