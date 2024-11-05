import { cn } from "@/lib/utils";

export const TableSkeleton = ({ columns = [], rowCount = 5 }) => {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-200 dark:bg-gray-700 h-12 mb-4 rounded-t-lg flex items-center px-6">
        {columns.map((_, index) => (
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
          <div className="w-4 h-4 mr-6 bg-gray-200 dark:bg-gray-700 rounded" />

          {/* Column cells skeleton */}
          {columns.map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 mr-4">
              <div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{
                  width: `${Math.random() * (100 - 30) + 30}%`,
                  maxWidth: colIndex === 0 ? "200px" : "150px",
                }}
              />
            </div>
          ))}

          {/* Actions skeleton */}
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
