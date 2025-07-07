import { trackers, emergencyContacts, locations, type Tracker, type InsertTracker, type EmergencyContact, type InsertEmergencyContact, type Location, type InsertLocation } from "@shared/schema";
// import { db } from "./Firebase";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Tracker operations
  getTracker(id: number): Promise<Tracker | undefined>;
  getTrackerByTrackerId(trackerId: string): Promise<Tracker | undefined>;
  getAllTrackers(): Promise<Tracker[]>;
  createTracker(tracker: InsertTracker): Promise<Tracker>;
  updateTracker(id: number, tracker: Partial<InsertTracker>): Promise<Tracker | undefined>;
  deleteTracker(id: number): Promise<boolean>;
  
  // Emergency contact operations
  getAllEmergencyContacts(): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  
  // Location operations
  getLocationHistory(trackerId: string, limit?: number): Promise<Location[]>;
  addLocation(location: InsertLocation): Promise<Location>;
  
  // Statistics
  getStats(): Promise<{
    activeTrackers: number;
    safeLocations: number;
    alerts: number;
    emergencies: number;
  }>;
}

export class MemStorage implements IStorage {
  private trackers: Map<number, Tracker>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private locations: Map<number, Location>;
  private currentTrackerId: number;
  private currentEmergencyContactId: number;
  private currentLocationId: number;

  constructor() {
    this.trackers = new Map();
    this.emergencyContacts = new Map();
    this.locations = new Map();
    this.currentTrackerId = 1;
    this.currentEmergencyContactId = 1;
    this.currentLocationId = 1;
    
    // Initialize with default emergency contacts
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default emergency contacts
    const defaultContacts: InsertEmergencyContact[] = [
      { name: "Emergency Services", phone: "108", type: "emergency", isActive: true },
      { name: "Security Command", phone: "+91 9876543210", type: "security", isActive: true },
      { name: "Medical Team", phone: "+91 9876543211", type: "medical", isActive: true },
    ];

    defaultContacts.forEach(contact => {
      const id = this.currentEmergencyContactId++;
      this.emergencyContacts.set(id, { 
        ...contact, 
        id, 
        isActive: contact.isActive
      });
    });

    // Add sample trackers for demonstration
    const sampleTrackers: InsertTracker[] = [
      {
        trackerId: "TK-1234",
        name: "Amit Patel",
        group: "Family A",
        status: "safe",
        lastLocation: "Gate 2 - Main Entry",
        latitude: 25.3176,
        longitude: 82.9739,
        batteryLevel: 85,
        isActive: true,
      },
      {
        trackerId: "TK-2847",
        name: "Rajesh Kumar",
        group: "Individual",
        status: "alert",
        lastLocation: "Gate 3 - Exit",
        latitude: 25.3180,
        longitude: 82.9745,
        batteryLevel: 45,
        isActive: true,
      },
      {
        trackerId: "TK-1923",
        name: "Priya Sharma",
        group: "Family B",
        status: "safe",
        lastLocation: "Food Court - Section B",
        latitude: 25.3165,
        longitude: 82.9730,
        batteryLevel: 72,
        isActive: true,
      },
    ];

    sampleTrackers.forEach(tracker => {
      const id = this.currentTrackerId++;
      this.trackers.set(id, { 
        ...tracker, 
        id, 
        lastUpdate: new Date(),
        status: tracker.status,
        batteryLevel: tracker.batteryLevel,
        isActive: tracker.isActive
      });
    });
  }

  async getTracker(id: number): Promise<Tracker | undefined> {
    return this.trackers.get(id);
  }

  async getTrackerByTrackerId(trackerId: string): Promise<Tracker | undefined> {
    return Array.from(this.trackers.values()).find(t => t.trackerId === trackerId);
  }

  async getAllTrackers(): Promise<Tracker[]> {
    return Array.from(this.trackers.values()).filter(t => t.isActive);
  }

  async createTracker(insertTracker: InsertTracker): Promise<Tracker> {
    const id = this.currentTrackerId++;
    const tracker: Tracker = { 
      ...insertTracker, 
      id, 
      lastUpdate: new Date(),
      status: insertTracker.status ?? "safe",
      batteryLevel: insertTracker.batteryLevel ?? 100,
      isActive: insertTracker.isActive ?? true
    };
    this.trackers.set(id, tracker);
    return tracker;
  }

