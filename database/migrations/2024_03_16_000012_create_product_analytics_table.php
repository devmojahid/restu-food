<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('session_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer_url')->nullable();
            $table->string('source')->nullable();
            $table->string('medium')->nullable();
            $table->string('campaign')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index(['session_id', 'created_at']);
            $table->index(['source', 'medium', 'campaign']);
        });

        Schema::create('product_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('session_id')->nullable();
            $table->string('interaction_type'); // wishlist_add, cart_add, quick_view, etc.
            $table->json('interaction_data')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'interaction_type']);
            $table->index(['session_id', 'created_at']);
        });

        Schema::create('product_performance_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('views')->default(0);
            $table->integer('unique_views')->default(0);
            $table->integer('cart_adds')->default(0);
            $table->integer('wishlist_adds')->default(0);
            $table->integer('orders')->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'date']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_performance_metrics');
        Schema::dropIfExists('product_interactions');
        Schema::dropIfExists('product_views');
    }
}; 