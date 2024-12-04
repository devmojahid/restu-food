<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_addons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('cost_per_item', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'low_stock'])->default('out_of_stock');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['restaurant_id', 'is_active']);
            $table->index('stock_status');
            $table->index('sort_order');
        });

        Schema::create('product_addon_category_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('addon_id')->constrained('product_addons')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->unique(['category_id', 'addon_id']);
            $table->index('sort_order');
        });

        Schema::create('product_addon_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            // Indexes
            $table->unique(['product_id', 'category_id']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_addon_assignments');
        Schema::dropIfExists('product_addon_category_items');
        Schema::dropIfExists('product_addons');
    }
}; 