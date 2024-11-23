import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import AttributeManager from './AttributeManager'
import VariationManager from './VariationManager'

export default function ProductVariations({ 
  initialAttributes = [],
  initialVariations = [],
  onChange = () => {},
  readOnly = false,
  globalAttributes = []
}) {
  const [attributes, setAttributes] = useState(initialAttributes)
  const [variations, setVariations] = useState(initialVariations)

  // Update parent component when variations/attributes change
  useEffect(() => {
    onChange({
      attributes: attributes.map(attr => ({
        name: attr.name,
        values: attr.values,
        variation: attr.variation
      })),
      variations: variations.map(variation => ({
        id: variation.id,
        sku: variation.sku,
        price: variation.price,
        stock: variation.stock,
        enabled: variation.enabled,
        thumbnail: variation.thumbnail,
        weight: variation.weight,
        dimensions: variation.dimensions,
        // Include attribute values
        ...attributes
          .filter(attr => attr.variation)
          .reduce((acc, attr) => ({
            ...acc,
            [attr.name]: variation[attr.name]
          }), {})
      }))
    })
  }, [attributes, variations])

  const generateVariations = useCallback(() => {
    if (attributes.length === 0) return

    const combinations = attributes.reduce((acc, attr) => {
      if (!attr.variation) return acc
      const values = attr.values
      if (acc.length === 0) {
        return values.map(value => ({ [attr.name]: value }))
      }
      return acc.flatMap(combo => 
        values.map(value => ({ ...combo, [attr.name]: value }))
      )
    }, [])

    const newVariations = combinations.map((combo, index) => {
      const existingVariation = variations.find(v => 
        Object.entries(combo).every(([key, value]) => v[key] === value)
      )
      return {
        id: existingVariation?.id || Date.now() + index,
        ...combo,
        sku: existingVariation?.sku || '',
        price: existingVariation?.price || '',
        sale_price: existingVariation?.sale_price || '',
        stock: existingVariation?.stock || 0,
        enabled: existingVariation?.enabled ?? true,
        virtual: existingVariation?.virtual || false,
        downloadable: existingVariation?.downloadable || false,
        manage_stock: existingVariation?.manage_stock ?? true,
        weight: existingVariation?.weight || '',
        dimensions: existingVariation?.dimensions || { length: '', width: '', height: '' },
        thumbnail: existingVariation?.thumbnail || null
      }
    })

    setVariations(newVariations)
  }, [attributes, variations])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variations</CardTitle>
        <CardDescription>Manage your product attributes and variations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attributes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attributes">
            <AttributeManager
              attributes={attributes}
              setAttributes={setAttributes}
              readOnly={readOnly}
              globalAttributes={globalAttributes}
            />
          </TabsContent>
          
          <TabsContent value="variations">
            <VariationManager
              attributes={attributes}
              variations={variations}
              setVariations={setVariations}
              generateVariations={generateVariations}
              readOnly={readOnly}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 