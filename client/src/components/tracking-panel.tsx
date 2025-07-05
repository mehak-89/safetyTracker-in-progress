import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Shield, UserCheck, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Tracker, EmergencyContact } from "@shared/schema";

interface TrackingPanelProps {
  trackers: Tracker[];
}

export function TrackingPanel({ trackers }: TrackingPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const { data: emergencyContacts = [] } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const alertTrackers = trackers.filter(t => t.status === "alert");
  const uniqueGroups = [...new Set(trackers.map(t => t.group))];

  const filteredTrackers = trackers.filter(tracker => {
    const matchesSearch = tracker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracker.trackerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tracker.status === statusFilter;
    const matchesGroup = groupFilter === "all" || tracker.group === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const getContactIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <Phone className="h-4 w-4 text-red-600" />;
      case "security":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "medical":
        return <UserCheck className="h-4 w-4 text-green-600" />;
      default:
        return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  const getContactBgColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-50";
      case "security":
        return "bg-blue-50";
      case "medical":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  const getContactButtonColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-600 hover:bg-red-700";
      case "security":
        return "bg-blue-600 hover:bg-blue-700";
      case "medical":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or tracker ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {uniqueGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Active Alerts
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              {alertTrackers.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertTrackers.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p>No active alerts</p>
              </div>
            ) : (
              alertTrackers.map((tracker) => (
                <div
                  key={tracker.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tracker.name}</p>
                        <p className="text-xs text-gray-500">ID: {tracker.trackerId}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Last seen: {tracker.lastLocation} - {Math.floor(Math.random() * 15) + 1} minutes ago
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-3 rounded-lg ${getContactBgColor(contact.type)}`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    {getContactIcon(contact.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className={`text-white ${getContactButtonColor(contact.type)}`}
                >
                  Call
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
