<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_distance' => $this->resource['total_distance'],
            'total_time' => $this->resource['total_time'],
            'average_speed' => $this->resource['average_speed'],
            'stops_made' => $this->resource['stops_made'],
            'status_history' => $this->resource['status_history'],
        ];
    }
} 