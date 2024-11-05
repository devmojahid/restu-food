import React, { useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
  Save,
  ArrowLeft,
  Search,
  CheckCircle2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Checkbox } from "@/Components/ui/checkbox";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { useToast } from "@/Components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

// Enhanced Error Alert with better styling
const ErrorAlert = ({ errors }) => {
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

// Add new components for better group selection
const GroupSelector = ({ groups, selectedGroups, onChange, disabled }) => {
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

// Enhanced tab scroll container with better scrolling
const TabScrollContainer = ({ children }) => (
  <div className="relative">
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent pb-2">
      <div className="inline-flex min-w-full px-4">{children}</div>
    </div>
    {/* Enhanced scroll indicators with better visibility */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-8 pointer-events-none bg-gradient-to-r from-background to-transparent" />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-8 pointer-events-none bg-gradient-to-l from-background to-transparent" />
  </div>
);

// Enhanced custom tab list with better scrolling
const CustomTabsList = React.forwardRef(({ className, ...props }, ref) => (
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
      // Improved spacing
      "gap-2",
      // Better scrolling behavior
      "snap-x snap-mandatory",
      "min-w-full",
      className
    )}
    {...props}
  />
));

// Enhanced tab trigger with better spacing and snap scrolling
const CustomTabsTrigger = React.forwardRef(
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
        // Enhanced hover state
        "hover:bg-muted/40 hover:text-foreground",
        "hover:shadow-sm",
        // Better focus state
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-0",
        // Improved active state
        "data-[state=active]:bg-primary/10",
        "data-[state=active]:text-primary",
        "data-[state=active]:shadow-sm",
        "data-[state=active]:font-semibold",
        // Snap scrolling
        "snap-center",
        // Better spacing
        "mx-0.5",
        className
      )}
      {...props}
    >
      {children}
    </TabsTrigger>
  )
);

// Enhanced tab content wrapper
const TabContentWrapper = ({ children }) => (
  <div className="relative mt-6 rounded-lg">{children}</div>
);

