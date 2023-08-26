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
            'libelle' => 'required|string|min:3||unique:article_ventes',
            'photo' => 'image|mimes:jpeg,png,jpg', 
            'categories_id' => 'required|exists:categories,id',
            'marge_article' => '|required|numeric|min:5000|max:1000000',
            'promo' => 'boolean',
            'valeur_promo' => 'numeric',
            'article_id'=>'required'
        ];
    }
}
