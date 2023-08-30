<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleVenteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'libelle' => 'sometimes|required|string|min:3',
            'reference' => 'sometimes|string|max:255',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg', 
            'quantite_total' => 'sometimes|numeric|min:1',
            'cout_fabrication' => 'sometimes|numeric|min:1',
            'marge_article' => 'sometimes|numeric|min:5000',
            'prix_vente' => 'sometimes|numeric|min:1',
            'promo' => 'sometimes|boolean',
            'valeur_promo' => 'sometimes|numeric',
        ];
    }
}