  async updateTracker(id: number, updates: Partial<InsertTracker>): Promise<Tracker | undefined> {
    const tracker = this.trackers.get(id);
    if (!tracker) return undefined;
    
    const updatedTracker = { ...tracker, ...updates, lastUpdate: new Date() };
    this.trackers.set(id, updatedTracker);
    return updatedTracker;
  }

  async deleteTracker(id: number): Promise<boolean> {
    const tracker = this.trackers.get(id);
    if (!tracker) return false;
    
    this.trackers.set(id, { ...tracker, isActive: false });
    return true;
  }

  async getAllEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(c => c.isActive);
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentEmergencyContactId++;
    const emergencyContact: EmergencyContact = { 
      ...contact, 
      id,
      isActive: contact.isActive ?? true
    };
    this.emergencyContacts.set(id, emergencyContact);
    return emergencyContact;
  }

  async getLocationHistory(trackerId: string, limit: number = 10): Promise<Location[]> {
    return Array.from(this.locations.values())
      .filter(l => l.trackerId === trackerId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async addLocation(location: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const locationRecord: Location = { 
      ...location, 
      id, 
      timestamp: new Date(),
      locationName: location.locationName ?? null
    };
    this.locations.set(id, locationRecord);
    return locationRecord;
  }

  async getStats(): Promise<{
    activeTrackers: number;
    safeLocations: number;
    alerts: number;
    emergencies: number;
  }> {
    const activeTrackers = Array.from(this.trackers.values()).filter(t => t.isActive);
    const safeLocations = activeTrackers.filter(t => t.status === "safe").length;
    const alerts = activeTrackers.filter(t => t.status === "alert").length;
    const emergencies = activeTrackers.filter(t => t.status === "emergency").length;

    return {
      activeTrackers: activeTrackers.length,
      safeLocations,
      alerts,
      emergencies,
    };
  }
}

export class DatabaseStorage implements IStorage {
  async getTracker(id: number): Promise<Tracker | undefined> {
    const [tracker] = await db.select().from(trackers).where(eq(trackers.id, id));
    return tracker || undefined;
  }

  async getTrackerByTrackerId(trackerId: string): Promise<Tracker | undefined> {
    const [tracker] = await db.select().from(trackers).where(eq(trackers.trackerId, trackerId));
    return tracker || undefined;
  }

  async getAllTrackers(): Promise<Tracker[]> {
    return await db.select().from(trackers).where(eq(trackers.isActive, true));
  }

  async createTracker(insertTracker: InsertTracker): Promise<Tracker> {
    const [tracker] = await db
      .insert(trackers)
      .values(insertTracker)
      .returning();
    return tracker;
  }

  async updateTracker(id: number, updates: Partial<InsertTracker>): Promise<Tracker | undefined> {
    const [tracker] = await db
      .update(trackers)
      .set(updates)
      .where(eq(trackers.id, id))
      .returning();
    return tracker || undefined;
  }

  async deleteTracker(id: number): Promise<boolean> {
    const [tracker] = await db
      .update(trackers)
      .set({ isActive: false })
      .where(eq(trackers.id, id))
      .returning();
    return !!tracker;
  }

  async getAllEmergencyContacts(): Promise<EmergencyContact[]> {
    return await db.select().from(emergencyContacts).where(eq(emergencyContacts.isActive, true));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [emergencyContact] = await db
      .insert(emergencyContacts)
      .values(contact)
      .returning();
    return emergencyContact;
  }

  async getLocationHistory(trackerId: string, limit: number = 10): Promise<Location[]> {
    return await db
      .select()
      .from(locations)
      .where(eq(locations.trackerId, trackerId))
      .orderBy(locations.timestamp)
      .limit(limit);
  }

  async addLocation(location: InsertLocation): Promise<Location> {
    const [locationRecord] = await db
      .insert(locations)
      .values(location)
      .returning();
    return locationRecord;
  }

  async getStats(): Promise<{
    activeTrackers: number;
    safeLocations: number;
    alerts: number;
    emergencies: number;
  }> {
    const activeTrackers = await db.select().from(trackers).where(eq(trackers.isActive, true));
    const safeLocations = activeTrackers.filter(t => t.status === "safe").length;
    const alerts = activeTrackers.filter(t => t.status === "alert").length;
    const emergencies = activeTrackers.filter(t => t.status === "emergency").length;

    return {
      activeTrackers: activeTrackers.length,
      safeLocations,
      alerts,
      emergencies,
    };
  }
}

export const storage = new DatabaseStorage();
