<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;

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


Route::delete('/categories/destoyMultiple' , [CategoriesController::class , "destroyMultiple"]);
Route::post('/categories/recherche' , [CategoriesController::class , "recherche"]);
Route::get('/categories/pagination' , [CategoriesController::class , "pagination"]);
Route::resource('categories', CategoriesController::class);
Route::post('/categories/restaure/{category}' , [CategoriesController::class , "restore"])->withTrashed();
