import React from "react";
import { Card } from "@/Components/ui/card";
import InfoItem from "../InfoItem";
import { Shield, Award, Calendar, CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/Components/ui/badge";

const Certifications = ({ application }) => {
  const formatDate = (dateString) => {
    try {
      return dateString ? format(parseISO(dateString), "PPP") : "N/A";
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Food Safety Certification */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Food Safety Certification</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={Shield} 
            label="Status" 
            value={
              <Badge variant={application.has_food_safety_certification ? "success" : "secondary"}>
                {application.has_food_safety_certification ? "Certified" : "Not Certified"}
              </Badge>
            }
          />
          {application.has_food_safety_certification && (
            <InfoItem 
              icon={Calendar} 
              label="Expiry Date" 
              value={formatDate(application.food_safety_certification_expiry)}
            />
          )}
        </div>
      </Card>

      {/* Health Certification */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Health Certification</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={Shield} 
            label="Status" 
            value={
              <Badge variant={application.has_health_certification ? "success" : "secondary"}>
                {application.has_health_certification ? "Certified" : "Not Certified"}
              </Badge>
            }
          />
          {application.has_health_certification && (
            <InfoItem 
              icon={Calendar} 
              label="Expiry Date" 
              value={formatDate(application.health_certification_expiry)}
            />
          )}
        </div>
      </Card>

      {/* Verification Status */}
      <Card className="p-6 col-span-full">
        <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'identity', label: 'Identity' },
            { key: 'qualifications', label: 'Qualifications' },
            { key: 'references', label: 'References' },
            { key: 'documents', label: 'Documents' }
          ].map((item) => (
            <div 
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <span className="text-sm font-medium">{item.label}</span>
              <Badge variant={application?.verificationStatus?.[item.key] ? "success" : "secondary"}>
                {application?.verificationStatus?.[item.key] ? "Verified" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Certifications; 