<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->text('excerpt_en')->nullable()->after('excerpt');
            $table->longText('body_en')->nullable()->after('body');
            $table->string('meta_title_en')->nullable()->after('meta_title');
            $table->text('meta_description_en')->nullable()->after('meta_description');
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->string('title_en')->nullable()->after('title');
            $table->text('excerpt_en')->nullable()->after('excerpt');
            $table->longText('body_en')->nullable()->after('body');
            $table->string('meta_title_en')->nullable()->after('meta_title');
            $table->text('meta_description_en')->nullable()->after('meta_description');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('label_en')->nullable()->after('label');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_en', 120)->nullable()->after('name');
            $table->text('description_en')->nullable()->after('description');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->string('name_en', 120)->nullable()->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'excerpt_en', 'body_en', 'meta_title_en', 'meta_description_en']);
        });

        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['title_en', 'excerpt_en', 'body_en', 'meta_title_en', 'meta_description_en']);
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn('label_en');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'description_en']);
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('name_en');
        });
    }
};
