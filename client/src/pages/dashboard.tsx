import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { StatsOverview } from "@/components/stats-overview";
import { MapView } from "@/components/map-view";
import { TrackingPanel } from "@/components/tracking-panel";
import { TrackingTable } from "@/components/tracking-table";
import { Button } from "@/components/ui/button";
import { TriangleAlert, PlusIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tracker } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: trackers = [], isLoading: trackersLoading } = useQuery<Tracker[]>({
    queryKey: ["/api/trackers"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  const handleEmergencyAlert = () => {
    toast({
      title: "Emergency Alert",
      description: "Emergency services have been notified.",
      variant: "destructive",
    });
  };

  const handleAddTracker = () => {
    toast({
      title: "Add Tracker",
      description: "Add tracker functionality would open here.",
    });
  };

  if (trackersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsOverview stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MapView trackers={trackers} />
          </div>
          <div>
            <TrackingPanel trackers={trackers} />
          </div>
        </div>
        
        <div className="mt-6">
          <TrackingTable trackers={trackers} />
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <Button
          size="icon"
          variant="destructive"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          onClick={handleEmergencyAlert}
        >
          <TriangleAlert className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
          onClick={handleAddTracker}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
