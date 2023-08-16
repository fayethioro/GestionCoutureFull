<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\Approvisionnement;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ArticleCollection;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Categories;

// use Symfony\Component\HttpFoundation\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function paginationArticle(Request $request)
    {
        $parPage = $request->input('limit', 3);

        $articles = Article::orderBy('created_at', 'desc')->paginate($parPage);
        return (new ArticleCollection($articles))->withMessage("Liste des articles");
    }

    /**
     * Store a newly created resource in storage.
     */

     protected function genererReference($libelle, $categorieId)
{
    $categorie = Categories::find($categorieId);

    if (!$categorie) {
        return null; 
    }

    $numeroInsertion = Article::where('categories_id', $categorie->id)->count() + 1;
    $libellePrefixe = substr($libelle, 0, 3);
    $reference = "REF-{$libellePrefixe}-{$categorie->libelle}-{$numeroInsertion}";

    return $reference;
}
   
     public function ajouterArticleEtApprovisionnement(StoreArticleRequest $request)
     {
         try {
             // Démarrez une transaction
             DB::beginTransaction();
     
             $reference = $this->genererReference($request->input('libelle'), $request->input('categories_id'));

             if (!$reference) {
                 return response()->json(['message' => 'La catégorie spécifiée n\'existe pas'], 400);
             }

            // //  return $reference;



             $article = Article::create([
                 'reference' => $reference,
                 'libelle' => $request->input('libelle'),
                 'categories_id' => $request->input('categories_id'),
                 'prix_total' => 0,
                 'stock_total' => 0,
             ]);
     
             $fournisseurs = $request->input('fournisseur_id');
             $prixApprovisionnement = $request->input('prix');
             $stockApprovisionnement = $request->input('stock');
     
             foreach ($fournisseurs as $fournisseur_id) {
                 $approvisionnement = new Approvisionnement([
                     'prix' => $prixApprovisionnement,
                     'stock' => $stockApprovisionnement,
                     'article_id' => $article->id,
                     'fournisseur_id' => $fournisseur_id,
                 ]);
     
                 $approvisionnement->save();
     
                 $article->stock_total += $stockApprovisionnement;
                 $article->prix_total += $stockApprovisionnement * $prixApprovisionnement;
             }
     
             $article->save();
     
             // Validez et confirmez la transaction
             DB::commit();
     
             return (new ArticleResource($article))->withMessage("Ajout Réussi");
            
         } catch (\Exception $e) {
             // En cas d'erreur, annulez la transaction
             DB::rollback();
     
             return response()->json(['message' => 'Une erreur est survenue : ' . $e->getMessage()], 500);
         }
     }
     

     
    

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();
            return  $article;
    }

    public function recherche(Request $request)
    {
        $recherche = $request->recherche;
        if(strlen($recherche) < 3){
            return ["data" => null];
        }

        $article = Article::where('libelle',  $recherche)->first();

        if ($article) {
            return ["data" => $article];
        }

        return ["data" => null];
    }
}
