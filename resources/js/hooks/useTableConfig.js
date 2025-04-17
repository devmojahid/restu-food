import { useState, useCallback } from 'react';

/**
 * Hook for managing table configurations
 * @param {Object} options - Configuration options
 * @param {Object} options.initialConfig - Initial configuration
 * @param {Object} options.columns - Column definitions
 */
export const useTableConfig = ({
  initialConfig = {},
  columns = []
}) => {
  const [config, setConfig] = useState({
    columns: columns.map(col => ({
      ...col,
      isVisible: col.isVisible !== false,
      width: col.width || 'auto',
      priority: col.priority || 0
    })),
    sortable: initialConfig.sortable !== false,
    selectable: initialConfig.selectable !== false,
    filterable: initialConfig.filterable !== false,
    responsive: initialConfig.responsive !== false,
    ...initialConfig
  });

  // Toggle column visibility
  const toggleColumn = useCallback((columnId) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId 
          ? { ...col, isVisible: !col.isVisible }
          : col
      )
    }));
  }, []);

  // Reorder columns
  const reorderColumns = useCallback((sourceIndex, targetIndex) => {
    setConfig(prev => {
      const newColumns = [...prev.columns];
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(targetIndex, 0, removed);
      return { ...prev, columns: newColumns };
    });
  }, []);

  // Resize column
  const resizeColumn = useCallback((columnId, width) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId
          ? { ...col, width }
          : col
      )
    }));
  }, []);

  // Update column config
  const updateColumnConfig = useCallback((columnId, updates) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId
          ? { ...col, ...updates }
          : col
      )
    }));
  }, []);

  // Get visible columns based on screen size
  const getVisibleColumns = useCallback((screenSize = 'desktop') => {
    return config.columns.filter(col => {
      if (!col.isVisible) return false;
      if (!col.responsive) return true;
      
      switch(screenSize) {
        case 'mobile':
          return col.priority <= 1;
        case 'tablet':
          return col.priority <= 2;
        default:
          return true;
      }
    });
  }, [config.columns]);

  // Reset configuration to initial state
  const resetConfig = useCallback(() => {
    setConfig({
      columns: columns.map(col => ({
        ...col,
        isVisible: col.isVisible !== false,
        width: col.width || 'auto',
        priority: col.priority || 0
      })),
      sortable: initialConfig.sortable !== false,
      selectable: initialConfig.selectable !== false,
      filterable: initialConfig.filterable !== false,
      responsive: initialConfig.responsive !== false,
      ...initialConfig
    });
  }, [columns, initialConfig]);

  return {
    config,
    toggleColumn,
    reorderColumns,
    resizeColumn,
    updateColumnConfig,
    getVisibleColumns,
    resetConfig
  };
}; 