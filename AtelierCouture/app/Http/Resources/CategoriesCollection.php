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
    
        public function with($request)
        {
            $message = $this->getMessage($request);
            $statusCode = $this->getStatusCode($request);
    
            return [
                'statusCode' => $statusCode,
                'message' => $message,
            ];
        }
    
        protected function getMessage($request)
        {
            $messages = [
                'GET' => 'Récupération réussie',
                'POST' => 'Création réussie',
                'PUT' => 'Mise à jour réussie',
                'DELETE' => 'Suppression réussie',
            ];
    
            $method = strtoupper($request->getMethod());
    
            return $messages[$method] ?? 'Opération réussie';
        }
        protected function getStatusCode($request)
        {
            $statusCodes = [
                'GET' => Response::HTTP_OK,
                'POST' => Response::HTTP_CREATED,
                'PUT' => Response::HTTP_OK,
                'DELETE' => Response::HTTP_NO_CONTENT,
            ];
    
            $method = strtoupper($request->getMethod());
    
            return $statusCodes[$method] ?? Response::HTTP_OK;
        }
    
}
