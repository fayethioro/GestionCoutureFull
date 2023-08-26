<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtcleVenteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'libelle' =>$this->whenNotNull($this->libelle),
            'reference' =>$this->whenNotNull($this->reference),
            'photo' =>$this->whenNotNull($this->photo),
            'quantite_total' =>$this->whenNotNull($this->quantite_total),
            'cout_fabrication' =>$this->whenNotNull($this->cout_fabrication),
            'marge_article' =>$this->whenNotNull($this->marge_article),
            'prix_vente' =>$this->whenNotNull($this->prix_vente),
            'promo' =>$this->whenNotNull($this->promo),
            'valeur_promo' =>$this->whenNotNull($this->valeur_promo),

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
