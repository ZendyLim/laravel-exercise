<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'firstName' => 'required|max:255',
            'lastName' => 'required|max:255',
            'email' => 'required|unique:admins|max:255',
            'emailConfirm' => 'required|same:email',
            'password' => 'required|min:8',
            'passwordConfirm' => 'required|same:password',
            'recaptcha' => 'required'
        ];
    }
}
