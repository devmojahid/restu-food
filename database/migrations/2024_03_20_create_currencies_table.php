<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique();
            $table->string('name');
            $table->string('symbol', 10);
            $table->decimal('exchange_rate', 20, 10);
            $table->integer('decimal_places')->default(2);
            $table->string('decimal_separator', 1)->default('.');
            $table->string('thousand_separator', 1)->default(',');
            $table->enum('symbol_position', ['before', 'after'])->default('before');
            $table->boolean('space_between')->default(false);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            
            $table->index('is_enabled');
            $table->index('is_default');
        });

        Schema::create('currency_rates_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('currency_id')->constrained()->onDelete('cascade');
            $table->decimal('rate', 20, 10);
            $table->string('source')->nullable();
            $table->timestamps();
            
            $table->index(['currency_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('currency_rates_history');
        Schema::dropIfExists('currencies');
    }
}; 