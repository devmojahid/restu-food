<?php

declare(strict_types=1);

namespace Modules\Product\app\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class CurrencyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currencyId = $this->route('currency')?->id;

        return [
            'code' => [
                'required',
                'string',
                'size:3',
                'uppercase',
                Rule::unique('currencies', 'code')->ignore($currencyId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['required', 'string', 'max:10'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'decimal_places' => ['required', 'integer', 'min:0', 'max:4'],
            'decimal_separator' => ['required', 'string', 'size:1'],
            'thousand_separator' => ['required', 'string', 'size:1'],
            'symbol_position' => ['required', Rule::in(['before', 'after'])],
            'space_between' => ['required', 'boolean'],
            'is_default' => ['required', 'boolean'],
            'is_enabled' => ['required', 'boolean'],
        ];
    }
} 