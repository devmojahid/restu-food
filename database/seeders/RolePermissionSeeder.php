<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

final class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions by group
        $permissions = [
            'dashboard' => [
                'dashboard.view',
                'dashboard.edit',
            ],
            'blog' => [
                'blog.list',
                'blog.create',
                'blog.edit',
                'blog.delete',
                'blog.approve',
            ],
            'category' => [
                'category.list',
                'category.create',
                'category.edit',
                'category.delete',
                'manage.categories',
            ],
            'admin' => [
                'admin.list',
                'admin.create',
                'admin.edit',
                'admin.delete',
            ],
            'role' => [
                'role.list',
                'role.create',
                'role.edit',
                'role.delete',
            ],
            'profile' => [
                'profile.view',
                'profile.edit',
            ],
            'order' => [
                'order.list',
                'order.create',
                'order.edit',
                'order.delete',
                'order.status.update',
            ],
            'delivery' => [
                'delivery.list',
                'delivery.assign',
                'delivery.status.update',
            ],
            'product-attributes' => [
                'product-attributes.list',
                'product-attributes.create',
                'product-attributes.edit',
                'product-attributes.delete',
            ],
            'currency' => [
                'currency.list',
                'currency.create',
                'currency.edit',
                'currency.delete',
            ],
        ];
        // Create permissions
        foreach ($permissions as $group => $groupPermissions) {
            foreach ($groupPermissions as $permission) {
                Permission::create([
                    'name' => $permission,
                    'group_name' => $group,
                    'guard_name' => 'web',
                ]);
            }
        }

        // Create roles and assign permissions
        $roles = [
            'Admin' => Permission::all(),
            'Restaurant' => Permission::whereIn('name', [
                'dashboard.view',
                'order.list',
                'order.edit',
                'order.status.update',
                'delivery.list',
                'delivery.assign',
                'profile.view',
                'profile.edit',
            ])->get(),
            'Kitchen' => Permission::whereIn('name', [
                'dashboard.view',
                'order.list',
                'order.status.update',
                'profile.view',
                'profile.edit',
            ])->get(),
            'Delivery' => Permission::whereIn('name', [
                'dashboard.view',
                'delivery.list',
                'delivery.status.update',
                'profile.view',
                'profile.edit',
            ])->get(),
            'Customer' => Permission::whereIn('name', [
                'order.create',
                'order.list',
                'profile.view',
                'profile.edit',
            ])->get(),
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
        // Assign admin role to admin@gmail.com user
        $admin = User::where('email', 'admin@gmail.com')->first();
        if ($admin) {
            $admin->assignRole('Admin');
        }
    }
}
