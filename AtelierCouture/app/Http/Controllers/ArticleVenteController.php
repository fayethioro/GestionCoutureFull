<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleVente;
use App\Models\Categories;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ArtcleVenteResource;
use App\Http\Resources\ArticleVenteCollection;
use App\Http\Requests\StoreArticleVenteRequest;
use App\Http\Requests\UpdateArticleVenteRequest;
use Webmozart\Assert\InvalidArgumentException;



class ArticleVenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function paginationArticle(Request $request): ArticleVenteCollection
    {

        $parPage = $request->limit ?? null;
        if ($parPage) {
            $articles = ArticleVente::with(['articles' => function ($query) {
                $query->select('libelle', 'article_id', 'quantite');
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
        return DB::transaction(function () use ($request) {
            $articleConfArray = $request->input('articleConf');
            $articles = json_decode($articleConfArray, true);
            if (!$this->validateCategories($articles)) {
                return response()->json(['message' => 'L\'ArticleVente doit contenir au moins trois articles des catégories Tissu, bouton et fil.'], 400);
            }
    
            $articleVente = $this->createArticleVente($request);
            $articleVente->uploadPhoto($request->file('photo'));
            $articleVente->save();
    
            return (new ArtcleVenteResource($articleVente))->withMessage("Ajout réussi");
        }, 5); 
    }
    /**
     * Summary of validateCategories
     * @param mixed $articleConf
     * @return bool
     * Fonction pour valider les catégories
     */
    private function validateCategories($articleConf)
    {
        $requiredCategories = ['tissu', 'bouton', 'fil'];
        $selectedCategories = [];

        foreach ($articleConf as $articleData) {
            $article = Article::find($articleData['id']);
            if ($article) {
                $selectedCategories[] = $article->categories->libelle;
            }
        }

        return collect($requiredCategories)->every(function ($item) use ($selectedCategories) {
            return in_array($item, $selectedCategories);
        });
    }

    
    /**
     * Summary of createArticleVente
     * @param mixed $request
     * @return mixed
     * Fonction pour créer un article de vente
     */
    private function createArticleVente($request)
    {
        $marge = $request->input('marge_article');

        return ArticleVente::create([
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
    }

    /**
     * Summary of update
     * @param \App\Http\Requests\UpdateArticleVenteRequest $request
     * @param \App\Models\ArticleVente $articleVente
     * @return void
//      */
//     public function update(UpdateArticleVenteRequest $request, ArticleVente $article_vente)
// {

//     return DB::transaction(function () use ($request, $article_vente) {
//         $articleConfArray = $request->input('articleConf');
//             $articles = json_decode($articleConfArray, true);
//         if (!$this->validateCategories($articles)) {
//             return response()->json(['message' => 'L\'ArticleVente doit contenir au moins trois articles des catégories Tissu, bouton et fil.'], 400);
//         }
        
//         $updateData= [
//             'libelle' => $request->input('libelle', $article_vente->libelle),
//             'categories_id' => $request->input('categories_id' , $article_vente->categories_id),
//             'marge_article' => $request->input('marge_article' , $article_vente->marge_article),
//             'valeur_promo' => $request->input('valeur_promo', $article_vente->valeur_promo),
//             'promo' => $request->input('promo' , $article_vente->promo),
//             'cout_fabrication' => $article_vente->cout_fabrication,
//             'prix_vente' => $article_vente->prix_vente,
//         ];
        
//         if ($request->hasFile('photo')) {
//             $photo = $request->file('photo');
//             $article_vente->uploadPhoto($photo);
//             $updateData['photo'] = $article_vente->photo;
//         }
//         $article_vente->update($updateData);
//         return (new ArtcleVenteResource($article_vente))->withMessage("Mise à jour réussie");
//     }, 5); 
// }

public function update(UpdateArticleVenteRequest $request, ArticleVente $article_vente)
{
    return DB::transaction(function () use ($request, $article_vente) {
        $articleConfArray = $request->input('articleConf');
        $articles = json_decode($articleConfArray, true);

        if (!$this->validateCategories($articles)) {
            return response()->json(['message' => 'L\'ArticleVente doit contenir au moins trois articles des catégories Tissu, bouton et fil.'], 400);
        }

        $updateData = $this->getUpdateData($request, $article_vente);
        $this->updateArticleVente($request,$article_vente, $updateData);
        $this->updateArticleRelation($article_vente, $articles);

        return (new ArtcleVenteResource($article_vente))->withMessage("Mise à jour réussie");
    }, 5);
}

private function getUpdateData($request, $article_vente)
{
    return [
        'libelle' => $request->input('libelle', $article_vente->libelle),
        'categories_id' => $request->input('categories_id', $article_vente->categories_id),
        'marge_article' => $request->input('marge_article', $article_vente->marge_article),
        'valeur_promo' => $request->input('valeur_promo', $article_vente->valeur_promo),
        'promo' => $request->input('promo', $article_vente->promo),
    ];
}

private function updateArticleVente($request , $article_vente, $updateData)
{
    if ($request->hasFile('photo')) {
        $photo = $request->file('photo');
        $article_vente->uploadPhoto($photo);
        $updateData['photo'] = $article_vente->photo;
    }
    
    $article_vente->update($updateData);
}

private function updateArticleRelation($article_vente, $articles)
{
    $articleIds = [];
    $totalCoutFabrication = 0;
    
    foreach ($articles as $article) {
        $articleId = $article['id'];
        $quantite = $article['quantites'];
        $article = Article::find($articleId);
        $totalCoutFabrication += ($quantite * $article->prix_total);
        $articleIds[$articleId] = ['quantite' => $quantite];
    }

    $article_vente->articles()->sync($articleIds);
    $article_vente->update([
        'cout_fabrication' => $totalCoutFabrication,
        'prix_vente' => $totalCoutFabrication + $article_vente->marge_article,
    ]);
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArticleVente $article_vente): ArtcleVenteResource
    {
        $article_vente->delete();

        return (new ArtcleVenteResource($article_vente))->withMessage("suppression reussi");
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
