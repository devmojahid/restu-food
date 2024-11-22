<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            // Drop the name column as we'll use attributes instead
            $table->dropColumn('name');
            
            // Add new columns
            $table->string('sku')->nullable()->after('product_id');
            $table->decimal('sale_price', 10, 2)->nullable()->after('price');
            $table->integer('stock')->default(0)->after('sale_price');
            $table->boolean('enabled')->default(true)->after('stock');
            $table->boolean('virtual')->default(false)->after('enabled');
            $table->boolean('downloadable')->default(false)->after('virtual');
            $table->boolean('manage_stock')->default(true)->after('downloadable');
            $table->string('stock_status')->default('instock')->after('manage_stock');
            
            // Shipping dimensions
            $table->decimal('weight', 10, 2)->nullable()->after('stock_status');
            $table->decimal('length', 10, 2)->nullable()->after('weight');
            $table->decimal('width', 10, 2)->nullable()->after('length');
            $table->decimal('height', 10, 2)->nullable()->after('width');
            
            // Additional fields
            $table->text('description')->nullable()->after('height');
            $table->json('attributes')->nullable()->after('description');
            
            // Add indexes
            $table->index('sku');
            $table->index('stock_status');
            $table->index('enabled');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->string('name')->after('product_id');
            
            $table->dropColumn([
                'sku',
                'sale_price',
                'stock',
                'enabled',
                'virtual',
                'downloadable',
                'manage_stock',
                'stock_status',
                'weight',
                'length',
                'width',
                'height',
                'description',
                'attributes'
            ]);
        });
    }
}; 