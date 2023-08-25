<?php

namespace App\Http\Resources;

use App\Http\Resources\CategoriesResource;
use App\Models\ArticleArticleVente;
use App\Models\ArticleFournisseur;
use App\Models\Categories;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

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
            'data' =>[
                'articles' => $this->collection,
                // 'articleVentes' => ArticleArticleVente::collection(ArticleArticleVente::all()),
                'categoriesVente' => CategoriesResource::collection($categoriesVente),
                'categoriesConfection' => CategoriesResource::collection($categoriesConfection),
            ]
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
