<?php

namespace App\Models;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ArticleVente extends Model
{

    use HasFactory; use SoftDeletes;
    protected $guarded =
    [
        "id"
    ];

    protected $hidden = [
        'created_at',
        'deleted_at',
        'updated_at'
    ];

    public function articles():BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_article_ventes')->withTimestamps()
        ->withPivot(['quantite']);
    }

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::created(function ($articleVente) {
    //         $articles = request()->input('article_id');
    //         $attachments = [];

    //         foreach ($articles as $article) {
    //             $attachments[$article['id']] = ['quantite' => $article['quantite']];
    //         }

    //         $articleVente->articles()->attach($attachments);
    //     });
    // }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($articleVente) {

            $marge = request()->input('marge_article');

            $articles = request()->input('article_id');
            $totalCoutFabrication = 0;

            foreach ($articles as $article) {
                
                $articleId = $article['id'];
                $quantite = $article['quantite'];
                $article = Article::find($articleId);
                $totalCoutFabrication += ($quantite * $article->prix_total);

                $articleVente->articles()->attach($articleId, ['quantite' => $quantite]);
            }
            
            $articleVente->update([
                'cout_fabrication' => $totalCoutFabrication,
                'prix_vente' => $totalCoutFabrication + $marge
            ]);
        });
    }
}
