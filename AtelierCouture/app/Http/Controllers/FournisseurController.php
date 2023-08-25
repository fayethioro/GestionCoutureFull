<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFournisseurRequest;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function index()
    {
        return [
            'success' => true,
            'data' => Fournisseur::all(),
            'links' => null,
            'message' => 'liste des fournisseur'
        ];
    }

    public function store(StoreFournisseurRequest $request)
    {
        return [
            'success' => true,
            'data' =>  Fournisseur::create($request->validated())
        ];
    }
    public function recherche(Request $request)
    {
        $recherche = $request->recherche;
        if(strlen($recherche) < 3){
            return [
                'success' => true,
                'data' => null,
                'links' => null,
                'message' => 'liste des fournisseur'
            ];
        }

        $fournisseur = Fournisseur::where('nom_fournisseur', 'LIKE', $recherche . '%')->get();

        if ($fournisseur) {
            return [
                'success' => true,
                'data' => $fournisseur,
                'links' => null,
                'message' => 'liste des fournisseur'
            ];
        }

        return [
            'success' => true,
            'data' => null,
            'links' => null,
            'message' => 'liste des fournisseur'
        ];
    }
}
