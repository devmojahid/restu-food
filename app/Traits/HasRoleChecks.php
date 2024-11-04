<?php

declare(strict_types=1);

namespace App\Traits;

trait HasRoleChecks
{
    public function hasAnyRole(array|string $roles): bool
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }

        return $this->roles()->whereIn('name', $roles)->exists();
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
