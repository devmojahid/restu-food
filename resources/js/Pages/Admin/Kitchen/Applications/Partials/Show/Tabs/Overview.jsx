import React from "react";
import { Card } from "@/Components/ui/card";
import InfoItem from "../InfoItem";
import { User, MapPin, Phone, Mail, Building2, ChefHat } from "lucide-react";

const Overview = ({ application }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={User} 
            label="Full Name" 
            value={application.full_name}
          />
          <InfoItem 
            icon={Mail} 
            label="Email" 
            value={application.email}
          />
          <InfoItem 
            icon={Phone} 
            label="Phone" 
            value={application.phone}
          />
          <InfoItem 
            icon={Building2} 
            label="Restaurant" 
            value={application.restaurant?.name}
          />
          <InfoItem 
            icon={ChefHat} 
            label="Position Applied" 
            value={application.position_applied}
          />
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Address Information</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={MapPin} 
            label="Address" 
            value={application.address}
          />
          <InfoItem 
            icon={MapPin} 
            label="City" 
            value={application.city}
          />
          <InfoItem 
            icon={MapPin} 
            label="State" 
            value={application.state}
          />
          <InfoItem 
            icon={MapPin} 
            label="Postal Code" 
            value={application.postal_code}
          />
          <InfoItem 
            icon={MapPin} 
            label="Country" 
            value={application.country}
          />
        </div>
      </Card>
    </div>
  );
};

export default Overview; 