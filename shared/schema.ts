import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users (template default) ──────────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ── Admins ────────────────────────────────────────────────────────────────────
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  mustChangePassword: boolean("must_change_password").notNull().default(true),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = {
  username: string;
  password: string;
  role?: string;
  mustChangePassword?: boolean;
};

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("open"),
  posted: text("posted").notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = {
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string;
  status?: string;
  posted: string;
};

// ── Applications ──────────────────────────────────────────────────────────────
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  cvFilename: text("cv_filename"),
  status: text("status").notNull().default("new"),
  submittedAt: text("submitted_at").notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  cvFilename?: string | null;
};

// ── Contacts ──────────────────────────────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: text("submitted_at").notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Zod schemas for API validation
export const insertApplicationSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  position: z.string().min(1),
  cvFilename: z.string().optional().nullable(),
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});
