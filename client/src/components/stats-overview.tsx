import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, AlertTriangle, AlertCircle } from "lucide-react";

interface StatsOverviewProps {
  stats?: {
    activeTrackers: number;
    safeLocations: number;
    alerts: number;
    emergencies: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const defaultStats = {
    activeTrackers: 0,
    safeLocations: 0,
    alerts: 0,
    emergencies: 0,
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Trackers</p>
              <p className="text-2xl font-semibold text-gray-900">{currentStats.activeTrackers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Safe Locations</p>
              <p className="text-2xl font-semibold text-gray-900">{currentStats.safeLocations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{currentStats.alerts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Emergency</p>
              <p className="text-2xl font-semibold text-gray-900">{currentStats.emergencies}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
