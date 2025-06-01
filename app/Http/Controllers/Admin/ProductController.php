<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Restaurant;
use App\Models\SpecificationGroup;
use App\Models\ProductAttribute;
use App\Services\Admin\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\Admin\UpdateStockRequest;
use App\Http\Requests\Admin\ApplySaleRequest;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;

final class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(): Response
    {
        $products = Product::with(['restaurant', 'categories'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create(): Response
    {
        $globalAttributes = ProductAttribute::with(['values' => function($query) {
            $query->orderBy('sort_order');
        }])
        ->orderBy('sort_order')
        ->get()
        ->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'type' => $attribute->type,
                'values' => $attribute->values->map(function ($value) {
                    return [
                        'id' => $value->id,
                        'value' => $value->value,
                        'label' => $value->label,
                        'color_code' => $value->color_code,
                    ];
                })->values()->all(),
            ];
        });

        $categories = Category::select(['id', 'name', 'slug', 'parent_id'])
                ->where('type', 'product')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->with(['parent:id,name'])
                ->get()
                ->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                        ] : null
                ])
            ->values()
            ->all();

        $restaurants = Restaurant::select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'restaurants' => $restaurants,
            'categories' => $categories,
            'globalAttributes' => $globalAttributes,
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            // Ensure variations data is properly structured
            if (!empty($data['variations'])) {
                foreach ($data['variations'] as &$variation) {
                    // Ensure thumbnail data is properly formatted
                    if (!empty($variation['thumbnail'])) {
                        $variation['thumbnail'] = array_filter($variation['thumbnail']);
                    }
                }
            }

            $product = $this->productService->store($data);

            return redirect()
                ->route('app.products.edit', $product)
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Error creating product: ' . $e->getMessage());
        }
    }

    public function show(Product $product): Response
    {
        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load([
            'restaurant',
            'categories',
            'variants',
            'specifications',
            'metadata',
            'specificAttributes'
        ]);

        // Transform specific attributes to match the format expected by the frontend
        $productAttributes = $product->specificAttributes->map(function ($attr) {
            return [
                'name' => $attr->name,
                'values' => $attr->values,
                'variation' => $attr->is_variation,
                'sort_order' => $attr->sort_order,
            ];
        })->values();

        // Merge the transformed data into the product array
        $productData = array_merge($product->toArray(), [
            'attributes' => $productAttributes
        ]);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $productData,
            'restaurants' => Restaurant::select(['id', 'name'])
                ->orderBy('name')
                ->get(),
            'categories' => Category::select(['id', 'name', 'slug', 'parent_id'])
                ->where('type', 'product')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->with(['parent:id,name'])
                ->get()
                ->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                    ] : null
                ])
                ->values()
                ->all(),
            'globalAttributes' => ProductAttribute::with(['values' => function($query) {
                $query->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($attribute) {
                return [
                    'id' => $attribute->id,
                    'name' => $attribute->name,
                    'type' => $attribute->type,
                    'values' => $attribute->values->map(function ($value) {
                        return [
                            'id' => $value->id,
                            'value' => $value->value,
                            'label' => $value->label,
                            'color_code' => $value->color_code,
                        ];
                    })->values()->all(),
                ];
            }),
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
    try {
        $data = $request->validated();
        
        // Only include file data if present in request
        if ($request->has('thumbnail')) {
            $data['thumbnail'] = $request->input('thumbnail');
        }
        if ($request->has('gallery')) {
            $data['gallery'] = $request->input('gallery');
        }
        
        $this->productService->update($product, $data);

        return redirect()
            ->route('app.products.index')
            ->with('success', 'Product updated successfully.');
    } catch (\Exception $e) {
        Log::error('Error updating product: ' . $e->getMessage());
        return back()
            ->withInput()
                ->with('error', 'Error updating product: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('app.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function updateStock(Product $product, UpdateStockRequest $request): RedirectResponse
    {
        $this->productService->updateStock(
            $product,
            $request->validated('quantity'),
            $request->validated('operation')
        );

        return back()->with('success', 'Stock updated successfully.');
    }

    public function applySale(Product $product, ApplySaleRequest $request): RedirectResponse
    {
        $this->productService->applySalePrice(
            $product,
            $request->validated('sale_price'),
            $request->validated('start_date'),
            $request->validated('end_date')
        );

        return back()->with('success', 'Sale price applied successfully.');
    }

    public function reports(Request $request)
    {
        try {
            $timeRange = $request->get('timeRange', 'today');
            $viewMode = $request->get('viewMode', 'overview');

             // $stats = $this->getProductStats($timeRange);

            // Enhanced dummy data for reports
            $stats = [
                'summary' => [
                    'total_revenue' => 124500.75,
                    'revenue_growth' => 15.2,
                    'total_orders' => 1256,
                    'orders_growth' => 8.5,
                    'total_units' => 3450,
                    'avg_order_value' => 99.12,
                    'aov_trend' => 'up',
                    'aov_growth' => 5.3,
                    'profit_margin' => 32.5,
                    'margin_trend' => 'up',
                    'margin_growth' => 2.8
                ],
                'sales_data' => [
                    [
                        'date' => now()->format('Y-m-d'),
                        'revenue' => 12450.50,
                        'orders' => 125,
                        'units_sold' => 345,
                        'average_order' => 99.60,
                        'profit' => 3735.15,
                        'growth_rate' => 15.2,
                        'conversion_rate' => 3.5,
                        'peak_hours' => ['12:00', '18:00'],
                        'customer_satisfaction' => 4.8
                    ],
                    [
                        'date' => now()->subDay()->format('Y-m-d'),
                        'revenue' => 11250.75,
                        'orders' => 118,
                        'units_sold' => 312,
                        'average_order' => 95.35,
                        'profit' => 3375.22,
                        'growth_rate' => 12.8,
                        'conversion_rate' => 3.2,
                        'peak_hours' => ['13:00', '19:00'],
                        'customer_satisfaction' => 4.7
                    ],
                    [
                        'date' => now()->subDays(2)->format('Y-m-d'),
                        'revenue' => 13680.25,
                        'orders' => 142,
                        'units_sold' => 389,
                        'average_order' => 96.34,
                        'profit' => 4104.07,
                        'growth_rate' => 18.5,
                        'conversion_rate' => 3.8,
                        'peak_hours' => ['12:30', '18:30'],
                        'customer_satisfaction' => 4.9
                    ],
                    [
                        'date' => now()->subDays(3)->format('Y-m-d'),
                        'revenue' => 10890.60,
                        'orders' => 115,
                        'units_sold' => 298,
                        'average_order' => 94.70,
                        'profit' => 3267.18,
                        'growth_rate' => 10.2,
                        'conversion_rate' => 3.0,
                        'peak_hours' => ['13:30', '19:30'],
                        'customer_satisfaction' => 4.6
                    ],
                    [
                        'date' => now()->subDays(4)->format('Y-m-d'),
                        'revenue' => 12120.80,
                        'orders' => 128,
                        'units_sold' => 356,
                        'average_order' => 94.69,
                        'profit' => 3636.24,
                        'growth_rate' => 14.8,
                        'conversion_rate' => 3.4,
                        'peak_hours' => ['12:00', '18:00'],
                        'customer_satisfaction' => 4.8
                    ],
                    [
                        'date' => now()->subDays(5)->format('Y-m-d'),
                        'revenue' => 11780.45,
                        'orders' => 122,
                        'units_sold' => 334,
                        'average_order' => 96.56,
                        'profit' => 3534.13,
                        'growth_rate' => 13.5,
                        'conversion_rate' => 3.3,
                        'peak_hours' => ['13:00', '19:00'],
                        'customer_satisfaction' => 4.7
                    ],
                    [
                        'date' => now()->subDays(6)->format('Y-m-d'),
                        'revenue' => 13450.90,
                        'orders' => 138,
                        'units_sold' => 378,
                        'average_order' => 97.47,
                        'profit' => 4035.27,
                        'growth_rate' => 17.2,
                        'conversion_rate' => 3.7,
                        'peak_hours' => ['12:30', '18:30'],
                        'customer_satisfaction' => 4.9
                    ]
                ],
                'sales_analytics' => [
                    'hourly_distribution' => [
                        '08:00' => ['orders' => 15, 'revenue' => 1425.50],
                        '09:00' => ['orders' => 18, 'revenue' => 1710.60],
                        '10:00' => ['orders' => 22, 'revenue' => 2090.80],
                        '11:00' => ['orders' => 28, 'revenue' => 2660.40],
                        '12:00' => ['orders' => 35, 'revenue' => 3325.75],
                        '13:00' => ['orders' => 32, 'revenue' => 3040.80],
                        '14:00' => ['orders' => 25, 'revenue' => 2375.25],
                        '15:00' => ['orders' => 20, 'revenue' => 1900.00],
                        '16:00' => ['orders' => 24, 'revenue' => 2280.60],
                        '17:00' => ['orders' => 30, 'revenue' => 2850.30],
                        '18:00' => ['orders' => 38, 'revenue' => 3610.20],
                        '19:00' => ['orders' => 34, 'revenue' => 3230.40],
                        '20:00' => ['orders' => 28, 'revenue' => 2660.40],
                        '21:00' => ['orders' => 22, 'revenue' => 2090.80],
                        '22:00' => ['orders' => 15, 'revenue' => 1425.50]
                    ],
                    'payment_methods' => [
                        ['method' => 'Credit Card', 'count' => 450, 'amount' => 42750.25],
                        ['method' => 'Debit Card', 'count' => 320, 'amount' => 30400.50],
                        ['method' => 'Digital Wallet', 'count' => 180, 'amount' => 17100.75],
                        ['method' => 'Cash', 'count' => 150, 'amount' => 14250.60]
                    ],
                    'order_types' => [
                        ['type' => 'Dine-in', 'count' => 380, 'amount' => 36100.40],
                        ['type' => 'Takeaway', 'count' => 420, 'amount' => 39900.30],
                        ['type' => 'Delivery', 'count' => 300, 'amount' => 28500.40]
                    ],
                    'customer_segments' => [
                        ['segment' => 'New', 'count' => 280, 'revenue' => 26600.25],
                        ['segment' => 'Regular', 'count' => 520, 'revenue' => 49400.50],
                        ['segment' => 'VIP', 'count' => 300, 'revenue' => 28500.40]
                    ]
                ]
            ];
            $user = Auth::user();

            return Inertia::render('Admin/Products/Reports/Index', [
                'stats' => $stats,
                'timeRange' => $timeRange,
                'viewMode' => $viewMode,
                'permissions' => $user ? $user->permissions->pluck('name') : [],
                'userRole' => $user?->roles->first()?->name ?? '',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in product reports: ' . $e->getMessage());
            dd($e->getMessage());
            return back()->with('error', 'Unable to load product reports.');
        }
    }

    public function analytics(Request $request)
    {
        try {
            $timeRange = $request->get('timeRange', 'today');

            // $analyticsData = $this->getAnalyticsData($timeRange);

            // Enhanced dummy data for analytics
            $analyticsData = [
                'trends' => [
                    'sales_trend' => [
                        [
                            'date' => now()->format('Y-m-d'),
                            'revenue' => 12450.50,
                            'orders' => 125,
                            'units_sold' => 345,
                            'average_order' => 99.60
                        ],
                        [
                            'date' => now()->subDay()->format('Y-m-d'),
                            'revenue' => 11250.75,
                            'orders' => 118,
                            'units_sold' => 312,
                            'average_order' => 95.35
                        ],
                        // Add more historical data
                    ],
                    'category_trend' => [
                        [
                            'name' => 'Burgers',
                            'total_revenue' => 45670.50,
                            'percentage' => 35,
                            'growth' => 12.5
                        ],
                        [
                            'name' => 'Pizza',
                            'total_revenue' => 38450.75,
                            'percentage' => 28,
                            'growth' => 8.3
                        ],
                        [
                            'name' => 'Drinks',
                            'total_revenue' => 25680.25,
                            'percentage' => 20,
                            'growth' => 15.7
                        ],
                        [
                            'name' => 'Desserts',
                            'total_revenue' => 15420.80,
                            'percentage' => 17,
                            'growth' => -2.4
                        ]
                    ],
                    'price_trend' => [
                        [
                            'name' => 'Premium Burger',
                            'regular_price' => 19.99,
                            'sale_price' => 16.99,
                            'sale_start_date' => now()->subDays(5),
                            'sale_end_date' => now()->addDays(2),
                            'price_history' => [
                                ['date' => now()->subMonths(3)->format('Y-m-d'), 'price' => 18.99],
                                ['date' => now()->subMonths(2)->format('Y-m-d'), 'price' => 19.99],
                                ['date' => now()->subMonths(1)->format('Y-m-d'), 'price' => 16.99]
                            ]
                        ],
                        // Add more price trends
                    ]
                ],
                'forecasts' => [
                    'sales_forecast' => [
                        'predicted_revenue' => 135000.00,
                        'predicted_units' => 3800,
                        'growth_rate' => 8.5,
                        'confidence_score' => 85,
                        'seasonal_factors' => [
                            'peak_days' => ['Friday', 'Saturday'],
                            'peak_hours' => ['12:00', '18:00'],
                            'seasonal_boost' => 15
                        ]
                    ],
                    'inventory_forecast' => [
                        'stockout_risks' => [
                            [
                                'product_id' => 1,
                                'product_name' => 'Premium Burger',
                                'current_stock' => 45,
                                'predicted_demand' => 120,
                                'reorder_suggestion' => 100,
                                'risk_level' => 'high'
                            ],
                            // Add more stockout risks
                        ],
                        'reorder_recommendations' => [
                            [
                                'product_id' => 2,
                                'product_name' => 'Classic Pizza',
                                'quantity' => 150,
                                'optimal_order_date' => now()->addDays(3)->format('Y-m-d'),
                                'urgency' => 'medium'
                            ],
                            // Add more recommendations
                        ]
                    ],
                    'demand_forecast' => [
                        'weekly_prediction' => [
                            'Monday' => 450,
                            'Tuesday' => 425,
                            'Wednesday' => 475,
                            'Thursday' => 500,
                            'Friday' => 750,
                            'Saturday' => 850,
                            'Sunday' => 650
                        ],
                        'peak_hours' => [
                            '12:00' => 85,
                            '13:00' => 100,
                            '18:00' => 95,
                            '19:00' => 90
                        ]
                    ]
                ],
                'insights' => [
                    'top_performing' => [
                        [
                            'id' => 1,
                            'name' => 'Premium Burger',
                            'total_quantity' => 1245,
                            'total_revenue' => 24875.55,
                            'avg_price' => 19.99,
                            'growth_rate' => 15.5,
                            'profit_margin' => 45.2
                        ],
                        // Add more top performers
                    ],
                    'improvement_areas' => [
                        'low_performing' => [
                            [
                                'id' => 15,
                                'name' => 'Veggie Wrap',
                                'current_performance' => -12.5,
                                'suggested_actions' => [
                                    'Review pricing strategy',
                                    'Update product description',
                                    'Consider menu placement'
                                ]
                            ]
                        ],
                        'inventory_issues' => [
                            [
                                'type' => 'Overstocking',
                                'products' => ['Soda Cans', 'Paper Cups'],
                                'impact' => '$1,245 tied in excess inventory'
                            ]
                        ]
                    ],
                    'recommendations' => [
                        'pricing_recommendations' => [
                            [
                                'title' => 'Price Optimization',
                                'description' => 'Increase Premium Burger price by 5% during peak hours',
                                'impact' => 'High Impact',
                                'potential_revenue' => 2500.00
                            ],
                            // Add more recommendations
                        ],
                        'inventory_recommendations' => [
                            [
                                'title' => 'Stock Optimization',
                                'description' => 'Reduce Classic Pizza safety stock by 20%',
                                'impact' => 'Medium Impact',
                                'cost_saving' => 1200.00
                            ]
                        ],
                        'promotion_recommendations' => [
                            [
                                'title' => 'Bundle Offer',
                                'description' => 'Create burger + drink combo',
                                'impact' => 'High Impact',
                                'expected_lift' => '25%'
                            ]
                        ]
                    ]
                ]
            ];

            $user = Auth::user();

            return Inertia::render('Admin/Products/Analytics/Index', [
                'analyticsData' => $analyticsData,
                'timeRange' => $timeRange,
                'permissions' => $user ? $user->permissions->pluck('name') : [],
                'userRole' => $user?->roles->first()?->name ?? '',
            ]);
        } catch (\Exception $e) {
            Log::error('Error in product analytics: ' . $e->getMessage());
            return back()->with('error', 'Unable to load product analytics.');
        }
    }

    public function stats(Request $request)
    {
        $timeRange = $request->get('timeRange', 'today');

        return response()->json([
            'stats' => $this->getProductStats($timeRange),
        ]);
    }

    public function apiStats(Request $request)
    {
        try {
            $timeRange = $request->get('timeRange', 'today');
            $stats = $this->getProductStats($timeRange);

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting product stats: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getProductStats($timeRange): array
    {
        $dateRange = $this->getDateRange($timeRange);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        // Generate realistic sales data for the past 7 days
        $salesData = collect(range(0, 6))->map(function($days) {
            $date = now()->subDays($days);
            $baseRevenue = rand(8000, 15000);
            $baseOrders = rand(80, 150);
            $baseUnits = rand(240, 450);

            return [
                'date' => $date->format('Y-m-d'),
                'revenue' => $baseRevenue + ($days * rand(-500, 500)),
                'orders' => $baseOrders + ($days * rand(-10, 10)),
                'units_sold' => $baseUnits + ($days * rand(-30, 30)),
                'average_order' => round(($baseRevenue / $baseOrders), 2)
            ];
        })->reverse()->values();

        // Convert collection to array for calculations
        $salesDataArray = $salesData->toArray();

        // Calculate summary statistics using the array
        $totalRevenue = array_sum(array_column($salesDataArray, 'revenue'));
        $totalOrders = array_sum(array_column($salesDataArray, 'orders'));
        $totalUnits = array_sum(array_column($salesDataArray, 'units_sold'));

        // Generate realistic top products data
        $topProducts = [
            [
                'id' => 1,
                'name' => 'Premium Burger',
                'total_quantity' => rand(800, 1200),
                'total_revenue' => rand(16000, 24000),
                'growth_rate' => rand(5, 25),
                'thumbnail' => asset('images/placeholders/product-placeholder.png')
            ],
            [
                'id' => 2,
                'name' => 'Classic Pizza',
                'total_quantity' => rand(600, 1000),
                'total_revenue' => rand(12000, 20000),
                'growth_rate' => rand(5, 20),
                'thumbnail' => asset('images/placeholders/product-placeholder.png')
            ],
            [
                'id' => 3,
                'name' => 'Chicken Wings',
                'total_quantity' => rand(500, 900),
                'total_revenue' => rand(10000, 18000),
                'growth_rate' => rand(-10, 15),
                'thumbnail' => '/images/products/wings.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Pasta Carbonara',
                'total_quantity' => rand(400, 800),
                'total_revenue' => rand(8000, 16000),
                'growth_rate' => rand(-5, 20),
                'thumbnail' => '/images/products/pasta.jpg'
            ],
            [
                'id' => 5,
                'name' => 'Caesar Salad',
                'total_quantity' => rand(300, 700),
                'total_revenue' => rand(6000, 14000),
                'growth_rate' => rand(-15, 10),
                'thumbnail' => '/images/products/salad.jpg'
            ]
        ];

        // Generate realistic category performance data
        $categoryPerformance = [
            [
                'name' => 'Burgers',
                'total_orders' => rand(400, 600),
                'total_quantity' => rand(1200, 1800),
                'total_revenue' => rand(24000, 36000)
            ],
            [
                'name' => 'Pizza',
                'total_orders' => rand(350, 550),
                'total_quantity' => rand(1000, 1600),
                'total_revenue' => rand(21000, 33000)
            ],
            [
                'name' => 'Chicken',
                'total_orders' => rand(300, 500),
                'total_quantity' => rand(900, 1500),
                'total_revenue' => rand(18000, 30000)
            ],
            [
                'name' => 'Pasta',
                'total_orders' => rand(250, 450),
                'total_quantity' => rand(800, 1400),
                'total_revenue' => rand(15000, 27000)
            ],
            [
                'name' => 'Salads',
                'total_orders' => rand(200, 400),
                'total_quantity' => rand(700, 1300),
                'total_revenue' => rand(12000, 24000)
            ],
            [
                'name' => 'Desserts',
                'total_orders' => rand(150, 350),
                'total_quantity' => rand(600, 1200),
                'total_revenue' => rand(9000, 21000)
            ]
        ];

        return [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_units' => $totalUnits,
                'avg_order_value' => $totalOrders > 0 ? $totalRevenue / $totalOrders : 0,
                'growth_rate' => rand(5, 15),
                'conversion_rate' => rand(2, 5),
            ],
            'sales_data' => $salesData->all(), // Convert collection to array for the response
            'top_products' => $topProducts,
            'category_performance' => $categoryPerformance,
        ];
    }

    private function getDateRange($timeRange): array
    {
        $now = Carbon::now();

        switch ($timeRange) {
            case 'today':
                return [
                    'start' => $now->startOfDay(),
                    'end' => $now->endOfDay(),
                ];
            case 'week':
                return [
                    'start' => $now->startOfWeek(),
                    'end' => $now->endOfWeek(),
                ];
            case 'month':
                return [
                    'start' => $now->startOfMonth(),
                    'end' => $now->endOfMonth(),
                ];
            case 'quarter':
                return [
                    'start' => $now->startOfQuarter(),
                    'end' => $now->endOfQuarter(),
                ];
            case 'year':
                return [
                    'start' => $now->startOfYear(),
                    'end' => $now->endOfYear(),
                ];
            default:
                return [
                    'start' => $now->startOfDay(),
                    'end' => $now->endOfDay(),
                ];
        }
    }

    private function getAnalyticsData($timeRange): array
    {
        $dateRange = $this->getDateRange($timeRange);

        // Add your analytics data collection logic here
        return [
            'trends' => $this->getTrends($dateRange),
            'forecasts' => $this->getForecasts($dateRange),
            'insights' => $this->getInsights($dateRange),
        ];
    }

    private function getTrends(array $dateRange): array
    {
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        return [
            'sales_trend' => OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->whereBetween('orders.created_at', [$startDate, $endDate])
                ->select(
                    DB::raw('DATE(orders.created_at) as date'),
                    DB::raw('SUM(order_items.quantity * order_items.unit_price) as revenue'),
                    DB::raw('COUNT(DISTINCT orders.id) as orders'),
                    DB::raw('SUM(order_items.quantity) as units_sold')
                )
                ->groupBy('date')
                ->get(),
            'category_trend' => $this->getCategoryTrends($startDate, $endDate),
            'price_trend' => $this->getPriceTrends($startDate, $endDate),
        ];
    }

    private function getForecasts(array $dateRange): array
    {
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        return [
            'sales_forecast' => $this->calculateSalesForecast($startDate, $endDate),
            'inventory_forecast' => $this->calculateInventoryForecast(),
            'demand_forecast' => $this->calculateDemandForecast($startDate, $endDate),
        ];
    }

    private function getInsights(array $dateRange): array
    {
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        return [
            'top_performing' => $this->getTopPerformingProducts($startDate, $endDate),
            'improvement_areas' => $this->getImprovementAreas($startDate, $endDate),
            'recommendations' => $this->getRecommendations($startDate, $endDate),
        ];
    }

    private function getCategoryTrends($startDate, $endDate): array
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('product_categories', 'products.id', '=', 'product_categories.product_id')
            ->join('categories', 'product_categories.category_id', '=', 'categories.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                'categories.name',
                DB::raw('COUNT(DISTINCT orders.id) as total_orders'),
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as total_revenue')
            )
            ->groupBy('categories.name')
            ->orderByDesc('total_revenue')
            ->get()
            ->toArray();
    }

    private function getPriceTrends($startDate, $endDate): array
    {
        return Product::select(
            'name',
            'regular_price',
            'sale_price',
            'sale_start_date',
            'sale_end_date'
        )
        ->whereNotNull('sale_price')
        ->whereBetween('updated_at', [$startDate, $endDate])
        ->get()
        ->toArray();
    }

    private function calculateSalesForecast($startDate, $endDate): array
    {
        // Implement your sales forecasting logic here
        return [
            'predicted_revenue' => 0,
            'predicted_units' => 0,
            'growth_rate' => 0,
            'confidence_score' => 0,
        ];
    }

    private function calculateInventoryForecast(): array
    {
        // Implement your inventory forecasting logic here
        return [
            'stock_predictions' => [],
            'reorder_recommendations' => [],
            'stockout_risks' => [],
        ];
    }

    private function calculateDemandForecast($startDate, $endDate): array
    {
        // Implement your demand forecasting logic here
        return [
            'predicted_demand' => [],
            'seasonal_factors' => [],
            'trend_factors' => [],
        ];
    }

    private function getTopPerformingProducts($startDate, $endDate): array
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.unit_price) as total_revenue'),
                DB::raw('AVG(order_items.unit_price) as avg_price')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getImprovementAreas($startDate, $endDate): array
    {
        // Implement logic to identify areas needing improvement
        return [
            'low_performing_products' => [],
            'inventory_issues' => [],
            'pricing_opportunities' => [],
        ];
    }

    private function getRecommendations($startDate, $endDate): array
    {
        // Implement recommendation logic
        return [
            'pricing_recommendations' => [],
            'inventory_recommendations' => [],
            'promotion_recommendations' => [],
        ];
    }
}
