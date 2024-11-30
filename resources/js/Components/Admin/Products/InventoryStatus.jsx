import React from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  Archive,
  ShoppingCart
} from 'lucide-react';

const InventoryStatus = ({ inventory }) => {
  const getStockLevel = (quantity) => {
    if (quantity === 0) return { color: 'bg-red-500', label: 'Out of Stock' };
    if (quantity <= 5) return { color: 'bg-amber-500', label: 'Low Stock' };
    return { color: 'bg-green-500', label: 'In Stock' };
  };

  const calculatePercentage = (value, total) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Inventory Status</h2>
        </div>
        <Badge variant="outline">
          {inventory?.total_products || 0} Products
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Stock Level Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              <span>Low Stock Items</span>
            </div>
            <Badge variant="warning">
              {inventory?.low_stock || 0}
            </Badge>
          </div>
          <Progress 
            value={calculatePercentage(inventory?.low_stock, inventory?.total_products)} 
            className="bg-amber-100"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Archive className="w-5 h-5 text-red-500 mr-2" />
              <span>Out of Stock</span>
            </div>
            <Badge variant="destructive">
              {inventory?.out_of_stock || 0}
            </Badge>
          </div>
          <Progress 
            value={calculatePercentage(inventory?.out_of_stock, inventory?.total_products)} 
            className="bg-red-100"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 text-green-500 mr-2" />
              <span>Available Stock</span>
            </div>
            <Badge variant="success">
              {inventory?.total_stock || 0}
            </Badge>
          </div>
          <Progress 
            value={calculatePercentage(
              inventory?.total_stock - inventory?.low_stock - inventory?.out_of_stock,
              inventory?.total_stock
            )} 
            className="bg-green-100"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Average Stock Level</p>
            <p className="text-lg font-semibold">
              {Math.round(inventory?.avg_stock || 0)} units
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock Value</p>
            <p className="text-lg font-semibold">
              ${((inventory?.total_stock || 0) * 100).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InventoryStatus; 