<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class CategoriesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

        public function toArray($request)
        {
            return [
                'statusCode' => $this->getStatusCode($request),
                'message' => $this->getMessage($request),
                'data' => $this->resource,
            ];
        }

        public function getMessage($request)
        {
            if ($request->isMethod('get')) {
                return 'Récupération réussie';
            } elseif ($request->isMethod('post')) {
                return 'Création réussie';
            } elseif ($request->isMethod('put')) {
                return 'Mise à jour réussie';
            } elseif ($request->isMethod('delete')) {
                return 'Suppression réussie';
            }

            return "une erreur s'est produit";
        }

        public function getStatusCode($request)
        {
            if ($request->isMethod('get')) {
                return Response::HTTP_OK;
            } elseif ($request->isMethod('post')) {
                return Response::HTTP_CREATED;
            } elseif ($request->isMethod('put')) {
                return Response::HTTP_OK; // Peut-être Response::HTTP_NO_CONTENT si la mise à jour ne renvoie pas de contenu.
            } elseif ($request->isMethod('delete')) {
                return Response::HTTP_NO_CONTENT;
            }

            return Response::HTTP_INTERNAL_SERVER_ERROR; // Statut par défaut en cas d'opération non reconnue.
        }
    }


