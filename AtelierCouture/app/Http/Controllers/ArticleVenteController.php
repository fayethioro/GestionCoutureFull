<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleVente;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ArtcleVenteResource;
use App\Http\Resources\ArticleVenteCollection;
use App\Http\Requests\StoreArticleVenteRequest;
use App\Http\Requests\UpdateArticleVenteRequest;
use Symfony\Component\HttpFoundation\JsonResponse;


class ArticleVenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function paginationArticle(Request $request)
    {

        $parPage = $request->limit ?? null;
        if ($parPage) {
            $articles = ArticleVente::with(['articles' => function ($query) {
                $query->select('libelle', 'quantite');
            }])->orderBy('created_at', 'desc')->paginate($parPage);
            return (new ArticleVenteCollection($articles))->withMessage("Liste des articles");
        }
        return (new ArticleVenteCollection(ArticleVente::all()))->withMessage("Liste des articles");
    }






    protected function genererReference($libelle, $categorieId): string
    {
        $categorie = Categories::find($categorieId);

        if (!$categorie) {
            return null;
        }
        $numeroInsertion = ArticleVente::where('categories_id', $categorie->id)->count() + 1;
        $libellePrefixe = substr($libelle, 0, 3);

        return "REF-{$libellePrefixe}-{$categorie->libelle}-{$numeroInsertion}";
    }

    /**
     * store
     *
     * @param  mixed $request
     * @return ArtcleVenteResource
     */
    public function store(StoreArticleVenteRequest $request)
    {
        DB::beginTransaction();

        try {

            $requiredCategories = ['tissu', 'bouton', 'fil'];
            $selectedCategories = [];

            foreach ($request->input('article_id') as $articleData) {
                $article = Article::find($articleData['id']);
                if ($article) {
                    $selectedCategories[] = $article->categories->libelle;
                }
            }

            $allElementsInSelectedCategories = collect($requiredCategories)->every(function ($item) use ($selectedCategories) {
                return in_array($item, $selectedCategories);
            });

            if (!$allElementsInSelectedCategories) {
                return response()->json(['message' => 'L\'ArticleVente doit contenir au moins trois articles des catégories Tissu, bouton et fil.'], 400);
            }

            $marge = $request->input('marge_article');

            $articleVente = ArticleVente::create([
                'libelle' => $request->input('libelle'),
                'reference' => $this->genererReference($request->input('libelle'), $request->input('categories_id')),
                'categories_id' => $request->input('categories_id'),
                'marge_article' => $marge,
                'quantite_total' => 1000,
                'valeur_promo' => $request->input('valeur_promo'),
                'promo' => $request->input('promo'),
                'cout_fabrication' => 0,
                'prix_vente' => 0,
            ]);
            $articleVente->uploadPhoto($request->file('photo'));
            $articleVente->save();
            DB::commit();

            return (new ArtcleVenteResource($articleVente))->withMessage("Ajout réussi");
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Une erreur s\'est produite lors de la création de l\'ArticleVente.'], 500);
        }
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
