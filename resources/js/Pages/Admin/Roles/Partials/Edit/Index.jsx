import React, { useState, useCallback, useEffect } from "react";
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
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { useToast } from "@/Components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

// Import shared components
import {
  ErrorAlert,
  GroupSelector,
  TabScrollContainer,
  CustomTabsList,
  CustomTabsTrigger,
  TabContainer,
  TabContentWrapper,
  PermissionGroup,
} from "../Shared/Components";

export default function EditRole({ role, permissions, stats }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const { toast } = useToast();

  // Initialize form with role data
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    permissions: role.permissions || [],
    guard_name: role.guard_name || "web",
    description: role.description || "",
  });

  // Initialize selected groups based on role permissions
  useEffect(() => {
    const groups = {};
    permissions.forEach((permission) => {
      const group = permission.group_name || "other";
      if (!groups[group]) groups[group] = [];
      groups[group].push(permission.name);
    });

    const selectedGroupsList = Object.entries(groups).reduce(
      (acc, [group, perms]) => {
        const allSelected = perms.every((p) => role.permissions.includes(p));
        if (allSelected) acc.push(group);
        return acc;
      },
      []
    );

    setSelectedGroups(selectedGroupsList);
  }, [role.permissions, permissions]);

  // Group permissions by category
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

  // Filter permissions based on search
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

  // Permission toggle handler
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

  // Select all handler
  const handleSelectAll = useCallback(
    (groupName) => {
      const groupPermissions =
        groupedPermissions[groupName]?.map((p) => p.name) || [];

      setData((prevData) => ({
        ...prevData,
        permissions: [
          ...new Set([...prevData.permissions, ...groupPermissions]),
        ],
      }));

      setSelectedGroups((prev) => [...new Set([...prev, groupName])]);
    },
    [groupedPermissions, setData]
  );

  // Deselect all handler
  const handleDeselectAll = useCallback(
    (groupName) => {
      const groupPermissions =
        groupedPermissions[groupName]?.map((p) => p.name) || [];

      setData((prevData) => ({
        ...prevData,
        permissions: prevData.permissions.filter(
          (p) => !groupPermissions.includes(p)
        ),
      }));

      setSelectedGroups((prev) => prev.filter((g) => g !== groupName));
    },
    [groupedPermissions, setData]
  );

  // Group selection handler
  const handleGroupSelection = useCallback(
    (groupName) => {
      const isSelected = selectedGroups.includes(groupName);
      if (isSelected) {
        handleDeselectAll(groupName);
      } else {
        handleSelectAll(groupName);
      }
    },
    [selectedGroups, handleSelectAll, handleDeselectAll]
  );

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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        toast.error(value);
      });
      return;
    }

    setIsSubmitting(true);

    put(route("app.roles.update", role.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: (error) => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-[1400px] mx-auto px-4"
    >
      <ErrorAlert errors={errors} />

      {/* Form Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Role: {role.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Update role permissions and settings
          </p>
          {role.name === "Admin" && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Admin Role</AlertTitle>
              <AlertDescription>
                This is a system role with special privileges. Some settings may
                be restricted.
              </AlertDescription>
            </Alert>
          )}
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
            disabled={processing || isSubmitting || role.name === "Admin"}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {processing || isSubmitting ? "Saving..." : "Update Role"}
          </Button>
        </div>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{role.users_count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{role.permissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {new Date(role.updated_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Details and Permissions */}
      <div className="grid grid-cols-1 gap-8">
        {/* Role Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>
              Update the basic information for this role
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
                disabled={processing || isSubmitting || role.name === "Admin"}
                className={cn(
                  errors.name && "border-red-500 focus:ring-red-500"
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guard_name">Guard Name</Label>
              <Select
                value={data.guard_name}
                onValueChange={(value) => setData("guard_name", value)}
                disabled={processing || isSubmitting || role.name === "Admin"}
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

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Manage the permissions assigned to this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Group Selector */}
            <GroupSelector
              groups={groupedPermissions}
              selectedGroups={selectedGroups}
              onChange={handleGroupSelection}
              disabled={processing || isSubmitting || role.name === "Admin"}
            />

            {/* Search and Permissions List */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                          ([group, perms]) => (
                            <PermissionGroup
                              key={group}
                              groupName={group}
                              permissions={perms}
                              selectedPermissions={data.permissions}
                              onToggle={togglePermission}
                              onSelectAll={handleSelectAll}
                              onDeselectAll={handleDeselectAll}
                              disabled={
                                processing ||
                                isSubmitting ||
                                role.name === "Admin"
                              }
                            />
                          )
                        )}
                      </TabsContent>

                      {Object.entries(groupedPermissions).map(
                        ([group, perms]) => (
                          <TabsContent
                            key={group}
                            value={group}
                            className={cn(
                              "space-y-4 mt-4 pt-2 focus-visible:outline-none",
                              "animate-in fade-in-50 duration-200 slide-in-from-left-1"
                            )}
                          >
                            <PermissionGroup
                              groupName={group}
                              permissions={perms}
                              selectedPermissions={data.permissions}
                              onToggle={togglePermission}
                              onSelectAll={handleSelectAll}
                              onDeselectAll={handleDeselectAll}
                              disabled={
                                processing ||
                                isSubmitting ||
                                role.name === "Admin"
                              }
                            />
                          </TabsContent>
                        )
                      )}
                    </ScrollArea>
                  </TabContentWrapper>
                </Tabs>
              </TabContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
