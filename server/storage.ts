import { createHash, randomBytes } from "crypto";
import { eq, desc, asc, sql } from "drizzle-orm";
import { getDB } from "./db";
import { admins, jobs, applications, contacts, testimonials } from "../shared/schema";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "wzm_salt_2024").digest("hex");
}

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

// ── Admin helpers ──────────────────────────────────────────────────────────────

export async function getAdminById(id: string) {
  const db = getDB();
  const rows = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getAdminByUsername(username: string) {
  const db = getDB();
  const rows = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
  return rows[0] ?? null;
}

export async function getAdminByEmail(email: string) {
  const db = getDB();
  const rows = await db.select().from(admins).where(eq(admins.email, email.toLowerCase().trim())).limit(1);
  return rows[0] ?? null;
}

export async function getAdminByResetToken(token: string) {
  const db = getDB();
  const rows = await db.select().from(admins)
    .where(eq(admins.resetToken, token))
    .limit(1);
  const admin = rows[0] ?? null;
  if (!admin || !admin.resetTokenExpiry) return null;
  if (new Date(admin.resetTokenExpiry) < new Date()) return null;
  return admin;
}

export async function createAdmin(data: {
  username: string;
  email: string;
  password?: string;
  role?: "admin" | "super_admin";
  mustChangePassword?: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
}) {
  const db = getDB();
  const rows = await db.insert(admins).values({
    username: data.username,
    email: data.email,
    password: data.password ?? "",
    role: data.role ?? "admin",
    mustChangePassword: data.mustChangePassword ?? true,
    resetToken: data.resetToken ?? null,
    resetTokenExpiry: data.resetTokenExpiry ?? null,
  }).returning();
  return rows[0];
}

export async function updateAdminPassword(id: string, hashedPassword: string, mustChangePassword: boolean) {
  const db = getDB();
  const rows = await db.update(admins)
    .set({ password: hashedPassword, mustChangePassword })
    .where(eq(admins.id, id))
    .returning();
  return rows[0];
}

export async function setAdminPassword(id: string, hashedPassword: string) {
  const db = getDB();
  const rows = await db.update(admins)
    .set({ password: hashedPassword, mustChangePassword: false, resetToken: null, resetTokenExpiry: null })
    .where(eq(admins.id, id))
    .returning();
  return rows[0];
}

export async function setAdminResetToken(id: string, token: string, expiry: Date) {
  const db = getDB();
  const rows = await db.update(admins)
    .set({ resetToken: token, resetTokenExpiry: expiry })
    .where(eq(admins.id, id))
    .returning();
  return rows[0];
}

export async function deleteAdmin(id: string) {
  const db = getDB();
  await db.delete(admins).where(eq(admins.id, id));
}

export async function listAdmins() {
  const db = getDB();
  return db.select().from(admins).orderBy(asc(admins.createdAt));
}

export async function adminCount() {
  const db = getDB();
  const result = await db.select({ count: sql<number>`count(*)` }).from(admins);
  return Number(result[0].count);
}

// ── Job helpers ────────────────────────────────────────────────────────────────

export async function listJobs() {
  const db = getDB();
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: string) {
  const db = getDB();
  const rows = await db.select().from(jobs).where(eq(jobs.id, parseInt(id))).limit(1);
  return rows[0] ?? null;
}

export async function createJob(data: {
  title: string; location: string; type: string;
  description: string; deadline: string; status?: string; adminId: string;
}) {
  const db = getDB();
  const rows = await db.insert(jobs).values({
    title: data.title,
    location: data.location,
    type: data.type,
    description: data.description,
    deadline: data.deadline,
    status: data.status ?? "open",
    posted: new Date().toISOString().slice(0, 10),
    createdBy: data.adminId,
  }).returning();
  return rows[0];
}

export async function updateJob(id: string, data: Partial<{
  title: string; location: string; type: string;
  description: string; deadline: string; status: string;
}>) {
  const db = getDB();
  const rows = await db.update(jobs).set(data).where(eq(jobs.id, parseInt(id))).returning();
  return rows[0];
}

export async function deleteJob(id: string) {
  const db = getDB();
  await db.delete(jobs).where(eq(jobs.id, parseInt(id)));
}

// ── Application helpers ────────────────────────────────────────────────────────

export async function listApplications() {
  const db = getDB();
  const rows = await db
    .select({
      _id: applications.id,
      id: applications.id,
      fullName: applications.fullName,
      email: applications.email,
      phone: applications.phone,
      position: applications.position,
      jobId: applications.jobId,
      cvFilename: applications.cvFilename,
      cvStoredName: applications.cvStoredName,
      cvMimeType: applications.cvMimeType,
      status: applications.status,
      submittedAt: applications.submittedAt,
      jobTitle: jobs.title,
    })
    .from(applications)
    .leftJoin(jobs, eq(applications.jobId, jobs.id))
    .orderBy(desc(applications.submittedAt));

  return rows.map(r => ({
    ...r,
    jobId: r.jobId ? { id: r.jobId, title: r.jobTitle } : undefined,
  }));
}

export async function getApplicationById(id: string) {
  const db = getDB();
  const rows = await db.select().from(applications).where(eq(applications.id, parseInt(id))).limit(1);
  return rows[0] ?? null;
}

export async function createApplication(data: {
  fullName: string; email: string; phone: string; position: string;
  jobId?: string; cvFilename: string; cvStoredName: string; cvMimeType: string; cvData?: string;
}) {
  const db = getDB();
  const rows = await db.insert(applications).values({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    position: data.position,
    jobId: data.jobId ? parseInt(data.jobId) : null,
    cvFilename: data.cvFilename,
    cvStoredName: data.cvStoredName,
    cvMimeType: data.cvMimeType,
    cvData: data.cvData ?? null,
  }).returning();
  return rows[0];
}

export async function updateApplicationStatus(id: string, status: string) {
  const db = getDB();
  const rows = await db.update(applications).set({ status }).where(eq(applications.id, parseInt(id))).returning();
  return rows[0];
}

export async function deleteApplication(id: string) {
  const db = getDB();
  await db.delete(applications).where(eq(applications.id, parseInt(id)));
}

// ── Contact helpers ────────────────────────────────────────────────────────────

export async function createContact(data: {
  name: string; email: string; subject: string; message: string;
}) {
  const db = getDB();
  const rows = await db.insert(contacts).values({ ...data }).returning();
  return rows[0];
}

export async function getContactById(id: string) {
  const db = getDB();
  const rows = await db.select().from(contacts).where(eq(contacts.id, parseInt(id))).limit(1);
  return rows[0] ?? null;
}

export async function listContacts() {
  const db = getDB();
  return db.select().from(contacts).orderBy(desc(contacts.submittedAt));
}

export async function markContactRead(id: string) {
  const db = getDB();
  const rows = await db.update(contacts).set({ read: true }).where(eq(contacts.id, parseInt(id))).returning();
  return rows[0];
}

export async function deleteContact(id: string) {
  const db = getDB();
  await db.delete(contacts).where(eq(contacts.id, parseInt(id)));
}

export async function unreadContactCount() {
  const db = getDB();
  const result = await db.select({ count: sql<number>`count(*)` }).from(contacts).where(eq(contacts.read, false));
  return Number(result[0].count);
}

// ── Testimonial helpers ────────────────────────────────────────────────────────

export async function listTestimonials(activeOnly = false) {
  const db = getDB();
  const query = db.select().from(testimonials);
  if (activeOnly) {
    return query.where(eq(testimonials.active, true)).orderBy(asc(testimonials.order), desc(testimonials.createdAt));
  }
  return query.orderBy(asc(testimonials.order), desc(testimonials.createdAt));
}

export async function createTestimonial(data: {
  name: string; role?: string; company: string; quote: string; rating?: number; order?: number;
}) {
  const db = getDB();
  const rows = await db.insert(testimonials).values({
    name: data.name,
    role: data.role ?? "",
    company: data.company,
    quote: data.quote,
    rating: data.rating ?? 5,
    order: data.order ?? 0,
  }).returning();
  return rows[0];
}

export async function updateTestimonial(id: string, data: Partial<{
  name: string; role: string; company: string; quote: string;
  rating: number; active: boolean; order: number;
}>) {
  const db = getDB();
  const rows = await db.update(testimonials).set(data).where(eq(testimonials.id, parseInt(id))).returning();
  return rows[0];
}

export async function deleteTestimonial(id: string) {
  const db = getDB();
  await db.delete(testimonials).where(eq(testimonials.id, parseInt(id)));
}
