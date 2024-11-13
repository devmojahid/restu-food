<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_bundles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_type')->default('fixed'); // fixed, percentage
            $table->integer('min_quantity')->default(1);
            $table->integer('max_quantity')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['starts_at', 'ends_at']);
            $table->index('is_active');
        });

        Schema::create('product_bundle_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_bundle_id')->constrained()->onDelete('cascade');
            $table->foreignId('bundled_product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('discount_type')->default('fixed'); // fixed, percentage
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_bundle_items');
        Schema::dropIfExists('product_bundles');
    }
}; 