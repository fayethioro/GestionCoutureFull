<?php

namespace App\Http\Resources;

use App\Http\Resources\FournisseurResource;
use Illuminate\Http\Request;
// use App\Http\Resources\StoreFournisseurResource;
use App\Models\Categories;
use App\Models\Fournisseur;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ArticleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
   
    public function toArray($request)
    {
        return [
            'success' => true,
            'data' => $this->collection,
            'fournisseurs' => FournisseurResource::collection(Fournisseur::all()),
            'categories' => CategoriesResource::collection(Categories::all()),
        ];
    }


    public function paginationInformation($request, $paginated, $default): array
    {
        return  ['links' => $paginated['links']];
    }

    public function withMessage($message)
    {
        return $this->additional([
            'message' => $message,
        ]);
    }


}
