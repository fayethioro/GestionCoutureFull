<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Traits\ImageTrait;
use Illuminate\Http\Request;
use App\Models\Approvisionnement;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ArticleCollection;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\ArticleFournisseur;
use App\Models\Categories;


/**
 * Summary of ArticleController
 */
class ArticleController extends Controller
{
    use ImageTrait;
    /**
     * Display a listing of the resource.
     */
    /**
     * paginationArticle
     *
     * @param  mixed $request
     * @return void
     */
    public function paginationArticle(Request $request):ArticleCollection
    {
        $parPage = $request->limit ?? null;
        if ($parPage) {
            $articles = Article::orderBy('created_at', 'desc')->paginate($parPage);
            return (new ArticleCollection($articles))->withMessage("Liste des articles");
        }
        return (new ArticleCollection(Article::all()))->withMessage("Liste des articles");

       

    }

    /**
     * Store a newly created resource in storage.
     */
    /**
     * genererReference
     *
     * @param  mixed $libelle
     * @param  mixed $categorieId
     * @return string
     */
    protected function genererReference($libelle, $categorieId): string
    {
        $categorie = Categories::find($categorieId);

        if (!$categorie) {
            return null;
        }
        $numeroInsertion = Article::where('categories_id', $categorie->id)->count() + 1;
        $libellePrefixe = substr($libelle, 0, 3);
        return "REF-{$libellePrefixe}-{$categorie->libelle}-{$numeroInsertion}";
    }

    /**
     * Summary of store
     * @param \App\Http\Requests\StoreArticleRequest $request
     * @return void
     */

    public function store(StoreArticleRequest $request):ArticleResource
    {
        // Début de la transaction
        DB::beginTransaction();

        try {
            $article = Article::create([
                'libelle' => $request->input('libelle'),
                'reference' => $this->genererReference($request->input('libelle'), $request->input('categories_id')),
                'categories_id' => $request->input('categories_id'),
                'stock_total' => $request->input('stock'),
                'prix_total' => $request->input('prix'),
            ]);
            $article->uploadPhoto($request->file('photo'));
            $article->save();
            // Validez et conf
            DB::commit();

            return (new ArticleResource($article))->withMessage("Ajout réussi");
        } catch (\Exception $e) {
            // Annulation de la transaction en cas d'erreur
            DB::rollback();

            return response()->json(['message' => 'Une erreur est survenue lors de l\'ajout.'], 500);
        }
    }

    public function update(UpdateArticleRequest $request, Article $article)
    {
        DB::beginTransaction();

        try {
        $article->update([
            'libelle' => $request->input('libelle'),
                // 'reference' => $this->genererReference($request->input('libelle'), $request->input('categories_id')),
                'categories_id' => $request->input('categories_id'),
                'stock_total' => $request->input('stock'),
                'prix_total' => $request->input('prix'),
        ]);

        
        DB::commit();
            return (new ArticleResource($article))->withMessage("Mise a jour réussi");
        } catch (\Exception $e) {
            // Annulation de la transaction en cas d'erreur
            DB::rollback();

            return response()->json(['message' => 'Une erreur est survenue lors du mis a jour.'], 500);
        }
    }
    
    /**
     * destroy
     *
     * @param  mixed $article
     * @return ArticleResource
     */
    public function destroy(Article $article): ArticleResource
    {
        $article->delete();

        return (new ArticleResource($article))->withMessage("suppression reussi");
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

        $article = Article::where('libelle', $recherche)->first();

        if ($article) {
            return ["data" => $article];
        }

        return ["data" => null];
    }
}
