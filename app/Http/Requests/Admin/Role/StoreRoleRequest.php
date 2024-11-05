<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name'),
            ],
            'guard_name' => ['required', 'string', Rule::in(['web', 'api'])],
            'permissions' => ['required', 'array'],
            'permissions.*' => ['required', 'string', 'exists:permissions,name'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The role name is required.',
            'name.unique' => 'This role name already exists.',
            'guard_name.required' => 'The guard name is required.',
            'guard_name.in' => 'The guard name must be either web or api.',
            'permissions.required' => 'Please select at least one permission.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }
}
