import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import { ArrowLeft, Coffee, Search } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion } from 'framer-motion';

const NotFound = ({
    message = "The item you're looking for could not be found.",
    type = 'item'
}) => {
    return (
        <Layout>
            <Head title="Not Found" />

            <div className="container mx-auto py-16 px-4">
                <div className="max-w-lg mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        {type === 'item' ? (
                            <Coffee className="mx-auto h-24 w-24 text-primary/60" />
                        ) : (
                            <Search className="mx-auto h-24 w-24 text-primary/60" />
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {type === 'item' ? 'Menu Item Not Found' : 'Category Not Found'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-gray-600 dark:text-gray-400 mb-8 text-lg"
                    >
                        {message}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <Link href="/food-menu">
                            <Button className="mr-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Menu
                            </Button>
                        </Link>

                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-8">
                            If you believe this is an error, please contact our support team.
                        </p>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default NotFound; 