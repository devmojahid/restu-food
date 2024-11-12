import { useForm } from '@inertiajs/react';
import { toast } from '@/Components/ui/use-toast';
import { useState, useCallback } from 'react';

export const useProfile = (user) => {
    const [isUploading, setIsUploading] = useState(false);
    
    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        avatar: null,
        display_name: user?.display_name || '',
        bio: user?.bio || '',
        location: user?.location || '',
        company: user?.company || '',
        position: user?.position || '',
        website: user?.website || '',
        social_links: user?.social_links || {},
        preferences: user?.preferences || {},
        custom_fields: user?.custom_fields || {},
    });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        form.post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Profile updated successfully",
                    variant: "success",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to update profile",
                    variant: "destructive",
                });
            }
        });
    }, [form]);

    const handleAvatarChange = useCallback((file) => {
        setIsUploading(true);
        form.setData('avatar', file);
        setIsUploading(false);
    }, [form]);

    const handleFieldChange = useCallback((field, value) => {
        form.setData(field, value);
    }, [form]);

    return {
        form,
        isUploading,
        handleSubmit,
        handleAvatarChange,
        handleFieldChange,
    };
}; 