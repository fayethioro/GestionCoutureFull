<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\FournisseurController;

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
Route::post('/fournisseurs/recherche' , [FournisseurController::class , "recherche"])->name('rechercheFournisseurs');



