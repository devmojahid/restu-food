<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurants_new', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 10, 8);
            $table->string('phone');
            $table->string('email');
            $table->enum('status', ['active', 'inactive', 'pending', 'suspended'])->default('pending');
            $table->boolean('is_featured')->default(false);
            $table->json('opening_hours')->nullable();
            $table->decimal('delivery_radius', 8, 2)->default(5.00); // in kilometers
            $table->decimal('minimum_order', 10, 2)->default(0.00);
            $table->decimal('delivery_fee', 10, 2)->default(0.00);
            $table->decimal('commission_rate', 5, 2)->default(10.00); // percentage
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'is_featured']);
            // $table->spatialIndex(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurants_new');
    }
}; 