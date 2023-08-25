<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFournisseurRequest extends FormRequest
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
            "nom_fournisseur" => "required|string|min:3|unique:fournisseurs",
           
        ];
    }

    public function failedValidator($validator)
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
