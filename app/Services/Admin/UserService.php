<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

final class UserService extends BaseService
{
    protected string $model = User::class;
    protected string $cachePrefix = 'users:';
    protected array $searchableFields = ['name', 'email'];
    protected array $filterableFields = ['status'];
    protected array $sortableFields = ['name', 'email', 'created_at'];
    protected array $relationships = ['roles'];

    public function getAllRoles(): array
    {
        return Role::all(['id', 'name'])->toArray();
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $users = $this->model::whereIn('id', $ids)->get();
            foreach ($users as $user) {
                // Delete avatar if exists
                if ($user->avatar) {
                    $user->files()->where('collection', 'avatar')->delete();
                }
                $user->delete();
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk delete failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'status'): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([
                $field => $status
            ]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk status update failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