// Enhanced Permission Group component without divider
const PermissionGroup = ({
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

      {/* Permission items grid */}
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

// Enhanced tab container with better design
const TabContainer = ({ children, className }) => (
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

export default function CreateRole({ permissions }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { toast } = useToast();

  // Initialize form with proper default values and ensure permissions is always an array
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    permissions: [], // Ensure this is initialized as an empty array
    description: "",
    guard_name: "web",
  });

  // Add a safe permissions getter to ensure we always work with an array
  const safePermissions = React.useMemo(() => {
    return Array.isArray(data.permissions) ? data.permissions : [];
  }, [data.permissions]);

  // Move groupedPermissions definition before its usage
  const groupedPermissions = React.useMemo(() => {
    return permissions.reduce((acc, permission) => {
      const group = permission.group_name || "other";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(permission);
      return acc;
    }, {});
  }, [permissions]);

  // Enhanced search functionality
  const filteredGroups = React.useMemo(() => {
    return Object.entries(groupedPermissions).reduce((acc, [group, perms]) => {
      const filtered = perms.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[group] = filtered;
      }
      return acc;
    }, {});
  }, [groupedPermissions, searchTerm]);

  // Enhanced permission toggle handler with better state management
  const togglePermission = useCallback(
    (permissionName, checked) => {
      setData((prevData) => {
        const currentPermissions = Array.isArray(prevData.permissions)
          ? [...prevData.permissions]
          : [];

        let newPermissions;
        if (checked) {
          newPermissions = [
            ...new Set([...currentPermissions, permissionName]),
          ];
        } else {
          newPermissions = currentPermissions.filter(
            (p) => p !== permissionName
          );
        }

        // Update group selection state
        Object.entries(groupedPermissions).forEach(([group, perms]) => {
          const groupPermissionNames = perms.map((p) => p.name);
          const allGroupPermissionsSelected = groupPermissionNames.every((p) =>
            newPermissions.includes(p)
          );

          if (allGroupPermissionsSelected) {
            setSelectedGroups((prev) => [...new Set([...prev, group])]);
          } else {
            setSelectedGroups((prev) => prev.filter((g) => g !== group));
          }
        });

        return {
          ...prevData,
          permissions: newPermissions,
        };
      });
    },
    [groupedPermissions, setData]
  );

  // Enhanced select all handler
  const handleSelectAll = useCallback(
    (groupName) => {
      const groupPermissions =
        groupedPermissions[groupName]?.map((p) => p.name) || [];

      setData((prevData) => {
        const currentPermissions = Array.isArray(prevData.permissions)
          ? [...prevData.permissions]
          : [];

        const newPermissions = [
          ...new Set([...currentPermissions, ...groupPermissions]),
        ];

        return {
          ...prevData,
          permissions: newPermissions,
        };
      });

      setSelectedGroups((prev) => [...new Set([...prev, groupName])]);
    },
    [groupedPermissions, setData]
  );

  // Enhanced deselect all handler
  const handleDeselectAll = useCallback(
    (groupName) => {
      const groupPermissions =
        groupedPermissions[groupName]?.map((p) => p.name) || [];

      setData((prevData) => {
        const currentPermissions = Array.isArray(prevData.permissions)
          ? [...prevData.permissions]
          : [];

        const newPermissions = currentPermissions.filter(
          (p) => !groupPermissions.includes(p)
        );

        return {
          ...prevData,
          permissions: newPermissions,
        };
      });

      setSelectedGroups((prev) => prev.filter((g) => g !== groupName));
    },
    [groupedPermissions, setData]
  );

  // Enhanced group selection handler
  const handleGroupSelection = useCallback(
    (groupName) => {
      const isSelected = selectedGroups.includes(groupName);
      const groupPermissions =
        groupedPermissions[groupName]?.map((p) => p.name) || [];

      if (isSelected) {
        handleDeselectAll(groupName);
      } else {
        handleSelectAll(groupName);
      }
    },
    [selectedGroups, groupedPermissions, handleSelectAll, handleDeselectAll]
  );

  // Update the PermissionGroup component props
  const renderPermissionGroup = useCallback(
    ({ group, permissions: groupPermissions }) => (
      <PermissionGroup
        key={group}
        groupName={group}
        permissions={groupPermissions}
        selectedPermissions={data.permissions}
        onToggle={togglePermission}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        disabled={processing || isSubmitting}
      />
    ),
    [
      data.permissions,
      togglePermission,
      handleSelectAll,
      handleDeselectAll,
      processing,
      isSubmitting,
    ]
  );

  // Enhanced Selected Permissions Summary component
  const SelectedPermissionsSummary = React.memo(({ permissions, onRemove }) => {
    if (!permissions.length) return null;

    // Group selected permissions by their category
    const groupedSelected = permissions.reduce((acc, permission) => {
      const group = permission.split(".")[0] || "other";
      if (!acc[group]) acc[group] = [];
      acc[group].push(permission);
      return acc;
    }, {});

    return (
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Selected Permissions</h4>
          <Badge variant="secondary">{permissions.length} selected</Badge>
        </div>
        <div className="space-y-4">
          {Object.entries(groupedSelected).map(([group, perms]) => (
            <div key={group} className="space-y-2">
              <h5 className="text-sm font-medium capitalize">{group}</h5>
              <div className="flex flex-wrap gap-2">
                {perms.map((permission) => (
                  <Badge
                    key={permission}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="truncate max-w-[200px]">
                      {permission.split(".").slice(1).join(".")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => onRemove(permission)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  });

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = "Role name is required";
    }

    if (!Array.isArray(data.permissions) || data.permissions.length === 0) {
      errors.permissions = "At least one permission must be selected";
    }

    return errors;
  }, [data]);

  // Enhanced submit handler with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        toast({
          title: "Validation Error",
          description: value,
          variant: "destructive",
        });
      });
      return;
    }

    setIsSubmitting(true);

    post(route("app.roles.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        toast({
          title: "Success",
          description: "Role created successfully",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
        reset();
        setActiveTab("all");
        setSearchTerm("");
        setSelectedGroups([]);
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast({
          title: "Error",
          description: error?.message || "Failed to create role",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-[1400px] mx-auto px-4"
    >
      <ErrorAlert errors={errors} />

      {/* Enhanced Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Role
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create a new role and assign permissions to manage access control
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={processing || isSubmitting}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {processing || isSubmitting ? "Saving..." : "Save Role"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Enhanced Role Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>
              Enter the basic information for the new role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-1">
                <span>Role Name</span>
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                disabled={processing || isSubmitting}
                className={cn(
                  "transition-all duration-200",
                  errors.name && "border-red-500 focus:ring-red-500"
                )}
                placeholder="Enter role name (e.g., Editor, Moderator)"
              />
              {errors.name && (
                <p className="text-sm text-red-500 animate-in fade-in-50">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                disabled={processing || isSubmitting}
                placeholder="Brief description of the role's purpose"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guard_name">Guard Name</Label>
              <Select
                value={data.guard_name}
                onValueChange={(value) => setData("guard_name", value)}
                disabled={processing || isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select guard name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Guard</SelectItem>
                  <SelectItem value="api">API Guard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Permissions Card with better responsive design */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/40 space-y-1">
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Select the permissions to assign to this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Enhanced Group Selector with better responsive design */}
            <div className="space-y-4 rounded-lg border border-border/40 p-4 bg-card">
              <GroupSelector
                groups={groupedPermissions}
                selectedGroups={selectedGroups}
                onChange={handleGroupSelection}
                disabled={processing || isSubmitting}
              />
            </div>

            <Separator className="my-6" />

            {/* Enhanced Search and Tabs */}
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              <TabContainer>
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2">
                    <TabScrollContainer>
                      <CustomTabsList>
                        <CustomTabsTrigger value="all" className="first:ml-0">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="whitespace-nowrap">
                              All Permissions
                            </span>
                            <Badge
                              variant={
                                activeTab === "all" ? "default" : "secondary"
                              }
                              className={cn(
                                "transition-colors duration-200",
                                "min-w-[2rem] justify-center",
                                activeTab === "all"
                                  ? "bg-primary/15 text-primary border-primary/20"
                                  : "hover:bg-primary/10 hover:text-primary"
                              )}
                            >
                              {permissions.length}
                            </Badge>
                          </div>
                        </CustomTabsTrigger>

                        {Object.entries(groupedPermissions).map(
                          ([group, perms]) => (
                            <CustomTabsTrigger
                              key={group}
                              value={group}
                              className="flex-shrink-0"
                            >
                              <div className="flex items-center gap-2">
                                <span className="capitalize whitespace-nowrap">
                                  {group}
                                </span>
                                <Badge
                                  variant={
                                    activeTab === group
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={cn(
                                    "transition-colors duration-200",
                                    "min-w-[2rem] justify-center",
                                    activeTab === group
                                      ? "bg-primary/15 text-primary border-primary/20"
                                      : "hover:bg-primary/10 hover:text-primary"
                                  )}
                                >
                                  {perms.length}
                                </Badge>
                              </div>
                            </CustomTabsTrigger>
                          )
                        )}
                        {/* Add padding element to ensure last item is visible */}
                        <div className="w-4 flex-shrink-0" aria-hidden="true" />
                      </CustomTabsList>
                    </TabScrollContainer>
                  </div>

                  <TabContentWrapper>
                    <ScrollArea
                      className="h-[calc(100vh-20rem)] min-h-[400px] max-h-[600px] pr-4 rounded-lg"
                      scrollHideDelay={100}
                    >
                      <TabsContent
                        value="all"
                        className={cn(
                          "space-y-4 mt-4 pt-2 focus-visible:outline-none",
                          "animate-in fade-in-50 duration-200 slide-in-from-left-1"
                        )}
                      >
                        {Object.entries(filteredGroups).map(
                          ([group, groupPermissions]) =>
                            renderPermissionGroup({
                              group,
                              permissions: groupPermissions,
                            })
                        )}
                      </TabsContent>

                      {Object.entries(groupedPermissions).map(
                        ([group, groupPermissions]) => (
                          <TabsContent
                            key={group}
                            value={group}
                            className={cn(
                              "space-y-4 mt-4 pt-2 focus-visible:outline-none",
                              "animate-in fade-in-50 duration-200 slide-in-from-left-1"
                            )}
                          >
                            {renderPermissionGroup({
                              group,
                              permissions: groupPermissions,
                            })}
                          </TabsContent>
                        )
                      )}
                    </ScrollArea>
                  </TabContentWrapper>
                </Tabs>
              </TabContainer>

              {/* Enhanced Selected Permissions Summary */}
              <SelectedPermissionsSummary
                permissions={safePermissions}
                onRemove={(permission) => togglePermission(permission, false)}
              />

              {errors.permissions && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.permissions}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
