<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Option;
use App\Models\Category;
use App\Models\Restaurant;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

final class HomepageEditorService
{
    /**
     * The key used for homepage settings
     */
    private const HOMEPAGE_OPTION_KEY = 'homepage_settings';
    
    /**
     * Cache TTL in seconds
     */
    private const CACHE_TTL = 3600;

    /**
     * Get the current homepage settings
     */
    public function getSettings(): array
    {
        return Cache::remember('homepage_settings', self::CACHE_TTL, function () {
            // Get settings from database or return defaults if not found
            $option = Option::where('key', self::HOMEPAGE_OPTION_KEY)->first();
            
            if (!$option) {
                return $this->getDefaultSettings();
            }
            
            return $option->value ?? $this->getDefaultSettings();
        });
    }

    /**
     * Update homepage settings
     */
    public function updateSettings(array $data, array $files = []): void
    {
        try {
            // Process file uploads
            $processedData = $this->processFileUploads($data, $files);
            
            // Save to database
            Option::updateOrCreate(
                ['key' => self::HOMEPAGE_OPTION_KEY],
                [
                    'value' => $processedData,
                    'group' => 'appearance',
                    'autoload' => true,
                ]
            );
            
            // Clear cache
            $this->clearCache();
        } catch (\Exception $e) {
            throw new \Exception('Failed to update homepage settings: ' . $e->getMessage());
        }
    }

