<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

final class UserService extends BaseService
{
    protected string $model = User::class;
    protected string $cachePrefix = 'users:';
    protected array $searchableFields = ['name', 'email'];
    protected array $filterableFields = ['status'];
    protected array $sortableFields = ['name', 'email', 'created_at'];
    protected array $relationships = ['roles', 'files'];

    public function store(array $data): User
    {
        try {
            DB::beginTransaction();

            // Hash password if provided
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            // Create user
            $user = $this->model::create($data);

            // Assign role
            if (!empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            // Handle avatar upload
            if (!empty($data['files']['avatar'])) {
                $this->handleFileUploads($user, $data['files']);
            }

            // Handle meta data
            if (!empty($data['meta'])) {
                foreach ($data['meta'] as $key => $value) {
                    $user->setMeta($key, $value);
                }
            }

            DB::commit();

            return $user->fresh(['roles', 'files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function update(int $id, array $data): User
    {
        try {
            DB::beginTransaction();

            $user = $this->findOrFail($id);

            // Hash password if provided
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Update user
            $user->update($data);

            // Update role if provided
            if (!empty($data['role'])) {
                $user->syncRoles([$data['role']]);
            }

            // Handle avatar update
            if (isset($data['files'])) {
                $this->syncFileCollections($user, $data['files']);
            }

            // Handle meta data
            if (!empty($data['meta'])) {
                foreach ($data['meta'] as $key => $value) {
                    $user->setMeta($key, $value);
                }
            }

            DB::commit();

            return $user->fresh(['roles', 'files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('User update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function updateProfile(int $id, array $data): User
    {
        try {
            DB::beginTransaction();

            $user = $this->findOrFail($id);

            // Update basic info
            $user->update([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ]);

            // Handle avatar
            if (isset($data['avatar'])) {
                $this->syncFileCollections($user, ['avatar' => $data['avatar']]);
            }

            // Update meta data
            $metaFields = [
                'display_name',
                'bio',
                'location',
                'company',
                'position',
                'website',
                'social_links',
                'notification_preferences',
            ];

            foreach ($metaFields as $field) {
                if (isset($data[$field])) {
                    $user->setMeta($field, $data[$field]);
                }
            }

            DB::commit();

            return $user->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Profile update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function updateStatus(int $id, string $status): bool
    {
        try {
            $user = $this->findOrFail($id);
            return $user->update(['status' => $status]);
        } catch (\Exception $e) {
            Log::error('User status update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function updateSecuritySettings(int $id, array $data): bool
    {
        try {
            DB::beginTransaction();

            $user = $this->findOrFail($id);

            if (!empty($data['password'])) {
                $user->update(['password' => Hash::make($data['password'])]);
                $user->setMeta('password_updated_at', now());
            }

            if (isset($data['two_factor_enabled'])) {
                $user->setMeta('two_factor_enabled', $data['two_factor_enabled']);
            }

            if (isset($data['security_notifications'])) {
                $user->setMeta('security_notifications', $data['security_notifications']);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Security settings update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function updateNotificationPreferences(int $id, array $preferences): bool
    {
        try {
            $user = $this->findOrFail($id);
            $user->setMeta('notification_preferences', $preferences);
            return true;
        } catch (\Exception $e) {
            Log::error('Notification preferences update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
