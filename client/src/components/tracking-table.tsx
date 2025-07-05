import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, Plus, MoreVertical, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Tracker } from "@shared/schema";

interface TrackingTableProps {
  trackers: Tracker[];
}

export function TrackingTable({ trackers }: TrackingTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "safe":
        return "default";
      case "alert":
        return "secondary";
      case "emergency":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-100 text-green-800";
      case "alert":
        return "bg-yellow-100 text-yellow-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return "bg-green-500";
    if (level > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Tracking Activity
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-gray-100 hover:bg-gray-200">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" className="bg-primary hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Tracker
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracker ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trackers.map((tracker) => (
                <tr key={tracker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-300">
                          <User className="h-4 w-4 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{tracker.name}</div>
                        <div className="text-sm text-gray-500">{tracker.group}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tracker.trackerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      className={`text-xs font-medium ${getStatusColor(tracker.status)}`}
                    >
                      {tracker.status.charAt(0).toUpperCase() + tracker.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tracker.lastLocation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getBatteryColor(tracker.batteryLevel)}`}
                          style={{ width: `${tracker.batteryLevel}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{tracker.batteryLevel}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(tracker.lastUpdate), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-700 ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
