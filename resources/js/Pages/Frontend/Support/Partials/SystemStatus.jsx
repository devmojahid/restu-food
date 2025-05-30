import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';

const SystemStatus = ({ data }) => {
    // If no data is provided, return null
    if (!data) return null;

    // Status indicators configuration
    const statusConfig = {
        operational: {
            icon: Check,
            color: 'text-green-500',
            bgColor: 'bg-green-500',
            bgColorLight: 'bg-green-100 dark:bg-green-900/20',
            text: 'Operational',
            description: 'All systems are running smoothly'
        },
        partial_outage: {
            icon: AlertTriangle,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500',
            bgColorLight: 'bg-amber-100 dark:bg-amber-900/20',
            text: 'Partial Outage',
            description: 'Some systems are experiencing issues'
        },
        major_outage: {
            icon: XCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-500',
            bgColorLight: 'bg-red-100 dark:bg-red-900/20',
            text: 'Major Outage',
            description: 'Critical systems are down'
        },
        maintenance: {
            icon: Clock,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500',
            bgColorLight: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'Maintenance',
            description: 'Scheduled maintenance in progress'
        }
    };

    // Helper function to get the status config
    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.operational;
    };

    // Get the overall status config
    const overallStatus = getStatusConfig(data.status);

    // Format the date
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {data.title || 'System Status'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {data.description || 'Check the current status of our services'}
                </p>
            </motion.div>

            {/* Overall Status Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                    "mb-8 p-6 rounded-2xl shadow-md border",
                    "border-gray-100 dark:border-gray-700",
                    overallStatus.bgColorLight
                )}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className={cn(
                            "p-3 rounded-full mr-4",
                            "bg-white dark:bg-gray-800"
                        )}>
                            <overallStatus.icon className={cn("w-6 h-6", overallStatus.color)} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {overallStatus.text}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {overallStatus.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Last updated:
                            </p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {formatDate(data.lastUpdated) || 'Just now'}
                            </p>
                        </div>

                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Services Status List */}
            <div className="space-y-4">
                {data.services?.map((service, index) => {
                    const serviceStatus = getStatusConfig(service.status || 'operational');

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "bg-white dark:bg-gray-800",
                                "rounded-xl shadow-sm",
                                "border border-gray-100 dark:border-gray-700",
                                "p-4"
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className={cn(
                                        "w-3 h-3 rounded-full mr-3",
                                        serviceStatus.bgColor
                                    )}></div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {service.name}
                                    </h4>
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    serviceStatus.color
                                )}>
                                    {serviceStatus.text}
                                </span>
                            </div>

                            {/* Uptime Bar */}
                            {service.uptime && (
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <span>Uptime: {service.uptime}%</span>
                                        <span>Last 30 days</span>
                                    </div>
                                    <Progress value={service.uptime} className="h-1.5" />
                                </div>
                            )}

                            {/* Incident Info */}
                            {service.incident && (
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <span className="font-medium text-amber-500 dark:text-amber-400">
                                            Incident:
                                        </span> {service.incident}
                                    </div>
                                    {service.eta && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            Expected resolution: {service.eta}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Subscribe to Updates */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center"
            >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Stay Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Subscribe to receive notifications about system status changes
                </p>
                <div className="flex justify-center space-x-3">
                    <Button variant="outline">
                        Email Updates
                    </Button>
                    <Button>
                        SMS Alerts
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default SystemStatus; 