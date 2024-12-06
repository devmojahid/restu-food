<?php

return [
    'cache' => [
        'enabled' => env('ZONE_CACHE_ENABLED', true),
        'ttl' => env('ZONE_CACHE_TTL', 3600), // 1 hour
    ],
    
    'validation' => [
        'min_points' => 3,
        'max_points' => 50,
    ],
    
    'map' => [
        'default_center' => [
            'lat' => env('MAP_DEFAULT_LAT', 23.8103),
            'lng' => env('MAP_DEFAULT_LNG', 90.4125),
        ],
        'default_zoom' => env('MAP_DEFAULT_ZOOM', 12),
    ],
    
    'delivery' => [
        'min_charge' => env('DELIVERY_MIN_CHARGE', 0),
        'max_charge' => env('DELIVERY_MAX_CHARGE', 1000),
        'per_km_charge' => env('DELIVERY_PER_KM_CHARGE', 1),
        'max_cod_amount' => env('DELIVERY_MAX_COD_AMOUNT', 5000),
    ],
]; 