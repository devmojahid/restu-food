import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Lock, Eye, EyeOff, Key, Shield, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";

export default function UpdatePasswordForm({ className = "" }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful,
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const updatePassword = (e) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInput.current.focus();
        }
        if (errors.current_password) {
          reset("current_password");
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;

    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;

    // Character type checks
    if (/[A-Z]/.test(password)) score += 20; // Uppercase
    if (/[a-z]/.test(password)) score += 20; // Lowercase
    if (/[0-9]/.test(password)) score += 20; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) score += 10; // Special characters

    setPasswordStrength(score);
    return score;
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 90)
      return { text: "Very Strong", color: "bg-green-500" };
    if (passwordStrength >= 70)
      return { text: "Strong", color: "bg-emerald-500" };
    if (passwordStrength >= 50)
      return { text: "Medium", color: "bg-yellow-500" };
    if (passwordStrength >= 30) return { text: "Weak", color: "bg-orange-500" };
    return { text: "Very Weak", color: "bg-red-500" };
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Update Password</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ensure your account is using a secure password to stay protected
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={updatePassword} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="current_password"
                  ref={currentPasswordInput}
                  value={data.current_password}
                  onChange={(e) => setData("current_password", e.target.value)}
                  type={showCurrentPassword ? "text" : "password"}
                  className="pl-9 pr-10"
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.current_password && (
                <p className="text-sm text-destructive">
                  {errors.current_password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  ref={passwordInput}
                  value={data.password}
                  onChange={(e) => {
                    setData("password", e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  type={showNewPassword ? "text" : "password"}
                  className="pl-9 pr-10"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {data.password && (
                <div className="space-y-2">
                  <Progress
                    value={passwordStrength}
                    className={cn("h-1", getPasswordStrengthText().color)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Password Strength:
                    </span>
                    <Badge
                      variant={passwordStrength >= 70 ? "success" : "warning"}
                    >
                      {getPasswordStrengthText().text}
                    </Badge>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-9 pr-10"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-destructive">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <Alert className="bg-muted/50">
            <AlertDescription>
              <div className="text-sm text-muted-foreground">
                Password must meet the following requirements:
                <ul className="mt-2 space-y-1 list-inside list-disc">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one lowercase letter</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one special character</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? (
                "Updating..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>

            {recentlySuccessful && (
              <p className="text-sm text-muted-foreground">
                Password updated successfully.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
