<?php

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Frontend\Services\HomeService;  
use Illuminate\Support\Facades\Log;

final class HomeController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    public function index()
    {
        try {
            // Try to get dynamic data from the service
            $data = $this->homeService->getHomePageData();
            
            // Handle any potential Closure values by ensuring all data is serializable
            $data = $this->ensureSerializable($data);
         
            return Inertia::module('Frontend::Home/Index', $data);
        } catch (\PDOException $e) {
            // Specific handling for database connection errors
            Log::error('Database connection error on homepage load', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->renderFallbackPage('Database connection error: ' . $this->getSafeErrorMessage($e));
        } catch (\ErrorException $e) {
            // Handle PHP errors like undefined indexes, null object operations, etc.
            Log::error('PHP error on homepage load', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->renderFallbackPage('System error: ' . $this->getSafeErrorMessage($e));
        } catch (\Exception $e) {
            // General exception handling
            Log::error('Failed to load homepage', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->renderFallbackPage('Failed to load homepage data: ' . $this->getSafeErrorMessage($e));
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
                if (is_object($value)) {
                    if ($value instanceof \Closure) {
                        // Replace closures with a string marker
                        $data[$key] = '[Function]';
                    } elseif (!method_exists($value, '__toString')) {
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
        } elseif (is_object($data)) {
            if ($data instanceof \Closure) {
                return '[Function]';
            } elseif (!method_exists($data, '__toString')) {
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

    /**
     * Creates a user-friendly, safe error message without sensitive details
     */
    private function getSafeErrorMessage(\Throwable $e): string
    {
        $message = $e->getMessage();
        
        // Strip out any sensitive information like SQL queries, passwords, etc.
        $sensitivePatterns = [
            '/SQLSTATE\[\w+\]:.*?:/i',
            '/\b(?:password|secret|key|token)\b\s*=\s*[^\s,]+/i',
        ];
        
        $safeMessage = preg_replace($sensitivePatterns, '', $message);
        
        // Check if the message is empty after sanitization
        if (empty(trim($safeMessage))) {
            return 'An unexpected error occurred.';
        }
        
        // Limit the length of the message
        if (strlen($safeMessage) > 150) {
            $safeMessage = substr($safeMessage, 0, 147) . '...';
        }
        
        return $safeMessage;
    }

    /**
     * Renders a fallback page with static data when dynamic data can't be loaded
     */
    private function renderFallbackPage(string $errorMessage = null): \Inertia\Response
    {
        return Inertia::module('Frontend::Home/Index', [ 
            'heroSlides' => [
                [
                    'id' => 1,
                    'title' => 'Welcome to Our Restaurant',
                    'description' => 'Enjoy delicious food delivered to your doorstep',
                    'image' => '/images/placeholder-hero.jpg',
                    'cta' => ['text' => 'Order Now', 'link' => '/menu']
                ]
            ],
            'featuredRestaurants' => [],
            'featuredDishes' => [],
            'popularDishes' => [],
            'popularCategories' => [],
            'specialOffers' => [],
            'stats' => [],
            'testimonials' => [],
            'error' => $errorMessage,
            'isUsingFallbackData' => true
        ]);
    }
} 