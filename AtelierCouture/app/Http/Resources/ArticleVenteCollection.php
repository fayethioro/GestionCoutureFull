<?php

namespace App\Http\Resources;

use App\Http\Resources\CategoriesResource;
use App\Models\Article;
use App\Models\ArticleArticleVente;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

class ArticleVenteCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $categoriesVente = Categories::where('type_categorie', 2)->get();
        $categoriesConfection = Categories::where('type_categorie', 1)->get();

        return [
            'success' => true,
            'data' => $this->collection,
            // 'articleVentes' => ArticleArticleVente::all(),
            'articleConfection' => Article::all(),
            'categoriesVente' => CategoriesResource::collection($categoriesVente),
            'categories' => CategoriesResource::collection($categoriesConfection),
           
        
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
