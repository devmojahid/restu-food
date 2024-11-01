import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Clock,
  Check,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function ApiTokens() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [newToken, setNewToken] = useState(null);

  const { data, setData, post, delete: destroy, processing } = useForm({
    name: "",
    expiration: "never",
    permissions: [],
  });

  // Mock API tokens data
  const tokens = [
    {
      id: 1,
      name: "Development Token",
      token: "sk_test_1234567890abcdef",
      lastUsed: "2024-03-20T14:30:00",
      permissions: ["read", "write"],
      expiresAt: "2024-12-31T23:59:59",
    },
    {
      id: 2,
      name: "Production Token",
      token: "sk_live_1234567890abcdef",
      lastUsed: "2024-03-19T09:15:00",
      permissions: ["read"],
      expiresAt: null,
    },
  ];

  const availablePermissions = [
    { id: "read", label: "Read" },
    { id: "write", label: "Write" },
    { id: "delete", label: "Delete" },
  ];

  const expirationOptions = {
    never: "Never",
    "7days": "7 Days",
    "30days": "30 Days",
    "60days": "60 Days",
    "90days": "90 Days",
    custom: "Custom Date",
  };

  const handleCreateToken = (e) => {
    e.preventDefault();
    post(route("api-tokens.store"), {
      onSuccess: (response) => {
        setNewToken(response.token);
        setShowCreateDialog(false);
        reset();
      },
    });
  };

  const handleDeleteToken = (token) => {
    setSelectedToken(token);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    destroy(route("api-tokens.destroy", selectedToken.id), {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setSelectedToken(null);
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const reset = () => {
    setData({
      name: "",
      expiration: "never",
      permissions: [],
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>API Tokens</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage API tokens for external access to your account
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Token
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Token List */}
          <div className="space-y-4">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{token.name}</h3>
                    {token.expiresAt && (
                      <Badge variant="secondary" className="font-normal">
                        Expires{" "}
                        {format(new Date(token.expiresAt), "MMM d, yyyy")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showToken ? "text" : "password"}
                        value={token.token}
                        readOnly
                        className="pr-20 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(token.token)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {token.permissions.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="font-normal"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Last used:{" "}
                    {token.lastUsed
                      ? format(new Date(token.lastUsed), "PPp")
                      : "Never"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDeleteToken(token)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {tokens.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No API tokens found</p>
            </div>
          )}
        </div>

        {/* Create Token Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Token</DialogTitle>
              <DialogDescription>
                Create a new API token to access your account programmatically
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateToken} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Token Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="My API Token"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration">Token Expiration</Label>
                  <Select
                    value={data.expiration}
                    onValueChange={(value) => setData("expiration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(expirationOptions).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid gap-2">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={data.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setData("permissions", [
                                ...data.permissions,
                                permission.id,
                              ]);
                            } else {
                              setData(
                                "permissions",
                                data.permissions.filter(
                                  (p) => p !== permission.id
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Create Token"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Token Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Revoke API Token
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke this API token? Any applications
                or scripts using this token will no longer be able to access the
                API.
                {selectedToken && (
                  <div className="mt-2 p-2 rounded-md bg-muted">
                    <p className="font-medium">{selectedToken.name}</p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={processing}
              >
                {processing ? "Revoking..." : "Revoke Token"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Token Alert */}
        {newToken && (
          <Alert className="mt-4">
            <Check className="h-4 w-4" />
            <AlertDescription>
              <p>Your new API token has been created:</p>
              <div className="mt-2">
                <div className="relative">
                  <Input
                    type="text"
                    value={newToken}
                    readOnly
                    className="pr-20 font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => copyToClipboard(newToken)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please copy your new API token now. You won't be able to see
                  it again!
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
