import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const Newsletter = () => {
    const { data, setData, post, processing, reset } = useForm({
        email: ''
    });
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            onSuccess: () => {
                reset('email');
                toast({
                    title: "Success!",
                    description: "You've been subscribed to our newsletter.",
                });
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4" />
                <h3 className="font-medium">Newsletter</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and recipes.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    required
                />
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={processing}
                >
                    {processing ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </form>
        </motion.div>
    );
};

export default Newsletter; 