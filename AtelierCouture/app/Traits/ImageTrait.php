<?php

namespace  App\Traits;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait ImageTrait
{
    public function uploadPhoto($photo)
    {
        if ($photo) {
            $filename = time() . '_' . $photo->getClientOriginalName();
            $path = 'articles/' . $filename;
            Storage::disk('public')->put($path, file_get_contents($photo));

            $this->photo = $path;
            // $this->save();
        }
    }
    
}

