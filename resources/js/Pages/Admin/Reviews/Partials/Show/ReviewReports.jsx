import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";

const ReviewReports = ({ reports }) => {
  if (!reports?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          Reports ({reports.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-lg border border-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={report.user?.avatar} />
                  <AvatarFallback>
                    {report.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{report.user?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(report.created_at), "PPP")}
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  report.status === "resolved"
                    ? "success"
                    : report.status === "investigating"
                    ? "warning"
                    : "default"
                }
              >
                {report.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Reason:</div>
              <div className="text-sm">{report.reason}</div>
              {report.details && (
                <>
                  <div className="text-sm font-medium">Details:</div>
                  <div className="text-sm">{report.details}</div>
                </>
              )}
            </div>

            {report.resolved_at && (
              <div className="text-sm text-muted-foreground">
                Resolved by {report.resolved_by?.name} on{" "}
                {format(new Date(report.resolved_at), "PPP")}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ReviewReports; 