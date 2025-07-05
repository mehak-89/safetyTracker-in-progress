import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Expand, Circle } from "lucide-react";
import { useState } from "react";
import type { Tracker } from "@shared/schema";

interface MapViewProps {
  trackers: Tracker[];
}

export function MapView({ trackers }: MapViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500";
      case "alert":
        return "bg-yellow-500";
      case "emergency":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusCounts = () => {
    return trackers.reduce((acc, tracker) => {
      acc[tracker.status] = (acc[tracker.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Live Tracking Map
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-primary hover:bg-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
            >
              <Expand className="h-4 w-4 mr-1" />
              Fullscreen
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative bg-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          {/* Map placeholder with mock satellite image */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Google Maps integration would display here</p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Circle className="w-3 h-3 text-green-500 fill-current" />
                <span className="text-sm text-gray-600">Safe ({statusCounts.safe || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">Alert ({statusCounts.alert || 0})</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-3 h-3 text-red-500 fill-current" />
                <span className="text-sm text-gray-600">Emergency ({statusCounts.emergency || 0})</span>
              </div>
            </div>
          </div>
          
          {/* Simulated tracking markers */}
          {trackers.map((tracker, index) => (
            <div
              key={tracker.id}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(tracker.status)} ${
                tracker.status === 'alert' ? 'pulse-animation' : ''
              }`}
              style={{
                // Simulate positions based on tracker index
                top: `${20 + (index * 15) % 60}%`,
                left: `${30 + (index * 20) % 50}%`,
              }}
              title={`${tracker.name} - ${tracker.status}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
