const VariationCard = ({ variation, index, onUpdate, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="group">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronRight 
              className={cn(
                "w-4 h-4 transition-transform",
                expanded && "rotate-90"
              )} 
            />
            <h4 className="font-medium">Variation {index + 1}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={variation.is_active ? "default" : "secondary"}>
              {variation.is_active ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={variation.is_active}
              onCheckedChange={(checked) => onUpdate(index, 'is_active', checked)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {variation.attributes.map((attr, idx) => (
            <Badge key={idx} variant="outline">
              {attr.name}: {attr.value}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <Collapsible open={expanded}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={variation.price}
                onChange={(e) => onUpdate(index, 'price', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                value={variation.stock_quantity}
                onChange={(e) => onUpdate(index, 'stock_quantity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={variation.sku}
                onChange={(e) => onUpdate(index, 'sku', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={variation.stock_status}
                onValueChange={(value) => onUpdate(index, 'stock_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="on_backorder">On Backorder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <FileUploader
              maxFiles={5}
              fileType="image"
              collection={`variation_${index}_images`}
              value={variation.images}
              onUpload={(files) => onUpdate(index, 'images', files)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={variation.weight}
                onChange={(e) => onUpdate(index, 'weight', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Dimensions (cm)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={variation.length}
                  onChange={(e) => onUpdate(index, 'length', e.target.value)}
                  placeholder="Length"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={variation.width}
                  onChange={(e) => onUpdate(index, 'width', e.target.value)}
                  placeholder="Width"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={variation.height}
                  onChange={(e) => onUpdate(index, 'height', e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Collapsible>
    </Card>
  );
}; 