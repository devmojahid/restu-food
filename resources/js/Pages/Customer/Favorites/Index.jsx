import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { 
    Star, 
    MapPin, 
    Clock, 
    Heart,
    Phone,
    Globe,
    Mail
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';

const FavoritesIndex = ({ favorites }) => {
    return (
        <AdminLayout>
            <Head title="My Favorite Restaurants" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My Favorite Restaurants</h1>
                    <Link href="/restaurants">
                        <Button>Explore Restaurants</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.data.map((favorite) => (
                        <RestaurantCard 
                            key={favorite.id} 
                            restaurant={favorite} 
                            addedAt={favorite.pivot.created_at}
                        />
                    ))}
                </div>

                {favorites.data.length === 0 && (
                    <Card className="p-12 text-center">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
                        <p className="text-gray-500 mb-4">
                            Start exploring restaurants and add them to your favorites!
                        </p>
                        <Link href="/restaurants">
                            <Button>Browse Restaurants</Button>
                        </Link>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
};

const RestaurantCard = ({ restaurant, addedAt }) => {
    const avgRating = restaurant.ratings?.reduce((acc, curr) => acc + curr.rating, 0) / 
                    (restaurant.ratings?.length || 1);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <img 
                    src={restaurant.image_url || '/images/placeholder-restaurant.jpg'} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                    <FavoriteButton restaurant={restaurant} isFavorited={true} />
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{avgRating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{restaurant.distance}km</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{restaurant.delivery_time}min</span>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500">
                    {restaurant.phone && (
                        <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {restaurant.phone}
                        </div>
                    )}
                    {restaurant.email && (
                        <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {restaurant.email}
                        </div>
                    )}
                    {restaurant.website && (
                        <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-500 hover:underline">
                                Visit Website
                            </a>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            Added {format(new Date(addedAt), 'MMM dd, yyyy')}
                        </span>
                        <Link href={`/restaurants/${restaurant.id}`}>
                            <Button variant="outline" size="sm">
                                View Menu
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default FavoritesIndex; 