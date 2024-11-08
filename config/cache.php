<?php

return [
    'enabled' => env('CACHE_ENABLED', true),
    
    'prefix' => env('CACHE_PREFIX', 'app'),
    
    'ttl' => [
        'default' => 3600, // 1 hour
        'blogs' => 1800,   // 30 minutes
        'categories' => 3600, // 1 hour
        'files' => 7200,   // 2 hours
    ],
    
    'tags' => [
        'blogs' => ['blogs', 'content'],
        'categories' => ['categories', 'content'],
        'files' => ['files', 'media'],
    ],
];
