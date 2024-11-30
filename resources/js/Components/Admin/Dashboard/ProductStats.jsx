import React from 'react';
import { Card } from '@/Components/ui/card';
import { 
    Package,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Percent,
    AlertTriangle,
    Archive,
    BarChart2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage, description }) => (
    <Card className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold mt-2">{value}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
                {percentage && (
                    <div className={`flex items-center mt-2 text-sm ${
                        trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                        <span>{trend === 'up' ? '↑' : '↓'}</span>
                        <span className="ml-1">{percentage}%</span>
                    </div>
                )}
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="w-5 h-5 text-primary" />
            </div>
        </div>
    </Card>
);

const ProductStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Revenue"
                value={`$${stats?.summary?.total_revenue?.toLocaleString() || '0'}`}
                icon={DollarSign}
                trend="up"
                percentage={stats?.summary?.revenue_growth || '0'}
                description="Overall earnings"
            />
            <StatCard
                title="Total Orders"
                value={stats?.summary?.total_orders?.toLocaleString() || '0'}
                icon={ShoppingCart}
                trend="up"
                percentage={stats?.summary?.orders_growth || '0'}
                description="Completed orders"
            />
            <StatCard
                title="Average Order Value"
                value={`$${stats?.summary?.avg_order_value?.toFixed(2) || '0'}`}
                icon={TrendingUp}
                trend={stats?.summary?.aov_trend || 'up'}
                percentage={stats?.summary?.aov_growth || '0'}
                description="Per order value"
            />
            <StatCard
                title="Profit Margin"
                value={`${stats?.summary?.profit_margin?.toFixed(1) || '0'}%`}
                icon={Percent}
                trend={stats?.summary?.margin_trend || 'up'}
                percentage={stats?.summary?.margin_growth || '0'}
                description="Overall margin"
            />
        </div>
    );
};

export default ProductStats; 