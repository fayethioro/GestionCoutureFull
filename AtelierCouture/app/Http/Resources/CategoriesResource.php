<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\CategoriesCollection;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoriesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

         public function toArray($request)
         {
             $message = '';
             $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
     
             if ($request->isMethod('get')) {
                 $message = 'Récupération réussie';
                 $statusCode = Response::HTTP_OK;
             } elseif ($request->isMethod('post')) {
                 $message = 'Création réussie';
                 $statusCode = Response::HTTP_CREATED;
             } elseif ($request->isMethod('put')) {
                 $message = 'Mise à jour réussie';
                 $statusCode = Response::HTTP_OK; 
             } elseif ($request->isMethod('delete')) {
                 $message = 'Suppression réussie';
                 $statusCode = Response::HTTP_NO_CONTENT;
             }
     
             return [
                 'statusCode' => $statusCode,
                 'message' => $message,
                 'data' => $this->resource,
             ];
         }


        

        // public static function collection($resource)
        // {
        //     return new CategoriesCollection($resource);
        // }
     }
     
 



