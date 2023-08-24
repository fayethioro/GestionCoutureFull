<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Fournisseur extends Model
{
    use HasFactory;

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
        return $this->belongsToMany(Article::class, 'article_fournisseur')->withTimestamps()
        ->withPivot(['stock', 'prix']);;
    }
}
