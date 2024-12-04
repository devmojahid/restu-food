<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remove the kitchen staff migration entry if it exists
        DB::table('migrations')
            ->where('migration', 'like', '%create_kitchen_staff_inquiry_status_histories_table%')
            ->delete();
    }

    public function down(): void
    {
        // Nothing to do in down() as we're just cleaning up
    }
}; 