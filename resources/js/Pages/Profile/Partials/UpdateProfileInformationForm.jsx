import { useForm, usePage, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  User,
  Mail,
  Check,
  Upload,
  Camera,
  Trash2,
  Github,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Phone,
  Building2,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { Switch } from "@/Components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
}) {
  const user = usePage().props.auth.user;

  const {
    data,
    setData,
    patch,
    errors,
    processing,
    recentlySuccessful,
  } = useForm({
    name: user.name,
    email: user.email,
    avatar: null,
    bio: user.bio || "",
    location: user.location || "",
    phone: user.phone || "",
    company: user.company || "",
    position: user.position || "",
    website: user.website || "",
    github: user.github || "",
    twitter: user.twitter || "",
    linkedin: user.linkedin || "",
    public_profile: user.public_profile || false,
    notification_preferences: {
      email_updates: true,
      marketing_emails: false,
      security_alerts: true,
    },
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData("avatar", file);
    }
  };

  const removeAvatar = () => {
    setData("avatar", null);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Profile Information</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update your account's profile information and settings
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={submit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    data.avatar
                      ? URL.createObjectURL(data.avatar)
                      : user.avatar_url
                  }
                />
                <AvatarFallback className="bg-primary/10">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer p-2 hover:bg-white/20 rounded-full"
                >
                  <Camera className="h-5 w-5 text-white" />
                </label>
                {data.avatar && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="p-2 hover:bg-white/20 rounded-full"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-medium">Profile Visibility</h3>
              <p className="text-sm text-muted-foreground">
                Control how your profile appears to other users
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.public_profile}
                  onCheckedChange={(checked) =>
                    setData("public_profile", checked)
                  }
                />
                <Label>Make my profile public</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  type="text"
                  className="pl-9"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  type="email"
                  className="pl-9"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  type="tel"
                  className="pl-9"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => setData("location", e.target.value)}
                  className="pl-9"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    value={data.company}
                    onChange={(e) => setData("company", e.target.value)}
                    className="pl-9"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="position"
                    value={data.position}
                    onChange={(e) => setData("position", e.target.value)}
                    className="pl-9"
                    placeholder="Your role"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={data.bio}
                onChange={(e) => setData("bio", e.target.value)}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={data.website}
                    onChange={(e) => setData("website", e.target.value)}
                    className="pl-9"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="github"
                    value={data.github}
                    onChange={(e) => setData("github", e.target.value)}
                    className="pl-9"
                    placeholder="GitHub username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter"
                    value={data.twitter}
                    onChange={(e) => setData("twitter", e.target.value)}
                    className="pl-9"
                    placeholder="Twitter username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={data.linkedin}
                    onChange={(e) => setData("linkedin", e.target.value)}
                    className="pl-9"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Verification Status */}
          {mustVerifyEmail && user.email_verified_at === null && (
            <Alert variant="warning">
              <AlertDescription>
                Your email address is unverified.{" "}
                <Link
                  href={route("verification.send")}
                  method="post"
                  as="button"
                  className="text-primary underline hover:text-primary/80"
                >
                  Click here to re-send the verification email.
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {status === "verification-link-sent" && (
            <Alert>
              <AlertDescription>
                A new verification link has been sent to your email address.
              </AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>
              {processing ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            {recentlySuccessful && (
              <p className="text-sm text-muted-foreground">
                Saved successfully.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
