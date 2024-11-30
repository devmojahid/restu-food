import React from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const ProfitMargins = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const calculateMarginPercentage = () => {
    if (!data?.total_revenue || !data?.total_cost) return 0;
    return ((data.total_revenue - data.total_cost) / data.total_revenue) * 100;
  };

  const marginPercentage = calculateMarginPercentage();

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <DollarSign className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-semibold">Profit Margins</h2>
      </div>

      <div className="space-y-6">
        {/* Revenue */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <span className="font-semibold">{formatCurrency(data?.total_revenue)}</span>
          </div>
          <Progress value={100} className="bg-blue-100" />
        </div>

        {/* Cost */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Total Cost</span>
            <span className="font-semibold">{formatCurrency(data?.total_cost)}</span>
          </div>
          <Progress 
            value={(data?.total_cost / data?.total_revenue) * 100 || 0} 
            className="bg-red-100" 
          />
        </div>

        {/* Profit */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Net Profit</span>
            <span className="font-semibold">{formatCurrency(data?.total_profit)}</span>
          </div>
          <Progress 
            value={(data?.total_profit / data?.total_revenue) * 100 || 0} 
            className="bg-green-100" 
          />
        </div>

        {/* Margin Percentage */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Profit Margin</h3>
              <p className="text-sm text-gray-500">Overall margin percentage</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {marginPercentage.toFixed(1)}%
              </div>
              <div className={`flex items-center text-sm ${
                marginPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marginPercentage >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                vs last period
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfitMargins; 