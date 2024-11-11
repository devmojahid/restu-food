<?php

declare(strict_types=1);

namespace App\Traits;

trait LogsUserActivity
{
    protected static function bootLogsUserActivity(): void
    {
        static::created(function ($model) {
            if (auth()->check()) {
                log_user_activity(auth()->id(), 'created_' . strtolower(class_basename($model)), [
                    'model' => class_basename($model),
                    'id' => $model->id,
                ]);
            }
        });

        static::updated(function ($model) {
            if (auth()->check()) {
                log_user_activity(auth()->id(), 'updated_' . strtolower(class_basename($model)), [
                    'model' => class_basename($model),
                    'id' => $model->id,
                    'changes' => $model->getChanges(),
                ]);
            }
        });

        static::deleted(function ($model) {
            if (auth()->check()) {
                log_user_activity(auth()->id(), 'deleted_' . strtolower(class_basename($model)), [
                    'model' => class_basename($model),
                    'id' => $model->id,
                ]);
            }
        });
    }
} 