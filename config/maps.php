<?php

return [
    'google' => [
        'api_key' => env('GOOGLE_MAPS_API_KEY'),
        'libraries' => env('GOOGLE_MAPS_LIBRARIES', 'places,geometry'),
        'default_center' => [
            'lat' => env('GOOGLE_MAPS_DEFAULT_LAT', 0),
            'lng' => env('GOOGLE_MAPS_DEFAULT_LNG', 0),
        ],
        'default_zoom' => env('GOOGLE_MAPS_DEFAULT_ZOOM', 12),
    ],
]; 