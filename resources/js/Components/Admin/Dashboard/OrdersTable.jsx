import React, { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { format } from 'date-fns';
import { Link } from '@inertiajs/react';

const OrdersTable = ({ orders }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link href="/app/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  Order ID
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('total')}
                >
                  Amount
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  Status
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('created_at')}
                >
                  Date
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.restaurant.name}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/app/orders/${order.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default OrdersTable; 