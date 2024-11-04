<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'status' => ['required', 'in:active,inactive,banned'],
            'avatar' => ['nullable', 'array'],
            'avatar.uuid' => ['nullable', 'string', 'exists:files,uuid'],
        ];

        // Add password rules for new users or when updating password
        if (!$this->user || $this->filled('password')) {
            $rules['password'] = ['required', 'string', Password::defaults(), 'confirmed'];
        }

        // Modify email unique rule for updates
        if ($this->user) {
            $rules['email'][4] = 'unique:users,email,' . $this->user->id;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'role.required' => 'Please select a role.',
            'role.exists' => 'The selected role is invalid.',
            'password.required' => 'The password field is required.',
            'password.confirmed' => 'The password confirmation does not match.',
        ];
    }
}
