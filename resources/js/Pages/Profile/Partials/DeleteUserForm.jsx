import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Shield,
  AlertOctagon,
  X,
  Check,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function DeleteUserForm({ className = "" }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const passwordInput = useRef();

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: "",
    confirmation: "",
  });

  const initiateDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (data.confirmation !== "DELETE") {
      return;
    }
    setShowFinalWarning(true);
  };

  const confirmDeletion = () => {
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setShowDeleteDialog(false);
    setShowFinalWarning(false);
    setConfirmDelete(false);
    clearErrors();
    reset();
  };

  return (
    <Card className="border-destructive/50 shadow-none">
      <CardHeader className="px-6 py-4 border-b border-destructive/20">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle>Delete Account</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently delete your account and all associated data
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: This action is irreversible. Once your account is deleted,
            all of its resources and data will be permanently deleted. Please
            download any data or information that you wish to retain before
            proceeding.
          </AlertDescription>
        </Alert>

        <Button
          variant="destructive"
          onClick={initiateDelete}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete Account Confirmation
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  This action will permanently delete your account and remove
                  all associated data from our servers. This action cannot be
                  undone.
                </p>

                <form onSubmit={handleDelete} className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Please enter your password to confirm:
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          ref={passwordInput}
                          value={data.password}
                          onChange={(e) => setData("password", e.target.value)}
                          className="pl-9 pr-10"
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmation">
                        Type "DELETE" to confirm:
                      </Label>
                      <Input
                        id="confirmation"
                        value={data.confirmation}
                        onChange={(e) =>
                          setData("confirmation", e.target.value)
                        }
                        className="font-mono"
                        placeholder="DELETE"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={confirmDelete}
                        onCheckedChange={setConfirmDelete}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I understand that this action cannot be undone
                      </label>
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={closeModal}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      type="submit"
                      disabled={
                        !confirmDelete ||
                        data.confirmation !== "DELETE" ||
                        processing
                      }
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

        {/* Final Warning Dialog */}
        <AlertDialog open={showFinalWarning} onOpenChange={setShowFinalWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Final Warning
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to delete your account? This
                action cannot be undone and all your data will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowFinalWarning(false)}>
                No, keep my account
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeletion}
                className="bg-destructive hover:bg-destructive/90"
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