    /**
     * Process file uploads and update data accordingly
     */
    private function processFileUploads(array $data, array $files): array
    {
        try {
            foreach ($files as $key => $file) {
                if ($file instanceof UploadedFile) {
                    // If path contains an array key like "feedbacks.0.avatar"
                    if (str_contains($key, '.')) {
                        $segments = explode('.', $key);
                        $fieldName = $segments[0];
                        
                        if ($fieldName === 'feedbacks' && count($segments) >= 3) {
                            $index = (int) $segments[1];
                            $property = $segments[2];
                            
                            if (!isset($data[$fieldName])) {
                                $data[$fieldName] = [];
                            }
                            
                            if (!isset($data[$fieldName][$index])) {
                                $data[$fieldName][$index] = [];
                            }
                            
                            $data[$fieldName][$index][$property] = $this->uploadFile($file, "homepage/feedbacks");
                        }
                    } else {
                        // Regular field upload
                        $data[$key] = $this->uploadFile($file, "homepage/" . $this->getFileTypeFolder($key));
                    }
                }
            }
            
            // Sanitize data to prevent regex related issues
            $data = $this->sanitizeData($data);
            
            return $data;
        } catch (\Exception $e) {
            Log::error('Error processing file uploads', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Sanitize all data to prevent regex and other validation issues
     */
    private function sanitizeData(array $data): array
    {
        // Process all string values to ensure they don't cause validation issues
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->sanitizeData($value);
            } elseif (is_string($value)) {
                // Check for potential regex issues with color values
                if (in_array($key, ['primary_color', 'secondary_color']) && !empty($value)) {
                    // Sanitize color values that should be hex colors
                    $data[$key] = $this->sanitizeHexColor($value);
                } 
                
                // Check if hero_slides was saved as a JSON string (happens sometimes with form submissions)
                if ($key === 'hero_slides' && !empty($value)) {
                    try {
                        // Attempt to decode if it's a JSON string
                        $decoded = json_decode($value, true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                            $data[$key] = $decoded;
                        } else {
                            // If it's not valid JSON, initialize as empty array
                            $data[$key] = [];
                        }
                    } catch (\Exception $e) {
                        // In case of any error, initialize as empty array
                        $data[$key] = [];
                        Log::warning('Failed to parse hero_slides JSON', [
                            'value' => $value,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }
        }
        
        // Ensure hero_slides is always an array if it exists
        if (array_key_exists('hero_slides', $data) && !is_array($data['hero_slides'])) {
            $data['hero_slides'] = [];
        }
        
        return $data;
    }

    /**
     * Sanitize a hex color value
     * 
     * @param string $color The color value to sanitize
     * @return string The sanitized hex color
     */
    private function sanitizeHexColor(string $color): string
    {
        // Remove any whitespace
        $color = trim($color);
        
        // Ensure color starts with #
        if (substr($color, 0, 1) !== '#') {
            $color = '#' . $color;
        }
        
        // Strip any non-hex characters after the #
        $hex = preg_replace('/[^A-Fa-f0-9]/', '', substr($color, 1));
        
        // If we don't have a valid hex length, provide a default
        $length = strlen($hex);
        if ($length != 3 && $length != 6) {
            return '#22C55E'; // Default to a green color
        }
        
        return '#' . $hex;
    }

    /**
     * Upload a file and return its public path
     */
    private function uploadFile(UploadedFile $file, string $path): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $file->storeAs("public/{$path}", $filename);
        
        return "storage/{$path}/{$filename}";
    }

    /**
     * Get the appropriate folder based on field name
     */
    private function getFileTypeFolder(string $key): string
    {
        return match ($key) {
            'hero_image' => 'hero',
            'why_choose_us_image' => 'why_choose_us',
            default => 'images',
        };
    }

    /**
     * Clear relevant caches
     */
    private function clearCache(): void
    {
        try {
            // Clear the homepage settings cache
            Cache::forget('homepage_settings');
            
            // Try to flush tagged caches, but handle the case if tagging is not supported
            try {
                if (method_exists(Cache::getStore(), 'tags')) {
                    Cache::tags(['homepage', 'frontend'])->flush();
                }
            } catch (\Exception $e) {
                // If tagging is not supported, clear other relevant caches manually
                Cache::forget('homepage_settings_frontend');
                Cache::forget('home_page_data');
                Log::info('Cache tags not supported, clearing individual caches instead');
            }
        } catch (\Exception $e) {
            Log::error('Failed to clear cache: ' . $e->getMessage());
            // Don't rethrow the exception, just log it
        }
    }

    /**
     * Default settings for the homepage
     */
    public function getDefaultSettings(): array
    {
        return [
            // Hero Section
            'hero_enabled' => true,
            'hero_type' => 'single',
            'hero_title' => 'Order [Delicious Food] Online',
            'hero_subtitle' => 'Get your favorite food delivered to your doorstep',
            'hero_image' => null,
            'hero_cta_text' => 'Order Now',
            'hero_cta_link' => '/restaurants',
            'hero_background_overlay' => 0.5,
            'hero_text_alignment' => 'center',
            'hero_slides' => [],

            // Top Categories Section
            'top_categories_enabled' => true,
            'top_categories_title' => 'Popular [Food] Categories',
            'top_categories_count' => 8,
            'top_categories_layout' => 'grid',
            'top_categories_columns' => 4,
            'top_categories_show_description' => true,

            // Why Choose Us Section
            'why_choose_us_enabled' => true,
            'why_choose_us_title' => 'Why [Choose] Us',
            'why_choose_us_text' => 'We offer the best food delivery service',
            'why_choose_us_image' => null,
            'why_choose_us_layout' => 'side-by-side',
            'why_choose_us_image_position' => 'right',
            'why_choose_us_features' => [
                [
                    'title' => 'Fast Delivery',
                    'text' => 'Get your food delivered within 30 minutes',
                    'icon' => 'truck'
                ],
                [
                    'title' => 'Quality Food',
                    'text' => 'We ensure the best quality food',
                    'icon' => 'utensils'
                ]
            ],

            // Client Feedback Section
            'client_feedback_enabled' => true,
            'client_feedback_title' => 'What Our [Customers] Say',
            'client_feedback_subtitle' => 'Read what our customers say about us',
            'client_feedback_layout' => 'grid',
            'client_feedback_columns' => 3,
            'client_feedback_show_rating' => true,
            'client_feedback_show_date' => true,
            'feedbacks' => [],

            // Global Settings
            'layout_width' => 'contained',
            'section_spacing' => 'medium',
            'animations_enabled' => true,
            'scroll_animations' => true,
            'color_scheme' => 'system',
            'primary_color' => '#22C55E',
            'secondary_color' => '#0EA5E9',
            'font_heading' => 'inter',
            'font_body' => 'inter',
        ];
    }

    /**
     * Get dynamic data for the homepage editor
     */
    public function getDynamicData(): array
    {
        return [
            'categories' => $this->getCategories(),
            'featured_restaurants' => $this->getFeaturedRestaurants(),
            'popular_products' => $this->getPopularProducts(),
            'layout_options' => $this->getLayoutOptions(),
            'animation_options' => $this->getAnimationOptions(),
            'icon_options' => $this->getIconOptions(),
            'font_options' => $this->getFontOptions(),
            'color_presets' => $this->getColorPresets(),
        ];
    }

    /**
     * Get categories for the editor
     */
    private function getCategories(): Collection
    {
        return Cache::remember('homepage_editor_categories', 3600, function () {
            try {
                // First check which columns exist in the table
                $columns = Schema::getColumnListing('categories');
                
                // Build select array with only existing columns
                $selectColumns = ['id', 'name', 'slug'];
                
                // Add optional columns if they exist
                if (in_array('icon', $columns)) {
                    $selectColumns[] = 'icon';
                } else {
                    // If icon column doesn't exist, we'll add a default value
                    $selectColumns[] = DB::raw("NULL as icon");
                }
                
                if (in_array('description', $columns)) {
                    $selectColumns[] = 'description';
                } else {
                    $selectColumns[] = DB::raw("NULL as description");
                }
                
                if (in_array('image', $columns)) {
                    $selectColumns[] = 'image';
                } else {
                    $selectColumns[] = DB::raw("NULL as image");
                }
                
                // Check if position column exists for ordering
                $orderColumn = in_array('position', $columns) ? 'position' : 'id';
                
                // Check for the products relationship using categorizables table
                $hasCategorizablesTable = Schema::hasTable('categorizables');
                
                if ($hasCategorizablesTable) {
                    // Add the products_count as a subquery
                    $selectColumns[] = DB::raw("(select count(*) from `products` 
                        inner join `categorizables` on `products`.`id` = `categorizables`.`categorizable_id` 
                        where `categories`.`id` = `categorizables`.`category_id` 
                        and `categorizables`.`categorizable_type` = 'App\\Models\\Product'
                        and `products`.`deleted_at` is null) as `products_count`");
                } else {
                    // Fallback for products_count if no categorizables table
                    $selectColumns[] = DB::raw("0 as products_count");
                }
                
                $query = Category::select($selectColumns)
                    ->whereNull('deleted_at');
                    
                // Add is_active condition if the column exists
                if (in_array('is_active', $columns)) {
                    $query->where('is_active', true);
                }
                
                // Order by the appropriate column
                $query->orderBy($orderColumn);
                
                return $query->get();
            } catch (\Exception $e) {
                Log::error('Failed to fetch categories for homepage editor', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return collect([]); // Return empty collection on error
            }
        });
    }

    /**
     * Get featured restaurants for the editor
     */
    private function getFeaturedRestaurants(): Collection
    {
        return Cache::remember('homepage_editor_restaurants', 3600, function () {
            try {
                // Check which columns exist in the restaurants table
                $columns = Schema::getColumnListing('restaurants');
                $selectColumns = ['id', 'name', 'slug'];
                
                // Add optional columns if they exist
                if (in_array('logo', $columns)) {
                    $selectColumns[] = 'logo';
                } else {
                    $selectColumns[] = DB::raw("NULL as logo");
                }
                
                if (in_array('cover_image', $columns)) {
                    $selectColumns[] = 'cover_image';
                } else {
                    $selectColumns[] = DB::raw("NULL as cover_image");
                }
                
                if (in_array('delivery_time', $columns)) {
                    $selectColumns[] = 'delivery_time';
                } else {
                    $selectColumns[] = DB::raw("NULL as delivery_time");
                }
                
                if (in_array('rating', $columns)) {
                    $selectColumns[] = 'rating';
                } else {
                    $selectColumns[] = DB::raw("NULL as rating");
                }
                
                // Direct query approach - don't rely on model relationships
                $query = DB::table('restaurants')->select($selectColumns);
                
                if (Schema::hasColumn('restaurants', 'deleted_at')) {
                    $query->whereNull('deleted_at');
                }
                
                if (Schema::hasColumn('restaurants', 'is_active')) {
                    $query->where('is_active', true);
                }
                
                if (Schema::hasColumn('restaurants', 'is_featured')) {
                    $query->where('is_featured', true);
                }
                
                $restaurants = $query->take(8)->get();
                
                return $restaurants->map(function ($restaurant) {
                    // Convert to array and add default values
                    $restaurantArray = (array) $restaurant;
                    
                    // Add empty relationships as default
                    $restaurantArray['categories'] = [];
                    $restaurantArray['cuisines'] = [];
                    $restaurantArray['reviews_count'] = 0;
                    $restaurantArray['reviews_avg_rating'] = 0;
                    
                    return $restaurantArray;
                });
            } catch (\Exception $e) {
                Log::error('Failed to fetch featured restaurants', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                // Return empty collection on error
                return collect([]);
            }
        });
    }

    /**
     * Get popular products for the editor
     */
    private function getPopularProducts(): Collection
    {
        return Cache::remember('homepage_editor_products', 3600, function () {
            try {
                // Check which columns exist in the products table
                $columns = Schema::getColumnListing('products');
                $selectColumns = ['id', 'name', 'slug'];
                
                // Add optional columns if they exist
                if (in_array('image', $columns)) {
                    $selectColumns[] = 'image';
                } else {
                    $selectColumns[] = DB::raw("NULL as image");
                }
                
                if (in_array('price', $columns)) {
                    $selectColumns[] = 'price';
                } else {
                    $selectColumns[] = DB::raw("0 as price");
                }
                
                if (in_array('sale_price', $columns)) {
                    $selectColumns[] = 'sale_price';
                } else {
                    $selectColumns[] = DB::raw("NULL as sale_price");
                }
                
                if (in_array('rating', $columns)) {
                    $selectColumns[] = 'rating';
                } else {
                    $selectColumns[] = DB::raw("NULL as rating");
                }
                
                // Direct query approach - don't rely on relationships at all
                // since we can't be sure of their implementation
                $query = DB::table('products')->select($selectColumns);
                
                if (Schema::hasColumn('products', 'deleted_at')) {
                    $query->whereNull('deleted_at');
                }
                
                if (Schema::hasColumn('products', 'is_active')) {
                    $query->where('is_active', true);
                }
                
                if (Schema::hasColumn('products', 'is_popular')) {
                    $query->where('is_popular', true);
                }
                
                $products = $query->take(8)->get();
                
                return $products->map(function ($product) {
                    // Convert to array and add default values
                    $productArray = (array) $product;
                    
                    // Add empty relationships as default
                    $productArray['restaurant'] = ['id' => null, 'name' => 'Unknown', 'slug' => ''];
                    $productArray['category'] = ['id' => null, 'name' => 'Uncategorized', 'slug' => ''];
                    
                    return $productArray;
                });
            } catch (\Exception $e) {
                Log::error('Failed to fetch popular products', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                // Return empty collection on error
                return collect([]);
            }
        });
    }

    /**
     * Get layout options
     */
    private function getLayoutOptions(): array
    {
        return [
            'grid' => [
                'label' => 'Grid Layout',
                'columns' => [3, 4, 5, 6],
                'gaps' => ['small', 'medium', 'large'],
            ],
            'carousel' => [
                'label' => 'Carousel Layout',
                'slides_per_view' => [2, 3, 4, 5],
                'spacing' => ['small', 'medium', 'large'],
            ],
            'masonry' => [
                'label' => 'Masonry Layout',
                'columns' => [2, 3, 4],
                'gaps' => ['small', 'medium', 'large'],
            ],
        ];
    }

    /**
     * Get animation options
     */
    private function getAnimationOptions(): array
    {
        return [
            'none' => 'No Animation',
            'fade' => 'Fade In',
            'slide-up' => 'Slide Up',
            'slide-down' => 'Slide Down',
            'slide-left' => 'Slide Left',
            'slide-right' => 'Slide Right',
            'zoom-in' => 'Zoom In',
            'zoom-out' => 'Zoom Out',
        ];
    }

    /**
     * Get icon options
     */
    private function getIconOptions(): array
    {
        return [
            'truck' => 'Delivery Truck',
            'utensils' => 'Utensils',
            'clock' => 'Clock',
            'shield' => 'Shield',
            'star' => 'Star',
            'heart' => 'Heart',
            'phone' => 'Phone',
            'map' => 'Map',
        ];
    }

    /**
     * Get font options
     */
    private function getFontOptions(): array
    {
        return [
            'heading_fonts' => [
                ['value' => 'inter', 'label' => 'Inter'],
                ['value' => 'roboto', 'label' => 'Roboto'],
                ['value' => 'poppins', 'label' => 'Poppins'],
                ['value' => 'montserrat', 'label' => 'Montserrat'],
                ['value' => 'open-sans', 'label' => 'Open Sans'],
            ],
            'body_fonts' => [
                ['value' => 'inter', 'label' => 'Inter'],
                ['value' => 'roboto', 'label' => 'Roboto'],
                ['value' => 'poppins', 'label' => 'Poppins'],
                ['value' => 'open-sans', 'label' => 'Open Sans'],
            ]
        ];
    }

    /**
     * Get color presets
     */
    private function getColorPresets(): array
    {
        return [
            'modern' => [
                'primary' => '#22C55E',
                'secondary' => '#0EA5E9',
                'accent' => '#F59E0B',
            ],
            'classic' => [
                'primary' => '#2563EB',
                'secondary' => '#4F46E5',
                'accent' => '#EC4899',
            ],
            'minimal' => [
                'primary' => '#18181B',
                'secondary' => '#27272A',
                'accent' => '#71717A',
            ],
        ];
    }

    /**
     * Update settings directly from a request
     */
    public function updateSettingsFromRequest($request): void
    {
        try {
            // Get validated data from the request
            $data = $request->validated();
            
            // Files array to store any file uploads
            $files = [];

            // $data['files'] = [
            //     'hero_image' => $data['hero_image'] ?? null,
            // ];

            // // Remove avatar from data to avoid duplicate processing
            // if (isset($data['hero_image'])) {
            //     unset($data['hero_image']);
            // }
            
            // Process hero_image and why_choose_us_image if they exist in the request
            // $expectedFileFields = ['hero_image', 'why_choose_us_image'];
            // foreach ($expectedFileFields as $fieldName) {
            //     if ($request->hasFile($fieldName) && $request->file($fieldName)->isValid()) {
            //         $files[$fieldName] = $request->file($fieldName);
            //     }
            // }
            
            // // Handle any files in the 'feedbacks' array if it exists
            // if (isset($data['feedbacks']) && is_array($data['feedbacks'])) {
            //     foreach ($data['feedbacks'] as $index => $feedback) {
            //         $avatarFieldName = "feedbacks.{$index}.avatar";
            //         // Check if we have a file with this field name in the request
            //         if ($request->hasFile($avatarFieldName)) {
            //             $files[$avatarFieldName] = $request->file($avatarFieldName);
            //         }
            //     }
            // }
            
            // // Handle any files in the 'hero_slides' array if it exists and hero_type is 'slider'
            // if (isset($data['hero_type']) && $data['hero_type'] === 'slider' && 
            //     isset($data['hero_slides']) && is_array($data['hero_slides'])) {
            //     foreach ($data['hero_slides'] as $index => $slide) {
            //         $slideImageField = "hero_slides.{$index}.image";
            //         if ($request->hasFile($slideImageField)) {
            //             $files[$slideImageField] = $request->file($slideImageField);
            //         }
            //     }
            // }

            
            // Handle avatar update
            if (isset($data['hero_image'])) {
                $this->syncFileCollections(Option::where('key', self::HOMEPAGE_OPTION_KEY)->first(), $data['hero_image']);
            }

            if (isset($data['hero_slides'])) {
                foreach ($data['hero_slides'] as $index => $slide) {
                    if (isset($slide['image'])) {
                        $this->syncFileCollections(Option::where('key', self::HOMEPAGE_OPTION_KEY)->first(), $slide['image']);
                    }
                }
            }
            
            // Validate and sanitize all data regardless of source
            $data = $this->sanitizeData($data);

            
            // Call the existing method to save everything
            $this->updateSettings($data, $files);
            
            // Clear any error-related cache keys
            Cache::forget('homepage_editor_errors');
            Cache::forget('homepage_last_error');
            
        } catch (\Exception $e) {
            // Log the error with detailed information
            Log::error('Failed to update homepage settings from request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            // Cache the error so it can be displayed if needed
            Cache::put('homepage_last_error', $e->getMessage(), 3600);
            
            throw new \Exception('Failed to update homepage settings: ' . $e->getMessage());
        }
    }

    protected function syncFileCollections(Option $option, array $files): void
    {
        if (isset($files['hero_image'])) {
            if (empty($files['hero_image'])) {
                $option->removeFiles('hero_image');
            } else {
                $option->syncFiles([$files['hero_image']], 'hero_image');
            }
        }
    }


    /**
     * Verify that all required database tables and columns exist for the homepage editor
     */
    public function verifyDatabaseIntegrity(): array
    {
        $issues = [];
        
        try {
            // Use the DatabaseHealthCheck utility to check tables
            $tables = [
                'restaurants' => [
                    'required' => ['id', 'name', 'slug'],
                    'optional' => ['logo', 'cover_image', 'is_active', 'is_featured']
                ],
                'products' => [
                    'required' => ['id', 'name', 'slug'],
                    'optional' => ['image', 'price', 'is_active', 'is_popular']
                ],
                'categories' => [
                    'required' => ['id', 'name', 'slug'],
                    'optional' => ['icon', 'image', 'description', 'is_active']
                ],
                'options' => [
                    'required' => ['key', 'value', 'group'],
                    'optional' => ['autoload']
                ]
            ];
            
            // Check each table
            foreach ($tables as $table => $columns) {
                $check = \App\Support\DatabaseHealthCheck::checkTable(
                    $table, 
                    $columns['required'], 
                    $columns['optional']
                );
                
                if (!$check['success']) {
                    $issues = array_merge($issues, $check['issues']);
                }
            }
            
            // Check for homepage_settings option
            if (Schema::hasTable('options')) {
                $homepageSettings = DB::table('options')->where('key', 'homepage_settings')->first();
                if (!$homepageSettings) {
                    $issues[] = "Homepage settings not found in options table";
                }
            }
            
            // Check critical model relationships if necessary models exist
            if (class_exists('App\\Models\\Product')) {
                // Check Product model relationships
                if (method_exists('App\\Models\\Product', 'reviews')) {
                    $reviewsCheck = \App\Support\DatabaseHealthCheck::checkRelationship(
                        'App\\Models\\Product', 
                        'reviews'
                    );
                    
                    if (!$reviewsCheck['success']) {
                        $issues[] = "Product model reviews relationship issue: " . $reviewsCheck['message'];
                    }
                }
            }
            
            if (class_exists('App\\Models\\Restaurant')) {
                // Check Restaurant model relationships
                if (method_exists('App\\Models\\Restaurant', 'reviews')) {
                    $reviewsCheck = \App\Support\DatabaseHealthCheck::checkRelationship(
                        'App\\Models\\Restaurant', 
                        'reviews'
                    );
                    
                    if (!$reviewsCheck['success']) {
                        $issues[] = "Restaurant model reviews relationship issue: " . $reviewsCheck['message'];
                    }
                }
            }
            
            return [
                'success' => count($issues) === 0,
                'issues' => $issues
            ];
        } catch (\Exception $e) {
            Log::error('Database integrity check failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'issues' => ['Database integrity check failed: ' . $e->getMessage()]
            ];
        }
    }
}
