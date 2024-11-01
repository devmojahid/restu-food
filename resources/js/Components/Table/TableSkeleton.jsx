import { cn } from "@/lib/utils";

export const TableSkeleton = ({ columns, rowCount = 5 }) => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {[...Array(rowCount)].map((_, index) => (
          <div
            key={index}
            className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
