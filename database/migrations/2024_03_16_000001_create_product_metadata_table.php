<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('meta_key');
            $table->longText('meta_value')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'meta_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_metadata');
    }
}; 