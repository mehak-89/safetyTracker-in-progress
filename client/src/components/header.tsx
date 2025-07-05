import { Shield, Settings, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Event Guardian</h1>
              <p className="text-sm text-gray-500">Real-Time Tracking System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Circle className="w-3 h-3 text-green-500 fill-current" />
              <span className="text-sm text-gray-600">System Online</span>
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-1">
              <span className="text-sm font-medium text-gray-700">Kumbh Mela 2024</span>
            </div>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Settings className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
