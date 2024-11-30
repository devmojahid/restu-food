<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kitchen_staff_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('restaurant_id')->nullable()->constrained()->onDelete('set null');
            
            // Personal Information
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            
            // Address Information
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            
            // Professional Information
            $table->string('position_applied')->nullable();
            $table->integer('years_of_experience')->nullable();
            $table->text('specializations')->nullable(); // JSON array of cuisine specialties
            $table->text('previous_experience')->nullable();
            $table->string('highest_education')->nullable();
            $table->string('culinary_certificates')->nullable(); // JSON array of certificates
            
            // Availability
            $table->json('availability_hours')->nullable();
            $table->boolean('full_time')->default(true);
            $table->boolean('part_time')->default(false);
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->date('available_from')->nullable();
            
            // References
            $table->json('references')->nullable(); // Array of reference contacts
            
            // Health and Safety
            $table->boolean('has_food_safety_certification')->default(false);
            $table->date('food_safety_certification_expiry')->nullable();
            $table->boolean('has_health_certification')->default(false);
            $table->date('health_certification_expiry')->nullable();
            
            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();
            
            // Application Status
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            
            // Additional Information
            $table->text('additional_notes')->nullable();
            $table->boolean('terms_accepted')->default(false);
            $table->boolean('background_check_consent')->default(false);
            
            // Verification Flags
            $table->boolean('verified_identity')->default(false);
            $table->boolean('verified_qualifications')->default(false);
            $table->boolean('verified_references')->default(false);
            $table->boolean('verified_documents')->default(false);
            
            // Timestamps and Soft Deletes
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('status');
            $table->index('position_applied');
            $table->index(['full_name', 'email', 'phone']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kitchen_staff_inquiries');
    }
}; 