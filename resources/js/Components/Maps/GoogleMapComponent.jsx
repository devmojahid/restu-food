import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const GoogleMapComponent = ({
    center,
    zoom,
    options,
    onLoad,
    userLocation,
    restaurants,
    selectedRestaurant,
    onRestaurantSelect
}) => {
    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={zoom}
            options={options}
            onLoad={onLoad}
        >
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={{
                        url: '/images/markers/user-location.png',
                        scaledSize: new window.google.maps.Size(40, 40)
                    }}
                />
            )}
            
            {restaurants?.map(restaurant => (
                <Marker
                    key={restaurant.id}
                    position={restaurant.coordinates}
                    title={restaurant.name}
                    onClick={() => onRestaurantSelect(restaurant)}
                    animation={selectedRestaurant?.id === restaurant.id ? 
                        window.google.maps.Animation.BOUNCE : null}
                />
            ))}
        </GoogleMap>
    );
};

export default GoogleMapComponent; 