<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\ProductAttribute;
use App\Models\ProductAttributeSet;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

trait HasAttributeValues
{
    public function attributeSets(): HasMany
    {
        return $this->hasMany(ProductAttributeSet::class);
    }

    public function setAttributeValue(ProductAttribute $attribute, array $values): void
    {
        $attributeSet = $this->attributeSets()->firstOrCreate([
            'attribute_id' => $attribute->id,
        ]);

        $attributeSet->values()->sync(collect($values)->pluck('id'));
    }

    public function getAttributeValues(ProductAttribute $attribute): Collection
    {
        return $this->attributeSets()
            ->where('attribute_id', $attribute->id)
            ->first()
            ?->values()
            ->get() ?? collect();
    }

    public function syncAttributes(array $attributes): void
    {
        foreach ($attributes as $attributeId => $values) {
            $attribute = ProductAttribute::find($attributeId);
            if ($attribute) {
                $this->setAttributeValue($attribute, $values);
            }
        }
    }

    public function hasAttributeValue(ProductAttribute $attribute, $value): bool
    {
        return $this->getAttributeValues($attribute)
            ->contains('id', is_array($value) ? $value['id'] : $value);
    }
} 