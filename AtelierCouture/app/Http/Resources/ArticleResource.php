<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'libelle' => $this->libelle,
            'reference' =>$this->reference,
            'stock_total' =>$this->stock_total,
            'prix_total' => $this->prix_total,
            'caterigorie' =>$this->categories_id
        ];
    }

    public function withMessage($message)
    {
        return $this->additional([
            'message' => $message,
        ]);
    }

    public function with($request)
    {
        return [
            'success' => true,
            'links' =>null,
        ];
    }
}
