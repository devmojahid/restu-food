<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kitchen_staff_inquiries', function (Blueprint $table) {
            $table->json('status_history')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('kitchen_staff_inquiries', function (Blueprint $table) {
            $table->dropColumn('status_history');
        });
    }
}; 