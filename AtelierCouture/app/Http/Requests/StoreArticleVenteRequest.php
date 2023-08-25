<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleVenteRequest extends FormRequest
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
            'libelle' => 'required|string|min:3',
            'reference' => 'string|max:3',
            'photo' => 'image|mimes:jpeg,png,jpg', 
            'quantite_total' => 'numeric|min:1',
            'cout_fabrication' => 'numeric|min:1',
            'marge_article' => 'numeric|min:5000',
            'prix_vente' => 'numeric|min:1',
            'promo' => 'boolean',
            'valeur_promo' => 'numeric',
        ];
    }
}
