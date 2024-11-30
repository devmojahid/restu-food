<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class KitchenStaffApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'restaurant' => [
                'id' => $this->restaurant->id,
                'name' => $this->restaurant->name,
                'address' => $this->restaurant->address,
            ],
            'position_applied' => $this->position_applied,
            'years_of_experience' => $this->years_of_experience,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'status_color' => $this->status_color,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'files' => [
                'resume' => $this->getFirstMediaUrl('resume'),
                'id_proof' => $this->getFirstMediaUrl('id_proof'),
                'photo' => $this->getFirstMediaUrl('photo'),
                'certificates' => $this->getMedia('certificates')->map(fn($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                ]),
            ],
            'can' => [
                'approve' => $request->user()?->can('approve', $this->resource),
                'reject' => $request->user()?->can('reject', $this->resource),
                'delete' => $request->user()?->can('delete', $this->resource),
            ],
        ];
    }
} 