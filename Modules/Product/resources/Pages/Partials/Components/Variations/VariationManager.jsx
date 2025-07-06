import React, { useState } from 'react'
import { RefreshCw, AlertCircle, Search, ArrowUpDown } from 'lucide-react'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { Card, CardContent } from "@/Components/ui/card"
import BulkEditor from './BulkEditor'
import VariationTable from './VariationTable'
import VariationForm from './VariationForm'

export default function VariationManager({
  attributes,
  variations,
  setVariations,
  generateVariations,
  readOnly = false
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [selectedVariations, setSelectedVariations] = useState([])
  const [editingVariation, setEditingVariation] = useState(null)
  const [showManualAdd, setShowManualAdd] = useState(false)

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredVariations = variations
    .filter(variation => 
      Object.values(variation).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Variations</h3>
        {!readOnly && (
          <div className="flex gap-2">
            <Button onClick={generateVariations} 
              type="button"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate variations
            </Button>
            <Button variant="outline" onClick={() => setShowManualAdd(true)} 
              type="button"
            >
              Add manually
            </Button>
            <BulkEditor
              selectedVariations={selectedVariations}
              variations={variations}
              setVariations={setVariations}
              setSelectedVariations={setSelectedVariations}
            />
          </div>
        )}
      </div>

      {variations.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No variations yet. Add attributes and click "Regenerate variations" to create them automatically, or click "Add manually" to create them one by one.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Search variations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline" className="shrink-0">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            <VariationTable
              variations={filteredVariations}
              attributes={attributes}
              selectedVariations={selectedVariations}
              setSelectedVariations={setSelectedVariations}
              setVariations={setVariations}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={setEditingVariation}
              readOnly={readOnly}
            />
          </CardContent>
        </Card>
      )}

      {/* Variation Edit Dialog */}
      {editingVariation && (
        <VariationForm
          variation={editingVariation}
          onSave={(formData) => {
            const newVariations = variations.map(v =>
              v.id === editingVariation.id ? { ...v, ...formData } : v
            )
            setVariations(newVariations)
            setEditingVariation(null)
          }}
          onCancel={() => setEditingVariation(null)}
          readOnly={readOnly}
        />
      )}

      {/* Manual Add Dialog */}
      {showManualAdd && (
        <VariationForm
          attributes={attributes}
          onSave={(formData) => {
            setVariations([...variations, { id: Date.now(), ...formData }])
            setShowManualAdd(false)
          }}
          onCancel={() => setShowManualAdd(false)}
        />
      )}
    </div>
  )
} 