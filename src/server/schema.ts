import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customerName").notNull(),
  customerPhone: text("customerPhone").notNull(),
  customerEmail: text("customerEmail").notNull(),
  serviceAddress: text("serviceAddress").notNull(),
  services: text("services").notNull(), // JSON-encoded string[]
  preferredDate: text("preferredDate"),
  preferredTime: text("preferredTime"),
  notes: text("notes"),
  status: text("status", { enum: ["pending", "confirmed", "completed", "cancelled"] })
    .notNull()
    .default("pending"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
  name: text("name"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  lastSignedIn: text("lastSignedIn"),
});

export const ownerUsers = sqliteTable("owner_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  passwordSalt: text("passwordSalt").notNull(),
  name: text("name"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  lastSignedIn: text("lastSignedIn"),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type OwnerUser = typeof ownerUsers.$inferSelect;
