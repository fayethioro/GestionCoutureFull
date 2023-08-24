<?php

namespace App\Models;

use App\Models\Article;
use App\Models\Fournisseur;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Approvisionnement extends Model
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
    public function article():BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
    public function fournisseur():BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }
}
