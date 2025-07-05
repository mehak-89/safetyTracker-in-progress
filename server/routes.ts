import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrackerSchema, insertEmergencyContactSchema, insertLocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all trackers
  app.get("/api/trackers", async (req, res) => {
    try {
      const trackers = await storage.getAllTrackers();
      res.json(trackers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trackers" });
    }
  });

  // Get tracker by ID
  app.get("/api/trackers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tracker = await storage.getTracker(id);
      if (!tracker) {
        return res.status(404).json({ error: "Tracker not found" });
      }
      res.json(tracker);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tracker" });
    }
  });

  // Create new tracker
  app.post("/api/trackers", async (req, res) => {
    try {
      const validatedData = insertTrackerSchema.parse(req.body);
      const tracker = await storage.createTracker(validatedData);
      res.status(201).json(tracker);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create tracker" });
    }
  });

  // Update tracker
  app.patch("/api/trackers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const tracker = await storage.updateTracker(id, updates);
      if (!tracker) {
        return res.status(404).json({ error: "Tracker not found" });
      }
      res.json(tracker);
    } catch (error) {
      res.status(500).json({ error: "Failed to update tracker" });
    }
  });

  // Delete tracker
  app.delete("/api/trackers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTracker(id);
      if (!success) {
        return res.status(404).json({ error: "Tracker not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tracker" });
    }
  });

  // Get emergency contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  // Create emergency contact
  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create emergency contact" });
    }
  });

  // Get location history
  app.get("/api/locations/:trackerId", async (req, res) => {
    try {
      const { trackerId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const locations = await storage.getLocationHistory(trackerId, limit);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location history" });
    }
  });

  // Add location
  app.post("/api/locations", async (req, res) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const location = await storage.addLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add location" });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Update tracker location (for real-time updates)
  app.post("/api/trackers/:trackerId/location", async (req, res) => {
    try {
      const { trackerId } = req.params;
      const { latitude, longitude, locationName } = req.body;
      
      // Find tracker
      const tracker = await storage.getTrackerByTrackerId(trackerId);
      if (!tracker) {
        return res.status(404).json({ error: "Tracker not found" });
      }

      // Update tracker location
      await storage.updateTracker(tracker.id, {
        latitude,
        longitude,
        lastLocation: locationName || tracker.lastLocation,
      });

      // Add to location history
      await storage.addLocation({
        trackerId,
        latitude,
        longitude,
        locationName,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update location" });
    }
  });

  // Trigger SOS alert
  app.post("/api/trackers/:trackerId/sos", async (req, res) => {
    try {
      const { trackerId } = req.params;
      const tracker = await storage.getTrackerByTrackerId(trackerId);
      if (!tracker) {
        return res.status(404).json({ error: "Tracker not found" });
      }

      // Update tracker status to emergency
      await storage.updateTracker(tracker.id, {
        status: "emergency",
      });

      res.json({ success: true, message: "SOS alert triggered" });
    } catch (error) {
      res.status(500).json({ error: "Failed to trigger SOS alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
