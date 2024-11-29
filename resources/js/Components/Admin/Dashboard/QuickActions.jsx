import React from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import {
  Plus,
  FileText,
  Settings,
  Users,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

const ActionButton = ({ icon: Icon, label, href, onClick }) => (
  <Link href={href}>
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  </Link>
);

const QuickActions = ({ role = 'admin' }) => {
  const adminActions = [
    { icon: Plus, label: 'Add New User', href: '/app/users/create' },
    { icon: FileText, label: 'Create Blog Post', href: '/app/blogs/create' },
    { icon: Settings, label: 'System Settings', href: '/app/settings' },
    { icon: Users, label: 'Manage Roles', href: '/app/roles' },
  ];

  const restaurantActions = [
    { icon: Plus, label: 'Add New Product', href: '/app/products/create' },
    { icon: ShoppingBag, label: 'Manage Orders', href: '/app/orders' },
    { icon: MessageSquare, label: 'Customer Support', href: '/app/support' },
    { icon: Settings, label: 'Restaurant Settings', href: '/app/settings/restaurant' },
  ];

  const actions = role === 'admin' ? adminActions : restaurantActions;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
      </div>
    </Card>
  );
};

export default QuickActions; 