import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { TabsList, TabsTrigger } from "@/Components/ui/tabs";

// Error Alert Component
export const ErrorAlert = ({ errors }) => {
  if (!Object.keys(errors).length) return null;

  return (
    <Alert variant="destructive" className="mb-6 animate-in fade-in-50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Error</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(errors).map(([field, messages]) => (
            <li key={field} className="text-sm">
              {Array.isArray(messages) ? messages[0] : messages}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

// Group Selector Component
export const GroupSelector = ({
  groups,
  selectedGroups,
  onChange,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      <Label>Quick Select Groups</Label>
      <div className="flex flex-wrap gap-2">
        {Object.keys(groups).map((group) => (
          <Button
            key={group}
            type="button"
            variant={selectedGroups.includes(group) ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => onChange(group)}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span className="capitalize">{group}</span>
            <Badge variant="secondary">{groups[group].length}</Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

// Tab Scroll Container
export const TabScrollContainer = ({ children }) => (
  <div className="relative">
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent pb-2">
      <div className="inline-flex min-w-full px-4">{children}</div>
    </div>
    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-8 pointer-events-none bg-gradient-to-r from-background to-transparent" />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-8 pointer-events-none bg-gradient-to-l from-background to-transparent" />
  </div>
);

// Custom Tabs List
export const CustomTabsList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <TabsList
      ref={ref}
      className={cn(
        "flex items-center h-14",
        "bg-background/95 backdrop-blur-sm",
        "rounded-xl",
        "border border-border/50",
        "shadow-sm",
        "relative",
        "p-1.5",
        "gap-2",
        "snap-x snap-mandatory",
        "min-w-full",
        className
      )}
      {...props}
    />
  )
);
CustomTabsList.displayName = "CustomTabsList";

// Custom Tab Trigger
export const CustomTabsTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <TabsTrigger
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center",
        "min-w-[160px] h-11",
        "px-4 py-2.5",
        "text-sm font-medium",
        "rounded-lg",
        "select-none",
        "transition-all duration-200",
        "bg-transparent",
        "text-muted-foreground",
        "hover:bg-muted/40 hover:text-foreground",
        "hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-0",
        "data-[state=active]:bg-primary/10",
        "data-[state=active]:text-primary",
        "data-[state=active]:shadow-sm",
        "data-[state=active]:font-semibold",
        "snap-center",
        "mx-0.5",
        className
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  )
);
CustomTabsTrigger.displayName = "CustomTabsTrigger";

// Permission Group Component
export const PermissionGroup = ({
  groupName,
  permissions,
  selectedPermissions = [],
  onToggle,
  disabled = false,
  onSelectAll,
  onDeselectAll,
}) => {
  const safeSelectedPermissions = Array.isArray(selectedPermissions)
    ? selectedPermissions
    : [];

  const allChecked = permissions.every((permission) =>
    safeSelectedPermissions.includes(permission.name)
  );

  const someChecked = permissions.some((permission) =>
    safeSelectedPermissions.includes(permission.name)
  );

  const selectedCount = permissions.filter((permission) =>
    safeSelectedPermissions.includes(permission.name)
  ).length;

  return (
    <div
      className={cn(
        "p-5 rounded-lg transition-all duration-200",
        "bg-card border border-border/40 shadow-sm",
        "hover:shadow-md hover:border-border/60"
      )}
    >
      {/* Permission Group Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`group-${groupName}`}
            checked={allChecked}
            disabled={disabled}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectAll(groupName);
              } else {
                onDeselectAll(groupName);
              }
            }}
            className="h-5 w-5"
          />
          <Label
            htmlFor={`group-${groupName}`}
            className="text-sm font-medium capitalize flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>{groupName}</span>
            <Badge variant="outline" className="ml-2">
              {selectedCount}/{permissions.length}
            </Badge>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || allChecked}
            onClick={() => onSelectAll(groupName)}
            className="whitespace-nowrap"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || !someChecked}
            onClick={() => onDeselectAll(groupName)}
            className="whitespace-nowrap"
          >
            Deselect All
          </Button>
        </div>
      </div>

      {/* Permission Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className={cn(
              "flex items-center space-x-2 p-3 rounded-lg",
              "bg-background/50 border border-transparent",
              "hover:bg-background hover:border-border/40",
              "transition-all duration-200",
              safeSelectedPermissions.includes(permission.name) &&
                "bg-primary/5 border-primary/20"
            )}
          >
            <Checkbox
              id={permission.name}
              disabled={disabled}
              checked={safeSelectedPermissions.includes(permission.name)}
              onCheckedChange={(checked) => onToggle(permission.name, checked)}
              className="h-4 w-4"
            />
            <Label
              htmlFor={permission.name}
              className="text-sm cursor-pointer flex-1"
            >
              {permission.name
                .split(".")
                .pop()
                .replace(/[._]/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Tab Container Component
export const TabContainer = ({ children, className }) => (
  <div
    className={cn(
      "rounded-xl bg-background/95 backdrop-blur-sm",
      "border border-border/40 shadow-sm",
      "p-4 space-y-4",
      className
    )}
  >
    {children}
  </div>
);

// Tab Content Wrapper Component
export const TabContentWrapper = ({ children }) => (
  <div className="relative mt-6 rounded-lg">{children}</div>
);
