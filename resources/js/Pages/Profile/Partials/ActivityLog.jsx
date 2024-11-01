import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  History,
  Search,
  Calendar,
  User,
  LogIn,
  LogOut,
  Settings,
  Shield,
  Mail,
  Download,
  Filter,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { format } from "date-fns";

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "login",
      description: "Logged in from Chrome on Windows",
      location: "London, UK",
      ip: "192.168.1.1",
      timestamp: "2024-03-20T14:30:00",
      icon: LogIn,
      status: "success",
    },
    {
      id: 2,
      type: "security",
      description: "Changed account password",
      location: "London, UK",
      ip: "192.168.1.1",
      timestamp: "2024-03-20T13:15:00",
      icon: Shield,
      status: "success",
    },
    {
      id: 3,
      type: "profile",
      description: "Updated profile information",
      location: "London, UK",
      ip: "192.168.1.1",
      timestamp: "2024-03-19T16:45:00",
      icon: User,
      status: "success",
    },
    {
      id: 4,
      type: "email",
      description: "Changed email preferences",
      location: "London, UK",
      ip: "192.168.1.1",
      timestamp: "2024-03-19T11:20:00",
      icon: Mail,
      status: "success",
    },
    {
      id: 5,
      type: "login",
      description: "Failed login attempt",
      location: "Paris, France",
      ip: "192.168.1.2",
      timestamp: "2024-03-18T09:10:00",
      icon: LogIn,
      status: "failed",
    },
  ];

  const activityTypes = {
    all: "All Activities",
    login: "Login Activity",
    security: "Security Changes",
    profile: "Profile Updates",
    email: "Email Changes",
  };

  const dateRanges = {
    all: "All Time",
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };

  const getStatusBadge = (status) => {
    if (status === "success") {
      return (
        <Badge variant="success" className="font-normal">
          Success
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-normal">
        Failed
      </Badge>
    );
  };

  const filteredActivities = activities
    .filter((activity) => {
      const matchesSearch =
        activity.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.ip.includes(searchQuery);
      const matchesType =
        activityType === "all" || activity.type === activityType;
      // Add date range filtering logic here
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Activity Log</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor your account activity and security events
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(activityTypes).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[160px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(dateRanges).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="rounded-full p-2 bg-primary/10">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{activity.description}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <time className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(
                        new Date(activity.timestamp),
                        "MMM d, yyyy HH:mm"
                      )}
                    </time>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <p>
                      {activity.location} • IP: {activity.ip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No activities found</p>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Activity Log
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
