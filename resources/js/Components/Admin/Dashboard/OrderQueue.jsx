import React, { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { 
  ChefHat, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Timer,
  Utensils,
  ArrowRight,
  Flame,
  Coffee,
  Pizza,
  Salad
} from 'lucide-react';

const OrderQueue = ({ orders, onStatusChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Orders', icon: Utensils },
    { id: 'urgent', label: 'Urgent', icon: AlertCircle },
    { id: 'starters', label: 'Starters', icon: Salad },
    { id: 'main', label: 'Main Course', icon: Flame },
    { id: 'pizza', label: 'Pizza', icon: Pizza },
    { id: 'drinks', label: 'Drinks', icon: Coffee },
  ];

  const ordersByCategory = {
    all: orders,
    urgent: orders?.filter(order => order.is_priority),
    starters: orders?.filter(order => order.items.some(item => item.category === 'starters')),
    main: orders?.filter(order => order.items.some(item => item.category === 'main')),
    pizza: orders?.filter(order => order.items.some(item => item.category === 'pizza')),
    drinks: orders?.filter(order => order.items.some(item => item.category === 'drinks')),
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ChefHat className="w-6 h-6 mr-2" />
          Order Queue
        </h2>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-6 gap-4 bg-transparent">
          {categories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <category.icon className="w-4 h-4" />
              <span className="hidden md:inline">{category.label}</span>
              {category.id !== 'all' && (
                <Badge variant="secondary" className="ml-auto">
                  {ordersByCategory[category.id]?.length || 0}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="space-y-4">
              {ordersByCategory[category.id]?.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order}
                  onStatusChange={onStatusChange}
                />
              ))}

              {(!ordersByCategory[category.id] || ordersByCategory[category.id].length === 0) && (
                <div className="text-center py-12">
                  <category.icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No {category.label.toLowerCase()} in queue</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

const OrderCard = ({ order, onStatusChange }) => {
  const getTimeStatus = (elapsed, estimated) => {
    const percentage = (elapsed / estimated) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const timeStatus = getTimeStatus(order.elapsed_time, order.estimated_time);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">Order #{order.id}</h3>
              {order.is_priority && (
                <Badge variant="danger" className="flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Priority
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">Table {order.table_number}</p>
          </div>
        </div>
        <Badge variant={
          order.status === 'pending' ? 'warning' :
          order.status === 'processing' ? 'default' :
          'success'
        }>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Utensils className="w-4 h-4 text-gray-400" />
              <span>{item.quantity}x {item.name}</span>
              {item.special_instructions && (
                <Badge variant="outline" className="text-xs">
                  Special Request
                </Badge>
              )}
            </div>
            <Badge variant="secondary">
              {item.preparation_time} mins
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <div className="flex items-center">
            <Timer className="w-4 h-4 mr-1" />
            <span>Elapsed: {order.elapsed_time} mins</span>
          </div>
          <span className={
            timeStatus === 'danger' ? 'text-rose-600' :
            timeStatus === 'warning' ? 'text-amber-600' :
            'text-emerald-600'
          }>
            {order.estimated_time - order.elapsed_time} mins left
          </span>
        </div>
        <Progress 
          value={(order.elapsed_time / order.estimated_time) * 100}
          className={`h-2 ${
            timeStatus === 'danger' ? 'bg-rose-500' :
            timeStatus === 'warning' ? 'bg-amber-500' :
            'bg-emerald-500'
          }`}
        />
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        {order.status === 'pending' && (
          <Button
            size="sm"
            onClick={() => onStatusChange(order.id, 'processing')}
          >
            Start Preparing
          </Button>
        )}
        {order.status === 'processing' && (
          <Button
            size="sm"
            variant="success"
            onClick={() => onStatusChange(order.id, 'completed')}
          >
            Mark as Ready
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderQueue; 