import { cn } from "@/lib/utils";

/**
 * TableSkeleton component for showing loading states
 * @param {Array} columns - Column configurations
 * @param {Number} rowCount - Number of skeleton rows to display
 * @param {String} className - Additional CSS classes
 * @param {Boolean} hideHeader - Whether to hide the table header
 */
export const TableSkeleton = ({ 
  columns = [], 
  rowCount = 5, 
  className = "",
  hideHeader = false
}) => {
  return (
    <div className={cn("w-full animate-pulse", className)}>
      {/* Show header only when loading the entire table (not just loading more) */}
      {rowCount > 3 && !hideHeader && (
        <div className="bg-gray-200 dark:bg-gray-700 h-12 mb-4 rounded-t-lg flex items-center px-6">
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 mr-6 bg-gray-300 dark:bg-gray-600 rounded" />
          
          {/* Column headers skeleton */}
          {Array.from({ length: columns.length }).map((_, index) => (
            <div
              key={`header-${index}`}
              className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
              style={{
                width: `${Math.random() * (20 - 10) + 10}%`,
                marginRight: "16px",
              }}
            />
          ))}
        </div>
      )}

      {/* Rows Skeleton */}
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className={cn(
            "flex items-center px-6 py-4 bg-white dark:bg-gray-800",
            rowIndex !== rowCount - 1 && "border-b dark:border-gray-700"
          )}
        >
          {/* Checkbox skeleton */}
          <div className="w-4 h-4 mr-6 bg-gray-200 dark:bg-gray-700 rounded-sm" />

          {/* Column cells skeleton */}
          {columns.map((col, colIndex) => {
            // Calculate a width based on column type
            let width;
            if (col.id === 'avatar') {
              width = "40px";
            } else if (col.id === 'actions') {
              width = "60px";
            } else {
              width = `${Math.random() * (100 - 30) + 30}%`;
            }
            
            return (
              <div 
                key={`cell-${rowIndex}-${colIndex}`} 
                className={cn(
                  "flex-1 mr-4",
                  col.id === 'avatar' && "flex justify-center"
                )}
              >
                {col.id === 'avatar' ? (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                ) : (
                  <div
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                    style={{
                      width,
                      maxWidth: colIndex === 0 ? "200px" : "150px",
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Actions skeleton */}
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};
