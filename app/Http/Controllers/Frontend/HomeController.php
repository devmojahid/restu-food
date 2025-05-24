<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Frontend\HomeService;
use Illuminate\Support\Facades\Log;

final class HomeController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    public function index()
    {
        try {
            $data = $this->homeService->getHomePageData();
            
            // Handle any potential Closure values by converting to arrays/strings
            $data = $this->ensureSerializable($data);
         
            return Inertia::render('Frontend/Home/Index', $data);
        } catch (\Exception $e) {
            Log::error('Failed to load homepage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return a fallback state with error
            return Inertia::render('Frontend/Home/Index', [
                'heroSlides' => [],
                'featuredRestaurants' => [],
                'featuredDishes' => [],
                'popularDishes' => [],
                'popularCategories' => [],
                'specialOffers' => [],
                'stats' => [],
                'testimonials' => [],
                'error' => 'Failed to load homepage data'
            ]);
        }
    }
    
    /**
     * Ensure that all data is serializable by converting any closures 
     * or unserializable objects to arrays or strings
     */
    private function ensureSerializable($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_object($value) && !($value instanceof \Stringable) && !method_exists($value, '__toString')) {
                    if ($value instanceof \Closure) {
                        // For closures, just convert to a string representation
                        $data[$key] = '[Function]';
                    } else {
                        // For other objects, try to convert to array
                        try {
                            if (method_exists($value, 'toArray')) {
                                $data[$key] = $value->toArray();
                            } else {
                                $data[$key] = (array) $value;
                            }
                        } catch (\Exception $e) {
                            // If conversion fails, use a placeholder
                            $data[$key] = '[Object: ' . get_class($value) . ']';
                        }
                    }
                } elseif (is_array($value)) {
                    // Recursively process nested arrays
                    $data[$key] = $this->ensureSerializable($value);
                }
            }
        } elseif (is_object($data) && !($data instanceof \Stringable) && !method_exists($data, '__toString')) {
            if ($data instanceof \Closure) {
                return '[Function]';
            } else {
                try {
                    if (method_exists($data, 'toArray')) {
                        return $data->toArray();
                    } else {
                        return (array) $data;
                    }
                } catch (\Exception $e) {
                    return '[Object: ' . get_class($data) . ']';
                }
            }
        }
        
        return $data;
    }
} 