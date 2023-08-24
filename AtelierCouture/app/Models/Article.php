<?php

namespace App\Models;

use App\Models\Categories;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    use HasFactory;
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

    public function categories(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }

    /**
     * Summary of fournisseurs
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function fournisseurs(): BelongsToMany
    {
        return $this->belongsToMany(Fournisseur::class, 'article_fournisseur')->withTimestamps()
            ->withPivot(['stock', 'prix']);
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($article) {
            $fournisseurIds = explode(',', request('fournisseur_id'));

            $pivotData = [
                'prix' => request('prix'),
                'stock' => request('stock'),
            ];
            $article->fournisseurs()->attach($fournisseurIds, $pivotData);
        });


        static::updated(function ($article) {
            $fournisseurIds = explode(',', request('fournisseur_id'));

            $pivotData = [
                'prix' => request('prix'),
                'stock' => request('stock'), 
            ];
            $article->fournisseurs()->sync($fournisseurIds, $pivotData);
        });

        static::deleting(function ($article) {
            $article->fournisseurs()->detach(); 
        });
    }

    
}
