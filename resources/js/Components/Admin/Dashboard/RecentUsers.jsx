import React from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';

const RecentUsers = ({ users }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Recent Users</h2>
        <Link href="/app/users">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {users?.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user.avatar?.url} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(user.created_at), 'MMM dd, yyyy')}
            </div>
          </div>
        ))}

        {users?.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No recent users found
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentUsers; 