<?php

return [
    'default' => env('DEFAULT_CURRENCY', 'USD'),
    
    'api' => [
        'key' => env('EXCHANGE_RATE_API_KEY'),
        'endpoint' => env('EXCHANGE_RATE_API_ENDPOINT', 'https://api.exchangerate-api.com/v4/latest/USD'),
    ],
    
    'cache' => [
        'ttl' => env('CURRENCY_CACHE_TTL', 3600),
    ],
    
    'format' => [
        'decimal_places' => 2,
        'decimal_separator' => '.',
        'thousand_separator' => ',',
    ],
]; 