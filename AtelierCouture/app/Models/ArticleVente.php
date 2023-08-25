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
        return $this->belongsToMany(Article::class, 'article_article_vente')->withTimestamps()
        ->withPivot(['quantite']);
    }
}
