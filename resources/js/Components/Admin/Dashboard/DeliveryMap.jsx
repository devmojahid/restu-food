import React, { useEffect, useRef } from 'react';
import { Card } from '@/Components/ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DeliveryMap = ({ deliveries, center = [51.505, -0.09], zoom = 13 }) => {
  const mapRef = useRef(null);

  // Custom marker icons
  const deliveryIcon = new L.Icon({
    iconUrl: '/images/delivery-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const restaurantIcon = new L.Icon({
    iconUrl: '/images/restaurant-marker.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Live Deliveries</h3>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          ref={mapRef}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {deliveries?.map((delivery) => (
            <Marker
              key={delivery.id}
              position={[delivery.latitude, delivery.longitude]}
              icon={deliveryIcon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold">Order #{delivery.order_id}</h4>
                  <p className="text-sm">Status: {delivery.status}</p>
                  <p className="text-sm">Driver: {delivery.driver_name}</p>
                  <p className="text-sm">ETA: {delivery.eta}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default DeliveryMap; 