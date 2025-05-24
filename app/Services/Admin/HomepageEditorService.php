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
                    // Ensure color values start with # and have only valid hex characters
                    if (!preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/', $value)) {
                        // Fix or default the value
                        if (substr($value, 0, 1) !== '#') {
                            $value = '#' . $value;
                        }
                        
                        // Strip any non-hex characters
                        $value = '#' . preg_replace('/[^A-Fa-f0-9]/', '', substr($value, 1));
                        
                        // Ensure we have either 3 or 6 hex characters
                        $hexPart = substr($value, 1);
                        $length = strlen($hexPart);
                        
                        if ($length < 3) {
                            $value = '#22C55E'; // Default green
                        } elseif ($length > 6) {
                            $value = '#' . substr($hexPart, 0, 6);
                        }
                        
                        $data[$key] = $value;
                    }
                }
            }
        }
        
        return $data;
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
            return Restaurant::select(
                'id',
                'name',
                'slug',
                'logo',
                'cover_image',
                'delivery_time',
                'rating'
            )
                ->where('is_active', true)
                ->where('is_featured', true)
                ->with([
                    'categories:id,name',
                    'cuisines:id,name',
                ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->take(8)
                ->get();
        });
    }

    /**
     * Get popular products for the editor
     */
    private function getPopularProducts(): Collection
    {
        return Cache::remember('homepage_editor_products', 3600, function () {
            return Product::select(
                'id',
                'name',
                'slug',
                'image',
                'price',
                'sale_price',
                'rating'
            )
                ->where('is_active', true)
                ->where('is_popular', true)
                ->with([
                    'restaurant:id,name,slug',
                    'category:id,name,slug',
                ])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->take(8)
                ->get();
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
            
            // Let's handle file uploads without using methods that the linter might complain about
            $files = [];
            
            // For safety, we'll check if specific expected fields have files
            $expectedFileFields = ['hero_image', 'why_choose_us_image'];
            foreach ($expectedFileFields as $fieldName) {
                if (isset($_FILES[$fieldName]) && $_FILES[$fieldName]['error'] !== UPLOAD_ERR_NO_FILE) {
                    // We have a file here - we'll use the request's validated data
                    // which should include the already processed UploadedFile instance
                    if (isset($request[$fieldName])) {
                        $files[$fieldName] = $request[$fieldName];
                    }
                }
            }
            
            // Handle any files in the 'feedbacks' array if it exists
            if (isset($data['feedbacks']) && is_array($data['feedbacks'])) {
                foreach ($data['feedbacks'] as $index => $feedback) {
                    $avatarFieldName = "feedbacks.{$index}.avatar";
                    // Check if we have a file with this key in the request
                    if (isset($request[$avatarFieldName])) {
                        $files[$avatarFieldName] = $request[$avatarFieldName];
                    }
                }
            }
            
            // Call the existing method to save everything
            $this->updateSettings($data, $files);
        } catch (\Exception $e) {
            Log::error('Failed to update homepage settings from request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('Failed to update homepage settings: ' . $e->getMessage());
        }
    }
}
