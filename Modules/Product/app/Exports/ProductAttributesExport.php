<?php

declare(strict_types=1);

namespace Modules\Product\app\Exports;

use App\Models\ProductAttribute;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

final class ProductAttributesExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return ProductAttribute::with('values')->get();
    }

    public function headings(): array
    {
        return [
            'Name',
            'Slug',
            'Type',
            'Is Global',
            'Is Visible',
            'Is Variation',
            'Values',
        ];
    }

    public function map($attribute): array
    {
        return [
            $attribute->name,
            $attribute->slug,
            $attribute->type,
            $attribute->is_global ? 'Yes' : 'No',
            $attribute->is_visible ? 'Yes' : 'No',
            $attribute->is_variation ? 'Yes' : 'No',
            $attribute->values->pluck('value')->implode(', '),
        ];
    }
} 