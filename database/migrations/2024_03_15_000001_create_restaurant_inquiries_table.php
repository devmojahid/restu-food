<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Restaurant Information
            $table->string('restaurant_name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cuisine_type')->nullable();
            $table->string('restaurant_phone');
            $table->string('restaurant_email');
            
            // Address Information
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postal_code');
            $table->string('country');
            $table->decimal('latitude', 11, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Business Information
            $table->string('business_registration_number')->nullable();
            $table->string('tax_number')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            
            // Owner Information
            $table->string('owner_name');
            $table->string('owner_phone');
            $table->string('owner_email');
            $table->string('owner_id_type')->nullable(); // passport, national id, etc.
            $table->string('owner_id_number')->nullable();
            
            // Operational Information
            $table->time('opening_time');
            $table->time('closing_time');
            $table->json('opening_hours')->nullable();
            $table->integer('seating_capacity')->nullable();
            $table->boolean('delivery_available')->default(true);
            $table->boolean('pickup_available')->default(true);
            $table->decimal('delivery_radius', 8, 2)->nullable();
            $table->decimal('minimum_order', 10, 2)->nullable();
            $table->decimal('delivery_fee', 10, 2)->nullable();
            
            // Application Status
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            
            // Documents and Verification
            $table->boolean('terms_accepted')->default(false);
            $table->boolean('verified_address')->default(false);
            $table->boolean('verified_phone')->default(false);
            $table->boolean('verified_email')->default(false);
            
            // Timestamps and Soft Deletes
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('status');
            $table->index(['latitude', 'longitude']);
            $table->index('restaurant_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_inquiries');
    }
}; 