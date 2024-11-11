import { useForm } from "@inertiajs/react";
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
    Globe,
    MapPin,
    Phone,
    Building2,
    Briefcase,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { useCallback } from "react";

export default function UpdateProfileInformationForm({ className = "" }) {
    const { user, loading, updateProfile } = useUser();

    const { data, setData, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        avatar: null,
        display_name: user.display_name || "",
        bio: user.bio || "",
        location: user.location || "",
        company: user.company || "",
        position: user.position || "",
        website: user.website || "",
    });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        await updateProfile(data);
    }, [data, updateProfile]);

    const handleAvatarChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setData("avatar", {
                uuid: URL.createObjectURL(file),
                file,
            });
        }
    }, [setData]);

    const removeAvatar = useCallback(() => {
        setData("avatar", null);
    }, [setData]);

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
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                        <div className="relative group">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={data.avatar?.uuid || user.avatar_url}
                                    alt={data.name}
                                />
                                <AvatarFallback className="bg-primary/10">
                                    {data.name?.charAt(0).toUpperCase()}
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
                    </div>

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

                        {/* Add other fields similarly */}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
