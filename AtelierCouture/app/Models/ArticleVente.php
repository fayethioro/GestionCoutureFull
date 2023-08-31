<?php

namespace App\Models;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ArticleVente extends Model
{

    use HasFactory;
    use SoftDeletes;
    protected $guarded =
    [
        "id"
    ];

    protected $hidden = [
        'created_at',
        'deleted_at',
        'updated_at'
    ];

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_article_ventes')->withTimestamps()
            ->withPivot(['quantite']);
    }
    public function uploadPhoto($photo)
    {
        if ($photo) {
            $filename = time() . '_' . $photo->getClientOriginalName();
            $path = 'articles/' . $filename;
            Storage::disk('public')->put($path, file_get_contents($photo));

            $this->photo = $path;
            $this->save();
        }
    }
    protected static function boot()
    {
        parent::boot();

        static::created(function ($articleVente) {

            $marge = request()->input('marge_article');

            $articleConfArray = request()->input('articleConf');

            $articles = json_decode($articleConfArray, true);
            $totalCoutFabrication = 0;

            foreach ($articles as $article) {

                $articleId = $article['id'];
                $quantite = $article['quantites'];
                $article = Article::find($articleId);
                $totalCoutFabrication += ($quantite * $article->prix_total);

                $articleVente->articles()->attach($articleId, ['quantite' => $quantite]);
            }

            $articleVente->update([
                'cout_fabrication' => $totalCoutFabrication,
                'prix_vente' => $totalCoutFabrication + $marge
            ]);
        });

        // static::updated(function ($articleVente) {
        //     $articleVente->updateArticleRelationAndFields();
        // });
        

        static::deleting(function ($article) {
            $article->articles()->detach(); 
        });
    }
// public function updateArticleRelationAndFields()
// {
//     $articleIds = [];
//     $totalCoutFabrication = 0;
    
//     foreach ($this->articles as $article) {
//         $quantite = $article->pivot->quantite;
//         $totalCoutFabrication += ($quantite * $article->prix_total);
//         $articleIds[$article->id] = ['quantite' => $quantite];
//     }

//     $this->articles()->sync($articleIds);

//     // Mettez à jour les champs cout_fabrication et prix_vente
//     $this->update([
//         'cout_fabrication' => $totalCoutFabrication,
//         'prix_vente' => $totalCoutFabrication + $this->marge_article,
//     ]);
// }

}
