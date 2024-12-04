import React from "react";
import { Card } from "@/Components/ui/card";
import DocumentPreview from "../DocumentPreview";
import { FileText, FileImage, FileCheck } from "lucide-react";

const Documents = ({ application }) => {
  const documentSections = [
    {
      title: "Resume/CV",
      icon: FileText,
      files: application.files?.resume ? [application.files.resume] : [],
      description: "Applicant's curriculum vitae and work history"
    },
    {
      title: "ID Proof",
      icon: FileCheck,
      files: application.files?.id_proof ? [application.files.id_proof] : [],
      description: "Government-issued identification documents"
    },
    {
      title: "Certificates",
      icon: FileCheck,
      files: application.files?.certificates || [],
      description: "Professional certifications and qualifications"
    },
    {
      title: "Profile Photo",
      icon: FileImage,
      files: application.files?.photo ? [application.files.photo] : [],
      description: "Recent photograph of the applicant"
    }
  ];

  return (
    <div className="space-y-6">
      {documentSections.map((section, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {section.description}
          </p>
          {section.files.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.files.map((file, fileIndex) => (
                <DocumentPreview key={fileIndex} file={file} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-muted rounded-lg">
              <section.icon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No documents uploaded</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Documents; 