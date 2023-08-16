<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class CategoriesCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
   
     public function toArray($request)
     {
         return [
             'id' => $this->id,
             'libelle' => $this->libelle,
         ];
     }
 
     public static function formatResponse($request, $data)
     {
         $message = self::getMessage($request);
 
         return [
             'success' => true,
             'message' => $message,
             'data' => $data,
         ];
     }
 
     private static function getMessage($request)
     {
         if ($request->isMethod('get')) {
             return 'Récupération réussie';
         } elseif ($request->isMethod('post')) {
             return 'Création réussie';
         } elseif ($request->isMethod('put')) {
             return 'Mise à jour réussie';
         } elseif ($request->isMethod('delete')) {
             return 'Suppression réussie';
         } else {
             return 'Opération réussie';
         }
     } 
}
