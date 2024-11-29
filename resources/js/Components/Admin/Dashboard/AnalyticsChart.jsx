import React from 'react';
import { Card } from '@/Components/ui/card';
import { Select } from '@/Components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AnalyticsChart = ({ data, title, timeRange, onTimeRangeChange }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
        <Select
          value={timeRange}
          onValueChange={onTimeRangeChange}
          className="w-32"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </div>
      
      <div className="h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsChart; 