import React from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { ChefHat, Clock, Utensils, TrendingUp } from 'lucide-react';

const KitchenStats = ({ stats }) => {
    // Dummy data if stats is not provided
    const defaultStats = {
        total_orders: {
            value: 156,
            change: 12,
            label: 'Total Orders Today'
        },
        active_orders: {
            value: 23,
            change: -5,
            label: 'Active Orders'
        },
        avg_prep_time: {
            value: '18 min',
            change: -2,
            label: 'Avg Preparation Time'
        },
        completion_rate: {
            value: '96%',
            change: 3,
            label: 'Completion Rate'
        }
    };

    const statsData = stats || defaultStats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(statsData).map(([key, stat]) => (
                <Card key={key} className="p-6">
                    <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            key === 'total_orders' ? 'bg-blue-50 text-blue-600' :
                            key === 'active_orders' ? 'bg-yellow-50 text-yellow-600' :
                            key === 'avg_prep_time' ? 'bg-green-50 text-green-600' :
                            'bg-purple-50 text-purple-600'
                        }`}>
                            {key === 'total_orders' && <ChefHat className="w-6 h-6" />}
                            {key === 'active_orders' && <Utensils className="w-6 h-6" />}
                            {key === 'avg_prep_time' && <Clock className="w-6 h-6" />}
                            {key === 'completion_rate' && <TrendingUp className="w-6 h-6" />}
                        </div>
                        <Badge variant={stat.change >= 0 ? 'success' : 'destructive'}>
                            {stat.change >= 0 ? '+' : ''}{stat.change}%
                        </Badge>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default KitchenStats; 