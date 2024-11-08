<?php

declare(strict_types=1);

namespace App\Traits;

trait HasTags
{
    public function addTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->tags = $tags;
            $this->save();
        }
    }

    public function removeTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        $this->tags = array_values(array_filter($tags, fn($t) => $t !== $tag));
        $this->save();
    }

    public function syncTags(array $tags): void
    {
        $this->tags = array_values(array_unique($tags));
        $this->save();
    }

    public function hasTag(string $tag): bool
    {
        return in_array($tag, $this->tags ?? []);
    }
} 