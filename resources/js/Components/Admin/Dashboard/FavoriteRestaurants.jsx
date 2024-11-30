import React from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Link } from '@inertiajs/react';

const FavoriteRestaurants = ({ restaurants }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Favorite Restaurants</h2>
        <Link href="/restaurants">
          <Button variant="outline">View All</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {restaurants?.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No favorite restaurants yet</p>
            <Link href="/restaurants">
              <Button variant="link" className="mt-2">
                Explore Restaurants
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

const RestaurantCard = ({ restaurant }) => {
  const avgRating = restaurant.ratings?.reduce((acc, curr) => acc + curr.rating, 0) / 
                    (restaurant.ratings?.length || 1);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={restaurant.image_url || '/images/placeholder-restaurant.jpg'} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {restaurant.distance}km
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {restaurant.delivery_time}min
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {restaurant.cuisine?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteRestaurants; 