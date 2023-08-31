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
            'libelle' => 'sometimes|required|string|min:3||unique:article_ventes',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg', 
            'categories_id' => 'sometimes|required|exists:categories,id',
            'marge_article' => 'sometimes|required|numeric|min:5000|max:1000000',
            'promo' => 'sometimes|boolean',
            'valeur_promo' => 'sometimes|numeric',
            'articleConf'=>'sometimes|required'
        ];
    }
}
