<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Collection;
use Spatie\Permission\Traits\HasRoles;

trait HasRolesAndPermissions
{
    use HasRoles;

    public function getAllPermissionsAttribute(): Collection
    {
        return $this->getAllPermissions();
    }

    public function hasRequiredRole(array|string $roles): bool
    {
        return $this->hasAnyRole($roles);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('Admin');
    }

    public function isBranchManager(): bool
    {
        return $this->hasRole('Branch Manager');
    }

    public function isKitchenStaff(): bool
    {
        return $this->hasRole('Kitchen Staff');
    }

    public function isDeliveryPersonnel(): bool
    {
        return $this->hasRole('Delivery Personnel');
    }

    public function isCustomer(): bool
    {
        return $this->hasRole('Customer');
    }
}
