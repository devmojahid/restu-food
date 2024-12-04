import React from "react";
import { Card } from "@/Components/ui/card";
import InfoItem from "../InfoItem";
import { Heart, Phone, Mail, User, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";

const Details = ({ application }) => {
  const formatDate = (dateString) => {
    try {
      return dateString ? format(new Date(dateString), "PPP") : "N/A";
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Emergency Contact */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={User} 
            label="Contact Name" 
            value={application.emergency_contact_name}
          />
          <InfoItem 
            icon={Phone} 
            label="Contact Phone" 
            value={application.emergency_contact_phone}
          />
          <InfoItem 
            icon={Heart} 
            label="Relationship" 
            value={application.emergency_contact_relationship}
          />
        </div>
      </Card>

      {/* Additional Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={Calendar} 
            label="Date of Birth" 
            value={formatDate(application.date_of_birth)}
          />
          <InfoItem 
            icon={User} 
            label="Gender" 
            value={application.gender}
          />
          <InfoItem 
            icon={Shield} 
            label="Background Check" 
            value={application.background_check_consent ? "Consented" : "Not Consented"}
          />
        </div>
      </Card>

      {/* Notes */}
      {application.additional_notes && (
        <Card className="p-6 col-span-full">
          <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {application.additional_notes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default Details; 