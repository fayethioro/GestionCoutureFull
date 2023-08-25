<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArtcleVenteResource;
use App\Http\Resources\ArticleVenteCollection;
use App\Models\ArticleVente;
use App\Http\Requests\StoreArticleVenteRequest;
use App\Http\Requests\UpdateArticleVenteRequest;
// use Symfony\Component\HttpFoundation\Request;
use Illuminate\Http\Request;


class ArticleVenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function paginationArticle(Request $request )
    {

        $parPage = $request->limit ?? null;
        if ($parPage) {
            $articles = ArticleVente::orderBy('created_at', 'desc')->paginate($parPage);
            return (new ArticleVenteCollection($articles))->withMessage("Liste des articles");
        }
        return (new ArticleVenteCollection(ArticleVente::all()))->withMessage("Liste des articles");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleVenteRequest $request)
    {
        //
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleVenteRequest $request, ArticleVente $articleVente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArticleVente $articleVente): ArtcleVenteResource
    {
        $articleVente->delete();

        return (new ArtcleVenteResource($articleVente))->withMessage("suppression reussi");
    }

    /**
     * Summary of recherche
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function recherche(Request $request)
    {
        $recherche = $request->recherche;
        if (strlen($recherche) < 3) {
            return ["data" => null];
        }

        $article = ArticleVente::where('libelle', $recherche)->first();

        if ($article) {
            return ["data" => $article];
        }

        return ["data" => null];
    }
}
