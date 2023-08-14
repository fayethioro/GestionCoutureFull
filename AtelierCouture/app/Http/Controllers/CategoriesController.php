<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CategoriesResource;
use App\Http\Resources\CategoriesCollection;
use App\Http\Requests\StoreCategoriesRequest;
use App\Http\Requests\UpdateCategoriesRequest;
use Symfony\Component\HttpFoundation\Response;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::all()->sort();
        return new CategoriesResource($categories);
    }

    public function pagination(Request $request)
    {
        $parPage = $request->input('limit', 3);
        $categories = Categories::orderBy('created_at', 'desc')->paginate($parPage);
        
        $currentPage = $categories->currentPage();
        return [
            'current_page' => $currentPage,
            // 'data' => $categories->items()
           "data" => new CategoriesResource($categories)

        ];
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoriesRequest $request)
    {
        $validator = Validator::make($request->all() , $request->rules() , $request->messages());

        if ($validator->fails()) {
            return new CategoriesResource($validator->errors());

        }

        $categorie = Categories::create($request->validated());

        return new CategoriesResource($categorie);

    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoriesRequest $request, Categories $category)
    {
        $validatedData = $request->validated();

        $category->update($validatedData);


        return new CategoriesResource($category);

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categories $category)
    {
            $category->delete();
            return new CategoriesResource($category);
    }

    public function destroyMultiple(Request $request)
    {
        $categoryIds = $request->input('category_ids', []);

        if (empty($categoryIds)) {
            return new CategoriesResource("");

        }

        $deletedCategories = Categories::whereIn('id', $categoryIds)->get();

        Categories::whereIn('id', $categoryIds)->delete();

        return new CategoriesResource($deletedCategories);

    }

    public function restore(Categories $category)
    {
        $category->restore();
        return new CategoriesResource($category);

    }


    public function recherche(Request $request)
    {
        $recherche = $request->recherche;
        // return $recherche;

        if(strlen($recherche) < 3){
            return ["data" => null];


        }

        $categories = Categories::where('libelle',  $recherche)->first();

        if ($categories) {
            return ["data" => $categories];
        }

        return ["data" => null];



    }

}
