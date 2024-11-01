<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_item_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('food_item_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_item_variants');
    }
};
