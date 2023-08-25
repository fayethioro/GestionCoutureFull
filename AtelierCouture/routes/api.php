<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ArticleVenteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\FournisseurController;
use App\Models\ArticleVente;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/categories/destoyMultiple' , [CategoriesController::class , "destroyMultiple"]);
Route::post('/categories/recherche' , [CategoriesController::class , "recherche"]);
Route::get('/categories/pagination' , [CategoriesController::class , "pagination"]);
Route::resource('categories', CategoriesController::class);
Route::post('/categories/restaure/{category}' , [CategoriesController::class , "restore"])->withTrashed();

Route::get('/articles/pagination' , [ArticleController::class , "paginationArticle"])->name('paginationArticle');
Route::post('/articles/recherche' , [ArticleController::class , "recherche"])->name('rechercheLibelle');
Route::resource('articles', ArticleController::class);

Route::get('/fournisseurs' , [FournisseurController::class , "index"])->name('index');
Route::post('/fournisseurs' , [FournisseurController::class , "store"])->name('store');
Route::post('/fournisseurs/recherche' , [FournisseurController::class , "recherche"])->name('rechercheFournisseurs');

Route::get('/article_ventes/pagination' , [ArticleVenteController::class , "paginationArticle"]);
Route::resource('article_ventes' , ArticleVenteController::class );
Route::post('/article_ventes/recherche' , [ArticleVenteController::class , "recherche"])->name('rechercheArticles');



