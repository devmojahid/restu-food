<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('original_name')->nullable();
            $table->string('filename')->nullable();
            $table->string('path')->nullable();
            $table->string('disk')->default('public');
            $table->string('mime_type')->nullable();
            $table->bigInteger('size')->nullable();
            $table->nullableMorphs('fileable');
            $table->string('collection')->nullable();
            $table->json('meta')->nullable();
            $table->integer('order')->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('collection');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
