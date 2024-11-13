<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->integer('quantity');
            $table->string('type'); // in, out
            $table->string('reason')->nullable();
            $table->integer('stock_before');
            $table->integer('stock_after');
            $table->json('meta_data')->nullable();
            $table->timestamps();

            $table->index(['reference_type', 'reference_id']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_inventory_movements');
    }
}; 