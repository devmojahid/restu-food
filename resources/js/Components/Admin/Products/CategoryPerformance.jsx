import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';

const COLORS = ['#3B82F6', '#22C55E', '#EAB308', '#EC4899', '#8B5CF6', '#F97316'];

const CategoryPerformance = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Category Performance
          </CardTitle>
          <p className="text-sm text-gray-500">Revenue distribution by category</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <Layers className="w-12 h-12 mb-4 opacity-50" />
            <p>No category data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedData = data.map((item, index) => ({
    name: item.name,
    value: item.total_revenue,
    color: COLORS[index % COLORS.length],
    orders: item.total_orders,
    quantity: item.total_quantity
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-500">
            Revenue: ${data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Orders: {data.orders.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Units: {data.quantity.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          Category Performance
        </CardTitle>
        <p className="text-sm text-gray-500">Revenue distribution by category</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formattedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {formattedData.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.orders.toLocaleString()} orders • {category.quantity.toLocaleString()} units
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  ${category.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPerformance; 