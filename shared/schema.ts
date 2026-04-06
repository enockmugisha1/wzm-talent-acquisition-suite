import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";

// ── Admins ────────────────────────────────────────────────────────────────────
export const admins = pgTable("admins", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().default(""),
  password: text("password").notNull().default(""),
  role: text("role").notNull().default("admin"),
  mustChangePassword: boolean("must_change_password").notNull().default(true),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── Applications ──────────────────────────────────────────────────────────────
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  jobId: integer("job_id"),
  cvFilename: text("cv_filename").notNull(),
  cvStoredName: text("cv_stored_name").notNull(),
  cvMimeType: text("cv_mime_type").notNull(),
  cvData: text("cv_data"),
  status: text("status").notNull().default("new"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// ── Contacts ──────────────────────────────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// ── Testimonials ──────────────────────────────────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  company: text("company").notNull(),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  active: boolean("active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
