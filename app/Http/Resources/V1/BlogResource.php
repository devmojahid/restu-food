<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'featured_image' => $this->whenLoaded('files', function () {
                $file = $this->getFirstFileByCollection('featured_image');
                // return $file ? new FileResource($file) : null;
            }),
            'tags' => $this->whenLoaded('tags', function () {
                return $this->tags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ]);
            }),
        ];
    }
}
