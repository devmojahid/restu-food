export const cartesianProduct = (...arrays) => {
  return arrays.reduce((acc, curr) => 
    acc.flatMap(combo => curr.map(val => [...combo, val])),
    [[]]
  );
};

export const generateSKU = (baseSlug, attributes) => {
  const variantSlug = attributes
    .map(attr => attr.value.toLowerCase().replace(/\s+/g, '-'))
    .join('-');
  return `${baseSlug}-${variantSlug}`;
};

export const generateVariationSKU = (baseSlug, attributes) => {
    if (!attributes || !Array.isArray(attributes)) return '';
    
    const variantSlug = attributes
        .map(attr => attr.value?.toLowerCase().replace(/\s+/g, '-'))
        .filter(Boolean)
        .join('-');
    
    return `${baseSlug}-${variantSlug}`;
}; 