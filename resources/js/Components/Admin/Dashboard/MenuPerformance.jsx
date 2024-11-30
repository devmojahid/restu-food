import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { 
    Utensils, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle,
    DollarSign
} from 'lucide-react';

const MenuPerformance = ({ data = {} }) => {
    const { top_items = [], categories = [], recommendations = {} } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Menu Performance
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Top Performing Items */}
                <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Top Items</h3>
                    {top_items.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <span className="text-sm text-gray-500">{item.category}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Badge className={item.trend >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                        {item.trend >= 0 ? (
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 mr-1" />
                                        )}
                                        {Math.abs(item.trend)}%
                                    </Badge>
                                    <Badge className={
                                        item.stock_status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                        item.stock_status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }>
                                        {item.stock_status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>{item.orders} orders</span>
                                <span className="font-medium">${item.revenue.toLocaleString()}</span>
                            </div>
                            <Progress value={item.rating * 20} className="h-1" />
                        </div>
                    ))}
                </div>

                {/* Category Performance */}
                <div className="mt-8 space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Category Performance</h3>
                    {categories.map((category, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium">{category.name}</h4>
                                    <span className="text-sm text-gray-500">
                                        {category.items_count} items • {category.total_orders} orders
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">${category.revenue.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">
                                        Rating: {category.avg_rating}/5
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price Recommendations */}
                <div className="mt-8 space-y-4">
                    <h3 className="font-medium text-sm text-gray-500">Price Recommendations</h3>
                    {recommendations.price_adjustments?.map((adjustment, index) => (
                        <div 
                            key={index}
                            className="p-3 rounded-lg bg-blue-50 border border-blue-100"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium">{adjustment.item}</h4>
                                    <p className="text-sm text-blue-600 mt-1">
                                        {adjustment.reason}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Current:</span>
                                        <span className="font-medium">${adjustment.current_price}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-500">Suggested:</span>
                                        <span className="font-medium text-blue-600">
                                            ${adjustment.suggested_price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default MenuPerformance; 