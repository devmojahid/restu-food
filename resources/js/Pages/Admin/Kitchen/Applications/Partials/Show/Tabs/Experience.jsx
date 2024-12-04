import React from "react";
import { Card } from "@/Components/ui/card";
import InfoItem from "../InfoItem";
import { Briefcase, GraduationCap, Award, Star } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

const Experience = ({ application }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Professional Experience */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Professional Experience</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={Briefcase} 
            label="Years of Experience" 
            value={`${application.years_of_experience} years`}
          />
          <InfoItem 
            icon={Star} 
            label="Position Applied" 
            value={application.position_applied}
          />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {application.specializations?.map((spec, index) => (
                <Badge key={index} variant="secondary">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Education & Qualifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Education & Qualifications</h3>
        <div className="space-y-4">
          <InfoItem 
            icon={GraduationCap} 
            label="Highest Education" 
            value={application.highest_education}
          />
          <InfoItem 
            icon={Award} 
            label="Culinary Certificates" 
            value={
              <div className="flex flex-wrap gap-2 mt-2">
                {application.culinary_certificates?.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            }
          />
        </div>
      </Card>

      {/* Previous Experience Details */}
      <Card className="p-6 col-span-full">
        <h3 className="text-lg font-semibold mb-4">Previous Experience Details</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {application.previous_experience || "No previous experience details provided"}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Experience; 