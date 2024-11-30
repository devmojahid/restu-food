import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Package, TrendingUp, TrendingDown, DollarSign, Box, Users } from 'lucide-react';
import { Progress } from '@/Components/ui/progress';
import { LoadingState } from '@/Components/ui/loading-state';

const TopProducts = ({ products = [], isLoading = false }) => {
  const maxRevenue = products.length > 0 
    ? Math.max(...products.map(p => p.total_revenue))
    : 0;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingState message="Loading products data..." />
        </CardContent>
      </Card>
    );
  }

  if (!products.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Top Performing Products
          </CardTitle>
          <p className="text-sm text-gray-500">Best selling products by revenue</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <Package className="w-12 h-12 mb-4 opacity-50" />
            <p>No product data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Top Performing Products
        </CardTitle>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-500 mb-1" />
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-semibold">
              ${products.reduce((sum, p) => sum + p.total_revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <Box className="w-5 h-5 text-green-500 mb-1" />
            <p className="text-sm text-gray-600">Total Units</p>
            <p className="text-lg font-semibold">
              {products.reduce((sum, p) => sum + p.total_quantity, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <Users className="w-5 h-5 text-purple-500 mb-1" />
            <p className="text-sm text-gray-600">Avg. Growth</p>
            <p className="text-lg font-semibold">
              {(products.reduce((sum, p) => sum + p.growth_rate, 0) / products.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholders/product-placeholder.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">{product.total_quantity.toLocaleString()} units</span>
                      {product.growth_rate > 0 ? (
                        <div className="flex items-center text-green-500">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          <span>+{product.growth_rate}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          <span>{product.growth_rate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-lg">
                    ${product.total_revenue.toLocaleString()}
                  </span>
                  <div className="text-sm text-gray-500">
                    {((product.total_revenue / maxRevenue) * 100).toFixed(1)}% of max
                  </div>
                </div>
              </div>
              <Progress 
                value={(product.total_revenue / maxRevenue) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts; 