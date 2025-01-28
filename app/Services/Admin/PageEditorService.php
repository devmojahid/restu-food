<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Services\Admin\OptionsService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

abstract class PageEditorService
{
    protected string $pageKey;
    protected int $cacheTtl = 3600;

    public function __construct(
        protected readonly OptionsService $optionsService
    ) {}

    public function getSettings(): array
    {
        return Cache::remember(
            $this->getCacheKey(),
            $this->cacheTtl,
            fn () => $this->optionsService->getGroup($this->pageKey)->toArray()
        );
    }

    public function updateSettings(array $options, array $files = []): void
    {
        // Handle file uploads
        foreach ($files as $key => $file) {
            if ($file instanceof UploadedFile) {
                $options[$key] = $this->handleFileUpload($file);
            }
        }

        // Save options
        $this->optionsService->setMany($options, $this->pageKey);

        // Clear cache
        $this->clearCache();
    }

    // Make these methods public so they can be accessed from the controller
    public function getDefaultSettings(): array
    {
        return $this->defineDefaultSettings();
    }

    public function getDynamicData(): array
    {
        return $this->defineDynamicData();
    }

    protected function handleFileUpload(UploadedFile $file): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs("pages/{$this->pageKey}/{$this->getFileType($file)}", $filename, 'public');
    }

    protected function clearCache(): void
    {
        Cache::forget($this->getCacheKey());
        Cache::tags([$this->pageKey, 'frontend'])->flush();
    }

    protected function getCacheKey(): string
    {
        return sprintf('%s_settings', $this->pageKey);
    }

    protected function getFileType(UploadedFile $file): string
    {
        return match ($file->getMimeType()) {
            'image/jpeg', 'image/png', 'image/gif' => 'images',
            'video/mp4', 'video/quicktime' => 'videos',
            default => 'others',
        };
    }

    // Abstract methods that must be implemented by child classes
    abstract protected function defineDefaultSettings(): array;
    abstract protected function defineDynamicData(): array;
} 