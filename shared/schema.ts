import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trackers = pgTable("trackers", {
  id: serial("id").primaryKey(),
  trackerId: text("tracker_id").notNull().unique(),
  name: text("name").notNull(),
  group: text("group").notNull(),
  status: text("status").notNull().default("safe"), // safe, alert, emergency
  lastLocation: text("last_location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  batteryLevel: integer("battery_level").notNull().default(100),
  lastUpdate: timestamp("last_update").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  type: text("type").notNull(), // emergency, security, medical
  isActive: boolean("is_active").notNull().default(true),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  trackerId: text("tracker_id").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  locationName: text("location_name"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTrackerSchema = createInsertSchema(trackers).omit({
  id: true,
  lastUpdate: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  timestamp: true,
});

export type InsertTracker = z.infer<typeof insertTrackerSchema>;
export type Tracker = typeof trackers.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
