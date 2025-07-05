// Mock data for demonstration purposes
// This would be replaced with real Firebase/API data

import type { Tracker } from "@shared/schema";

export const mockTrackers: Tracker[] = [
  {
    id: 1,
    trackerId: "TK-1234",
    name: "Amit Patel",
    group: "Family A",
    status: "safe",
    lastLocation: "Gate 2 - Main Entry",
    latitude: 25.3176,
    longitude: 82.9739,
    batteryLevel: 85,
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isActive: true,
  },
  {
    id: 2,
    trackerId: "TK-2847",
    name: "Rajesh Kumar",
    group: "Individual",
    status: "alert",
    lastLocation: "Gate 3 - Exit",
    latitude: 25.3180,
    longitude: 82.9745,
    batteryLevel: 45,
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isActive: true,
  },
  {
    id: 3,
    trackerId: "TK-1923",
    name: "Priya Sharma",
    group: "Family B",
    status: "safe",
    lastLocation: "Food Court - Section B",
    latitude: 25.3165,
    longitude: 82.9730,
    batteryLevel: 72,
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    isActive: true,
  },
];

export const mockStats = {
  activeTrackers: 847,
  safeLocations: 831,
  alerts: 3,
  emergencies: 0,
};
