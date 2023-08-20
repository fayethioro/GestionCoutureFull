<?php

namespace App\Models;

use App\Models\Categories;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;  use HasFactory; use SoftDeletes;


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

    public function categories():BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }
}
