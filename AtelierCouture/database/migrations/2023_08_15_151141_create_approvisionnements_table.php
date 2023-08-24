<?php

use App\Models\Article;
use App\Models\Fournisseur;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_fournisseur', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('prix');
            $table->integer('stock');
            $table->foreignIdFor(Article::class)->onDelete('cascade');
            $table->foreignIdFor(Fournisseur::class)->onDelete('cascade');;
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_fournisseur');
    }
};
