<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_staff_inquiry_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_staff_inquiry_id')
                ->constrained('delivery_staff_inquiries')
                ->cascadeOnDelete()
                ->name('fk_delivery_status_inquiry_id');
            $table->string('status');
            $table->text('comment')->nullable();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete()
                ->name('fk_delivery_status_user_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_staff_inquiry_status_histories');
    }
}; 