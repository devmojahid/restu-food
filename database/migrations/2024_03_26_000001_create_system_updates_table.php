<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_updates', function (Blueprint $table) {
            $table->id();
            $table->string('version');
            $table->string('release_type')->default('stable'); // stable, beta, alpha
            $table->text('description')->nullable();
            $table->json('changelog');
            $table->string('download_url');
            $table->string('package_hash'); // For integrity verification
            $table->unsignedBigInteger('package_size');
            $table->json('requirements');
            $table->boolean('is_critical')->default(false);
            $table->timestamp('released_at');
            $table->timestamps();
            
            $table->unique('version');
        });

        Schema::create('system_update_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('system_update_id')->constrained('system_updates');
            $table->string('status'); // pending, running, completed, failed
            $table->string('step')->nullable();
            $table->text('message')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_update_logs');
        Schema::dropIfExists('system_updates');
    }
}; 