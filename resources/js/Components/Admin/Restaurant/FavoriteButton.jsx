import React from 'react';
import { Button } from '@/Components/ui/button';
import { Heart } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const FavoriteButton = ({ restaurant, isFavorited = false }) => {
    const { post, processing } = useForm();

    const handleToggle = () => {
        post(`/favorites/${restaurant.id}/toggle`, {
            preserveScroll: true,
            onSuccess: ({ props }) => {
                toast.success(props.flash.message);
            },
        });
    };

    return (
        <Button
            variant={isFavorited ? "default" : "outline"}
            size="sm"
            onClick={handleToggle}
            disabled={processing}
            className={`gap-2 ${isFavorited ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </Button>
    );
};

export default FavoriteButton; 