<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'restaurant_name' => $this->restaurant_name,
            'restaurant_email' => $this->restaurant_email,
            'status' => $this->status,
            'status_label' => $this->status_label,
            // Format dates properly for the frontend
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            // Add other fields...
        ];
    }
} 