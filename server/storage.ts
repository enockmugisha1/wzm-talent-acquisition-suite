import { createHash, randomBytes } from "crypto";
import { AdminModel, type IAdmin } from "./models/Admin";
import { JobModel, type IJob } from "./models/Job";
import { ApplicationModel, type IApplication } from "./models/Application";
import { ContactModel, type IContact } from "./models/Contact";
import { TestimonialModel } from "./models/Testimonial";
import mongoose from "mongoose";

export function hashPassword(password: string): string {
  return createHash("sha256").update(password + "wzm_salt_2024").digest("hex");
}

// ── Admin helpers ──────────────────────────────────────────────────────────────

export async function getAdminById(id: string) {
  return AdminModel.findById(id).exec();
}

export async function getAdminByUsername(username: string) {
  return AdminModel.findOne({ username }).exec();
}

export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
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
  return AdminModel.create({
    username: data.username,
    email: data.email,
    password: data.password ?? "",
    role: data.role ?? "admin",
    mustChangePassword: data.mustChangePassword ?? true,
    resetToken: data.resetToken,
    resetTokenExpiry: data.resetTokenExpiry,
  });
}

export async function getAdminByEmail(email: string) {
  return AdminModel.findOne({ email: email.toLowerCase().trim() }).exec();
}

export async function getAdminByResetToken(token: string) {
  return AdminModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  }).exec();
}

export async function setAdminPassword(id: string, hashedPassword: string) {
  return AdminModel.findByIdAndUpdate(
    id,
    { password: hashedPassword, mustChangePassword: false, resetToken: undefined, resetTokenExpiry: undefined },
    { new: true }
  ).exec();
}

export async function updateAdminPassword(
  id: string,
  hashedPassword: string,
  mustChangePassword: boolean
) {
  return AdminModel.findByIdAndUpdate(
    id,
    { password: hashedPassword, mustChangePassword },
    { new: true }
  ).exec();
}

export async function deleteAdmin(id: string) {
  return AdminModel.findByIdAndDelete(id).exec();
}

export async function listAdmins() {
  return AdminModel.find().sort({ createdAt: 1 }).exec();
}

export async function adminCount() {
  return AdminModel.countDocuments().exec();
}

// ── Job helpers ────────────────────────────────────────────────────────────────

export async function listJobs() {
  return JobModel.find().sort({ createdAt: -1 }).lean().exec();
}

export async function getJobById(id: string) {
  return JobModel.findById(id).exec();
}

export async function createJob(data: {
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string;
  status?: string;
  adminId: string;
}) {
  return JobModel.create({
    title: data.title,
    location: data.location,
    type: data.type,
    description: data.description,
    deadline: data.deadline,
    status: data.status ?? "open",
    posted: new Date().toISOString().slice(0, 10),
    createdBy: new mongoose.Types.ObjectId(data.adminId),
  });
}

export async function updateJob(
  id: string,
  data: Partial<{
    title: string;
    location: string;
    type: string;
    description: string;
    deadline: string;
    status: string;
  }>
) {
  return JobModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteJob(id: string) {
  return JobModel.findByIdAndDelete(id).exec();
}

// ── Application helpers ────────────────────────────────────────────────────────

export async function listApplications() {
  return ApplicationModel.find()
    .sort({ submittedAt: -1 })
    .populate("jobId", "title")
    .lean()
    .exec();
}

export async function getApplicationById(id: string) {
  return ApplicationModel.findById(id).exec();
}

export async function createApplication(data: {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  jobId?: string;
  cvFilename: string;
  cvStoredName: string;
  cvMimeType: string;
}) {
  return ApplicationModel.create({
    ...data,
    jobId: data.jobId ? new mongoose.Types.ObjectId(data.jobId) : undefined,
    submittedAt: new Date(),
  });
}

export async function updateApplicationStatus(id: string, status: string) {
  return ApplicationModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
}

export async function deleteApplication(id: string) {
  return ApplicationModel.findByIdAndDelete(id).exec();
}

// ── Contact helpers ────────────────────────────────────────────────────────────

export async function createContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return ContactModel.create({ ...data, submittedAt: new Date() });
}

export async function getContactById(id: string) {
  return ContactModel.findById(id).exec();
}

export async function listContacts() {
  return ContactModel.find().sort({ submittedAt: -1 }).lean().exec();
}

export async function markContactRead(id: string) {
  return ContactModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
}

export async function unreadContactCount() {
  return ContactModel.countDocuments({ read: false }).exec();
}

// ── Testimonial helpers ────────────────────────────────────────────────────────

export async function listTestimonials(activeOnly = false) {
  const filter = activeOnly ? { active: true } : {};
  return TestimonialModel.find(filter).sort({ order: 1, createdAt: -1 }).lean().exec();
}

export async function createTestimonial(data: {
  name: string; role?: string; company: string; quote: string; rating?: number; order?: number;
}) {
  return TestimonialModel.create({ ...data });
}

export async function updateTestimonial(id: string, data: Partial<{
  name: string; role: string; company: string; quote: string; rating: number; active: boolean; order: number;
}>) {
  return TestimonialModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteTestimonial(id: string) {
  return TestimonialModel.findByIdAndDelete(id).exec();
}
