<?php

use App\Models\Article;
use App\Models\ArticleVente;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_article_ventes', function (Blueprint $table) {
            $table->id();
            $table->integer('quantite');
            $table->foreignIdFor(ArticleVente::class)->onDelete('set null');
            $table->foreignIdFor(Article::class)->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_article_ventes');
    }
};
