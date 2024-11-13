<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specification_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specification_group_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('specification_id')->constrained()->onDelete('cascade');
            $table->string('value');
            $table->timestamps();

            $table->unique(['product_id', 'specification_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_specifications');
        Schema::dropIfExists('specifications');
        Schema::dropIfExists('specification_groups');
    }
}; 