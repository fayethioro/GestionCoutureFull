<?php

use App\Models\Categories;
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
        Schema::create('article_ventes', function (Blueprint $table) {
            $table->id();
            $table->string('libelle')->unique();
            $table->string('reference');
            $table->string('photo')->nullable();
            $table->ForeignIdFor(Categories::class)->onDelete('set null');
            $table->boolean('promo')->default(0);
            $table->integer('valeur_promo')->nullable();
            $table->integer('cout_fabrication');
            $table->integer('marge_article');
            $table->integer('prix_vente');
            $table->integer('quantite_total');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_ventes');
    }
};
