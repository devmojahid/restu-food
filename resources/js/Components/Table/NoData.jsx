import { cn } from "@/lib/utils";

export const NoData = ({ title = "No data found", description, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
    >
      <div className="w-32 h-32 mb-4">
        <svg
          className="w-full h-full text-gray-300 dark:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2H6zm5.5 4h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-4 2h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm4 2h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-4 2h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm8 4H7a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5z" />
          <path
            className="opacity-50"
            d="M6 0a4 4 0 0 0-4 4v15a5 5 0 0 0 5 5h12a3 3 0 0 0 3-3V4a4 4 0 0 0-4-4H6zm0 2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H7a3 3 0 0 1-3-3V4a2 2 0 0 1 2-2z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};
