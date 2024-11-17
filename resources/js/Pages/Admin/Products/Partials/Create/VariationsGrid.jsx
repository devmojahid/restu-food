const VariationsGrid = ({ variations, onUpdate }) => {
  const [view, setView] = useState('grid'); // 'grid' or 'table'
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ field: 'price', direction: 'asc' });

  const filteredVariations = variations.filter(v => 
    v.attributes.some(attr => 
      attr.value.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedVariations = [...filteredVariations].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];
    return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter variations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-64"
          />
          <Select
            value={view}
            onValueChange={setView}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newPrice = prompt('Enter price for all variations:');
              if (newPrice && !isNaN(newPrice)) {
                variations.forEach((v, i) => onUpdate(i, 'price', newPrice));
              }
            }}
          >
            Bulk Update Price
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const stock = prompt('Enter stock quantity for all variations:');
              if (stock && !isNaN(stock)) {
                variations.forEach((v, i) => onUpdate(i, 'stock_quantity', stock));
              }
            }}
          >
            Bulk Update Stock
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVariations.map((variation, index) => (
            <VariationCard
              key={index}
              variation={variation}
              index={index}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Variation</th>
                <th>Price</th>
                <th>Stock</th>
                <th>SKU</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVariations.map((variation, index) => (
                <tr key={index}>
                  <td>
                    {variation.attributes.map(attr => 
                      `${attr.name}: ${attr.value}`
                    ).join(', ')}
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={variation.price}
                      onChange={(e) => onUpdate(index, 'price', e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      value={variation.stock_quantity}
                      onChange={(e) => onUpdate(index, 'stock_quantity', e.target.value)}
                    />
                  </td>
                  <td>
                    <Input
                      value={variation.sku}
                      onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const variation = variations[index];
                        variation.is_active = !variation.is_active;
                        onUpdate(index, 'is_active', variation.is_active);
                      }}
                    >
                      {variation.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 