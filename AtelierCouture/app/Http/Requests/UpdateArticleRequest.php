<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
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
            'libelle' => 'sometimes|required|string|unique:articles',
            'prix' => 'sometimes|required|numeric|min:1', 
            'stock' => 'sometimes|required|numeric|min:0.O1',
            'category_id' => 'sometimes|required|exists:categories,id',
            'fournisseur_id' => 'sometimes|required|exists:fournisseurs,id',
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg', 
        ];
    }

    public function messages()
    {
        return [
            'libelle.required' => 'Le champ Libellé est obligatoire.',
            'libelle.unique' => 'Le libellé est déjà utilisé.',
            'prix.required' => 'Le champ Prix est obligatoire.',
            'prix.numeric' => 'Le champ Prix doit être un nombre.',
            'prix.min' => 'Le prix doit être supérieur à zéro.',
            'stock.required' => 'Le champ Stock est obligatoire.',
            'stock.numeric' => 'Le champ Stock doit être un nombre.',
            'stock.min' => 'Le stock ne peut pas être négatif.',
            'category_id.required' => 'Le champ Catégorie est obligatoire.',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas.',
            'fournisseur_id.required' => 'Le champ Fournisseur est obligatoire.',
            'fournisseur_id.exists' => 'Le fournisseur sélectionné n\'existe pas.',
            // 'photo.required' => 'Le champ Photo est obligatoire.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.mimes' => 'Le fichier doit être de type :mimes.',
            // 'photo.max' => 'La taille du fichier ne peut pas dépasser :max kilo-octets.',
        ];
    }
    public function withValidator($validator)
    {
        if ($validator->fails()) {

           return [
            'success' => false,
            'data' =>  $validator->errors(),
            'links' => null,
        ];
        }
    }
}
