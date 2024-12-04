<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_staff_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            
            // Address Information
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->string('country');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 10, 8)->nullable();
            
            // Vehicle Information
            $table->string('vehicle_type'); // car, motorcycle, bicycle
            $table->string('vehicle_model')->nullable();
            $table->string('vehicle_year')->nullable();
            $table->string('vehicle_color')->nullable();
            $table->string('license_plate')->nullable();
            
            // Documents
            $table->string('driving_license_number');
            $table->date('driving_license_expiry');
            $table->boolean('has_vehicle_insurance')->default(false);
            $table->date('vehicle_insurance_expiry')->nullable();
            
            // Work Preferences
            $table->json('availability_hours')->nullable();
            $table->boolean('full_time')->default(false);
            $table->boolean('part_time')->default(false);
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->date('available_from')->nullable();
            $table->json('preferred_areas')->nullable(); // Areas willing to deliver
            
            // Emergency Contact
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone');
            $table->string('emergency_contact_relationship');
            
            // Background Check
            $table->boolean('has_criminal_record')->default(false);
            $table->text('criminal_record_details')->nullable();
            $table->boolean('background_check_consent')->default(false);
            
            // Experience
            $table->integer('years_of_experience')->default(0);
            $table->text('previous_experience')->nullable();
            $table->json('delivery_experience')->nullable(); // Types of deliveries
            $table->json('language_skills')->nullable();
            
            // Verification Status
            $table->boolean('verified_identity')->default(false);
            $table->boolean('verified_documents')->default(false);
            $table->boolean('verified_background')->default(false);
            $table->boolean('verified_vehicle')->default(false);
            
            // Application Status
            $table->string('status')->default('pending'); // pending, under_review, approved, rejected
            $table->text('rejection_reason')->nullable();
            $table->json('status_history')->nullable();
            $table->timestamp('approved_at')->nullable();
            
            // Terms and Conditions
            $table->boolean('terms_accepted')->default(false);
            $table->boolean('data_processing_consent')->default(false);
            
            // Additional Information
            $table->text('additional_notes')->nullable();
            $table->json('meta')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for better query performance
            $table->index(['status', 'created_at']);
            $table->index(['user_id', 'status']);
            $table->index(['city', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_staff_inquiries');
    }
}; 