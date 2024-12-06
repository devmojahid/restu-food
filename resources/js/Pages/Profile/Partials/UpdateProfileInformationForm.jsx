import { useForm, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import FileUploader from "@/Components/Admin/Filesystem/FileUploader";
import toast from "react-hot-toast";
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
    PlusCircle,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

export default function UpdateProfileInformationForm({ className = "", user_meta }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isUploading, setIsUploading] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || null,
        metaData: {
            display_name: user_meta?.display_name || '',
            bio: user_meta?.bio || '',
            location: user_meta?.location || '',
            company: user_meta?.company || '',
            position: user_meta?.position || '',
            website: user_meta?.website || '',
            social_links: user_meta?.social_links || [],
            address: user_meta?.address || '',
            city: user_meta?.city || '',
            state: user_meta?.state || '',
            postal_code: user_meta?.postal_code || '',
            country: user_meta?.country || '',
        },
    });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        patch(route('app.profile.update'), {
            data: {
                ...data
            },
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
            }
        });
    }, [patch, data]);

    const handleFieldChange = useCallback((field, value) => {
        setData(field, value);
    }, [setData]);

    const handleMetaDataChange = useCallback((field, value) => {
        setData('metaData', {
            ...data.metaData,
            [field]: value
        });
    }, [data.metaData, setData]);

    const handleAddSocialLink = useCallback(() => {
        const currentLinks = data.metaData.social_links || [];
        handleMetaDataChange('social_links', [
            ...currentLinks,
            { platform: '', url: '' }
        ]);
    }, [data.metaData.social_links, handleMetaDataChange]);

    const handleRemoveSocialLink = useCallback((index) => {
        const currentLinks = data.metaData.social_links || [];
        handleMetaDataChange(
            'social_links',
            currentLinks.filter((_, i) => i !== index)
        );
    }, [data.metaData.social_links, handleMetaDataChange]);

    const handleSocialLinkChange = useCallback((index, field, value) => {
        const currentLinks = [...(data.metaData.social_links || [])];
        currentLinks[index] = {
            ...currentLinks[index],
            [field]: value
        };
        handleMetaDataChange('social_links', currentLinks);
    }, [data.metaData.social_links, handleMetaDataChange]);

    return (
        <Card className={cn("border-0 shadow-none", className)}>
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
                    {/* Avatar Upload */}
                    <div className="bg-background pt-2 pb-4">
                        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                            <FileUploader
                                value={data.avatar}
                                maxFiles={1}
                                fileType="image"
                                collection="avatar"
                                onUpload={(file) => setData('avatar', file)}
                                description="Upload your avatar image"
                                error={errors.avatar}
                            />
                        </div>
                    </div>

                    <div className="space-y-8 pt-4">
                        {/* Basic Information */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => handleFieldChange('name', e.target.value)}
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
                                        type="email"
                                        value={data.email}
                                        onChange={e => handleFieldChange('email', e.target.value)}
                                        className="pl-9"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="display_name">Display Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="display_name"
                                        value={data.metaData.display_name}
                                        onChange={e => handleMetaDataChange('display_name', e.target.value)}
                                        className="pl-9"
                                        placeholder="How should we display your name?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={data.metaData.phone}
                                        onChange={e => handleMetaDataChange('phone', e.target.value)}
                                        className="pl-9"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={data.metaData.bio}
                                onChange={e => handleMetaDataChange('bio', e.target.value)}
                                placeholder="Tell us about yourself"
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Professional Information */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="company"
                                        value={data.metaData.company}
                                        onChange={e => handleMetaDataChange('company', e.target.value)}
                                        className="pl-9"
                                        placeholder="Where do you work?"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="position"
                                        value={data.metaData.position}
                                        onChange={e => handleMetaDataChange('position', e.target.value)}
                                        className="pl-9"
                                        placeholder="What's your role?"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                            <Label>Location</Label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            value={data.metaData.address}
                                            onChange={e => handleMetaDataChange('address', e.target.value)}
                                            className="pl-9"
                                            placeholder="Street address"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.metaData.city}
                                        onChange={e => handleMetaDataChange('city', e.target.value)}
                                        placeholder="City"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={data.metaData.state}
                                        onChange={e => handleMetaDataChange('state', e.target.value)}
                                        placeholder="State or province"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.metaData.postal_code}
                                        onChange={e => handleMetaDataChange('postal_code', e.target.value)}
                                        placeholder="Postal code"
                                    />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.metaData.country}
                                        onChange={e => handleMetaDataChange('country', e.target.value)}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Social Links</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddSocialLink}
                                    className="flex items-center gap-2"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Social Link
                                </Button>
                            </div>
                            
                            <div className="grid gap-4">
                                {data.metaData.social_links.map((link, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex gap-4 items-start p-4 rounded-lg border bg-background/50 hover:bg-background transition-colors"
                                    >
                                        <div className="grid gap-4 flex-1 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor={`platform-${index}`}>Platform</Label>
                                                <Input
                                                    id={`platform-${index}`}
                                                    value={link.platform}
                                                    onChange={e => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                    placeholder="e.g. Twitter, LinkedIn, etc."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`url-${index}`}>URL</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`url-${index}`}
                                                        value={link.url}
                                                        onChange={e => handleSocialLinkChange(index, 'url', e.target.value)}
                                                        className="pl-9"
                                                        placeholder="Enter profile URL"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveSocialLink(index)}
                                            className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                
                                {data.metaData.social_links.length === 0 && (
                                    <div className="text-center py-8 border rounded-lg bg-muted/50">
                                        <Globe className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            No social links added yet. Click the button above to add one.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center gap-4 mt-8">
                        <Button 
                            type="submit" 
                            disabled={processing || isUploading}
                        >
                            {processing ? (
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
