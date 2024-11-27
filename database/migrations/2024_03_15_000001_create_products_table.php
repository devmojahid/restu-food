<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique();
            $table->text('description')->nullable();
            $table->string('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('cost_per_item', 10, 2)->nullable();
            $table->decimal('discounted_price', 10, 2)->nullable();
            $table->timestamp('sale_price_from')->nullable();
            $table->timestamp('sale_price_to')->nullable();
            $table->json('nutritional_info')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_taxable')->default(true);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->integer('stock_quantity')->default(0);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'low_stock'])->default('out_of_stock');
            $table->decimal('weight', 8, 2)->nullable();
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('width', 8, 2)->nullable();
            $table->decimal('height', 8, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better performance
            $table->index(['status', 'is_featured']);
            $table->index('stock_status');
            $table->index('sku');
            $table->index(['sale_price_from', 'sale_price_to']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};