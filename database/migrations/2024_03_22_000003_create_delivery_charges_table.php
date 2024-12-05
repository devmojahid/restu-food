<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('delivery_charges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained()->onDelete('cascade');
            $table->decimal('min_charge', 10, 2);
            $table->decimal('max_charge', 10, 2);
            $table->decimal('per_km_charge', 10, 2);
            $table->decimal('max_cod_amount', 10, 2);
            $table->integer('increase_percentage')->default(0);
            $table->string('increase_message')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('delivery_charges');
    }
}; 