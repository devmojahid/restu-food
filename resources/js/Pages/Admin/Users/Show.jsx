import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { formatDate } from '@/utils/format';

export default function Show({ user }) {
  return (
    <>
      <Head title={`User: ${user.name}`} />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <div className="flex items-center gap-2">
            <Link href={route('app.users.index')}>
              <Button variant="outline">Back to Users</Button>
            </Link>
            <Link href={route('app.users.edit', user.id)}>
              <Button>Edit User</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar ?? '/images/placeholder.png'} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-lg">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={user.is_active ? "success" : "destructive"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Joined</span>
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{formatDate(user.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Roles & Permissions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>User roles and associated permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Assigned Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user.roles?.map(role => (
                    <Badge key={role.id} variant="secondary">{role.name}</Badge>
                  ))}
                  {!user.roles?.length && <span className="text-muted-foreground">No roles assigned</span>}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Effective Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {user.permissions?.map(permission => (
                    <div key={permission} className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{permission}</span>
                    </div>
                  ))}
                  {!user.permissions?.length && <span className="text-muted-foreground">No permissions available</span>}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Info Card */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Phone</h3>
                  <p className="text-muted-foreground">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Address</h3>
                  <p className="text-muted-foreground">{user.address || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">User ID</h3>
                  <p className="text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Email Verified</h3>
                  <p className="text-muted-foreground">
                    {user.email_verified_at 
                      ? `Yes, on ${formatDate(user.email_verified_at)}` 
                      : 'Not verified'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="w-full flex justify-end">
                <Link 
                  href={route('app.users.edit', user.id)} 
                  className="text-primary hover:underline"
                >
                  Manage user
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
} 