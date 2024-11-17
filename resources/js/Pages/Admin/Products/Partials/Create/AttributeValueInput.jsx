const AttributeValueInput = ({ value, onChange, onRemove, type = 'text' }) => {
  const [focused, setFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (type === 'color') {
    return (
      <div className="flex items-center gap-2 group animate-in fade-in-0 duration-200">
        <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-white dark:bg-gray-800">
          <div 
            className="w-8 h-8 rounded-full border cursor-pointer hover:scale-110 transition-transform"
            style={{ backgroundColor: value }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          <div className="flex-1 relative">
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter color code (e.g., #FF0000)"
              className="border-0 focus-visible:ring-0 p-0 text-sm"
            />
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                <div className="relative bg-white p-2 rounded-lg shadow-lg border">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-40 h-40 p-0 border-0 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-2 group animate-in fade-in-0 duration-200",
        focused && "scale-[1.02]"
      )}
    >
      <div className="flex-1 flex items-center gap-2 p-2 rounded-lg border bg-white dark:bg-gray-800 transition-all">
        <Move className="w-4 h-4 text-muted-foreground cursor-move opacity-50 group-hover:opacity-100" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.target.blur();
            }
          }}
          placeholder="Enter value"
          className="border-0 focus-visible:ring-0 p-0 text-sm"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}; 