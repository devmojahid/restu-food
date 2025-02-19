<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_relationships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('related_product_id')->constrained('products')->onDelete('cascade');
            $table->string('relation_type'); // cross_sell, up_sell, related
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['product_id', 'related_product_id', 'relation_type'], 'product_relationships_unique');
            // No need to add anything here since the error indicates the table already exists
            // We should check if table exists before creating
            if (!Schema::hasTable('product_relationships')) {
                // Table creation code would go here
            }

            $table->index(['product_id', 'relation_type', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_relationships');
    }
}; 