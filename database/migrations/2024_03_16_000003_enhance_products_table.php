<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Cost and inventory
            $table->decimal('cost_per_item', 10, 2)->nullable()->after('price');
            $table->string('sku')->nullable()->after('slug');
            $table->integer('stock_quantity')->default(0)->after('status');
            $table->string('stock_status')->default('in_stock')->after('stock_quantity');
            
            // Shipping
            $table->decimal('weight', 10, 2)->nullable()->after('stock_status');
            $table->decimal('length', 10, 2)->nullable()->after('weight');
            $table->decimal('width', 10, 2)->nullable()->after('length');
            $table->decimal('height', 10, 2)->nullable()->after('width');
            
            // Sale scheduling
            $table->timestamp('sale_price_from')->nullable()->after('discounted_price');
            $table->timestamp('sale_price_to')->nullable()->after('sale_price_from');
            
            // Additional features
            $table->boolean('is_taxable')->default(true)->after('is_featured');
            $table->decimal('tax_rate', 5, 2)->nullable()->after('is_taxable');
            
            // Add indexes
            $table->index('sku');
            $table->index('stock_status');
            $table->index(['sale_price_from', 'sale_price_to']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'cost_per_item',
                'sku',
                'stock_quantity',
                'stock_status',
                'weight',
                'length',
                'width',
                'height',
                'sale_price_from',
                'sale_price_to',
                'is_taxable',
                'tax_rate'
            ]);
        });
    }
}; 