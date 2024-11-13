<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_item_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('rating');
            $table->text('review')->nullable();
            $table->text('pros')->nullable();
            $table->text('cons')->nullable();
            $table->boolean('is_verified_purchase')->default(false);
            $table->boolean('is_recommended')->default(true);
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['product_id', 'is_approved']);
            $table->index('rating');
        });

        Schema::create('product_review_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_review_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('vote_type'); // helpful, not_helpful
            $table->timestamps();

            $table->unique(['product_review_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_review_votes');
        Schema::dropIfExists('product_reviews');
    }
}; 