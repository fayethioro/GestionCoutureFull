<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoriesRequest extends FormRequest
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
            "libelle" => "required|string|min:3|unique:categories"
        ];
    }

    public function messages()
    {
         return [
           "libelle.required" => "Le champ libelle est obligatoire",
           "libelle.string" => "Le champ libelle doit etre un chaine de caractere",
           "libelle.min" => "Le champ libelle doit avoir au moins 3 caratéres",
           "libelle.unique" => "ce libelle existe deja dans categories",
         ];
    }
}
