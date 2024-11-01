<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('original_name');
            $table->string('filename');
            $table->string('path');
            $table->string('disk');
            $table->string('mime_type');
            $table->bigInteger('size');
            $table->string('fileable_type')->nullable();
            $table->unsignedBigInteger('fileable_id')->nullable();
            $table->string('collection')->nullable();
            $table->json('meta')->nullable();
            $table->integer('order')->default(0);
            $table->unsignedBigInteger('user_id')->nullable(); // File uploader (optional)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['fileable_type', 'fileable_id']);
            $table->index('collection');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
