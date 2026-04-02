import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  hashPassword,
  getAdminById,
  getAdminByUsername,
  getAdminByEmail,
  getAdminByResetToken,
  createAdmin,
  updateAdminPassword,
  setAdminPassword,
  deleteAdmin,
  listAdmins,
  adminCount,
  generateResetToken,
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  listApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
  createContact,
  listContacts,
  getContactById,
  markContactRead,
  unreadContactCount,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./storage";
import { sendPasswordSetupEmail, sendContactNotificationEmail, sendContactReplyEmail } from "./mailer";

const MemoryStoreSession = MemoryStore(session);

// ── Session typing ─────────────────────────────────────────────────────────────
declare module "express-session" {
  interface SessionData {
    adminId?: string;
    adminRole?: string;
  }
}

// ── Multer setup (CV uploads) ──────────────────────────────────────────────────
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter(_req, file, cb) {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are accepted"));
    }
  },
});

// ── Auth middleware ────────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.adminId) return res.status(401).json({ message: "Unauthorized" });
  next();
}

function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.adminId) return res.status(401).json({ message: "Unauthorized" });
  if (req.session.adminRole !== "super_admin")
    return res.status(403).json({ message: "Super admin access required" });
  next();
}

// ── Route registration ─────────────────────────────────────────────────────────
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "wzm-hr-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
      store: new MemoryStoreSession({ checkPeriod: 86400000 }),
    })
  );

  // ── First-run setup ──────────────────────────────────────────────────────────

  // GET /api/setup/status  — tells the frontend whether setup is needed
  app.get("/api/setup/status", async (_req, res) => {
    const count = await adminCount();
    res.json({ needsSetup: count === 0 });
  });

  // POST /api/setup  — create the first super admin (only when no admins exist)
  app.post("/api/setup", async (req, res) => {
    const count = await adminCount();
    if (count > 0) return res.status(403).json({ message: "Setup already completed" });

    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Username, email and password required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const admin = await createAdmin({
      username,
      email,
      password: hashPassword(password),
      role: "super_admin",
      mustChangePassword: false,
    });
    res.status(201).json({ message: "Super admin created", username: admin.username });
  });

  // ── Auth ─────────────────────────────────────────────────────────────────────

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const admin = await getAdminByUsername(username);
    if (!admin) return res.status(401).json({ message: "Invalid username or password" });
    if (!admin.password) return res.status(401).json({ message: "Please use the password setup link sent to your email to set your password first." });
    if (admin.password !== hashPassword(password))
      return res.status(401).json({ message: "Invalid username or password" });

    req.session.adminId = String(admin._id);
    req.session.adminRole = admin.role;

    res.json({
      id: admin._id,
      username: admin.username,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Logged out" }));
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.adminId) return res.status(401).json({ message: "Unauthorized" });
    const admin = await getAdminById(req.session.adminId);
    if (!admin) return res.status(401).json({ message: "Session invalid" });
    res.json({
      id: admin._id,
      username: admin.username,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    });
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const updated = await updateAdminPassword(
      req.session.adminId!,
      hashPassword(newPassword),
      false
    );
    if (!updated) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Password updated" });
  });

  // ── Admin management (super_admin only) ──────────────────────────────────────

  app.get("/api/admins", requireSuperAdmin, async (_req, res) => {
    const admins = await listAdmins();
    res.json(
      admins.map((a) => ({
        id: a._id,
        username: a.username,
        role: a.role,
        mustChangePassword: a.mustChangePassword,
      }))
    );
  });

  app.post("/api/admins", requireSuperAdmin, async (req, res) => {
    const { username, email, role } = req.body;
    if (!username || !email)
      return res.status(400).json({ message: "Username and email are required" });

    const existingUser = await getAdminByUsername(username);
    if (existingUser) return res.status(409).json({ message: "Username already exists" });

    const existingEmail = await getAdminByEmail(email);
    if (existingEmail) return res.status(409).json({ message: "Email already in use" });

    // Generate a 24-hour password setup token — no temporary password needed
    const token = generateResetToken();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const admin = await createAdmin({
      username,
      email,
      password: "",           // no password until they set it via the email link
      role: role === "super_admin" ? "super_admin" : "admin",
      mustChangePassword: true,
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    // Get the super admin's name for the email
    const creator = await getAdminById(req.session.adminId!);
    await sendPasswordSetupEmail({
      toEmail: email,
      toUsername: username,
      resetToken: token,
      createdByUsername: creator?.username ?? "Admin",
    });

    res.status(201).json({
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      message: "Admin created. A password setup link has been sent to their email.",
    });
  });

  app.delete("/api/admins/:id", requireSuperAdmin, async (req, res) => {
    const id = String(req.params.id);
    if (id === req.session.adminId)
      return res.status(400).json({ message: "Cannot delete yourself" });
    const deleted = await deleteAdmin(id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted" });
  });

  // ── Password reset (for newly created admins) ─────────────────────────────────

  // GET /api/auth/reset-password/:token — validate token, return username
  app.get("/api/auth/reset-password/:token", async (req, res) => {
    const admin = await getAdminByResetToken(String(req.params.token));
    if (!admin) return res.status(400).json({ message: "This link is invalid or has expired." });
    res.json({ username: admin.username, email: admin.email });
  });

  // POST /api/auth/reset-password — set new password using the token
  app.post("/api/auth/reset-password", async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const admin = await getAdminByResetToken(token);
    if (!admin) return res.status(400).json({ message: "This link is invalid or has expired." });

    await setAdminPassword(String(admin._id), hashPassword(password));
    res.json({ message: "Password set successfully. You can now log in." });
  });

  // ── Jobs ──────────────────────────────────────────────────────────────────────

  // Public: list all jobs
  app.get("/api/jobs", async (_req, res) => {
    const jobs = await listJobs();
    res.json(jobs);
  });

  // Admin: create job
  app.post("/api/jobs", requireAuth, async (req, res) => {
    const { title, location, type, description, deadline, status } = req.body;
    if (!title || !location || !type || !description || !deadline)
      return res.status(400).json({ message: "All fields are required" });

    const job = await createJob({
      title,
      location,
      type,
      description,
      deadline,
      status: status || "open",
      adminId: req.session.adminId!,
    });
    res.status(201).json(job);
  });

  // Admin: edit job
  app.put("/api/jobs/:id", requireAuth, async (req, res) => {
    const { title, location, type, description, deadline, status } = req.body;
    const updated = await updateJob(String(req.params.id), {
      title,
      location,
      type,
      description,
      deadline,
      status,
    });
    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json(updated);
  });

  // Admin: delete job
  app.delete("/api/jobs/:id", requireAuth, async (req, res) => {
    const deleted = await deleteJob(String(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  });

  // ── Applications ──────────────────────────────────────────────────────────────

  // Public: submit application with CV upload
  app.post("/api/applications", upload.single("cv"), async (req, res) => {
    const { fullName, email, phone, position, jobId } = req.body;
    if (!fullName || !email || !phone || !position)
      return res.status(400).json({ message: "fullName, email, phone and position are required" });
    if (!req.file)
      return res.status(400).json({ message: "CV file is required (PDF or Word)" });

    // Enforce deadline if jobId provided
    if (jobId) {
      const job = await getJobById(jobId);
      if (job) {
        const now = new Date();
        const deadline = new Date(job.deadline + "T23:59:59");
        if (now > deadline) {
          // Remove uploaded file since we're rejecting
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({ message: "Application deadline has passed for this job" });
        }
        if (job.status === "closed") {
          fs.unlink(req.file.path, () => {});
          return res.status(400).json({ message: "This job is no longer accepting applications" });
        }
      }
    }

    const application = await createApplication({
      fullName,
      email,
      phone,
      position,
      jobId: jobId || undefined,
      cvFilename: req.file.originalname,
      cvStoredName: req.file.filename,
      cvMimeType: req.file.mimetype,
    });
    res.status(201).json({ message: "Application submitted", id: application._id });
  });

  // Admin: list all applications
  app.get("/api/applications", requireAuth, async (_req, res) => {
    const apps = await listApplications();
    res.json(apps);
  });

  // Admin: update application status
  app.patch("/api/applications/:id/status", requireAuth, async (req, res) => {
    const { status } = req.body;
    if (!["new", "reviewed", "shortlisted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const updated = await updateApplicationStatus(String(req.params.id), status);
    if (!updated) return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  });

  // Admin: delete application
  app.delete("/api/applications/:id", requireAuth, async (req, res) => {
    const app = await getApplicationById(String(req.params.id));
    if (!app) return res.status(404).json({ message: "Application not found" });
    // Remove CV file from disk
    const filePath = path.join(UPLOADS_DIR, app.cvStoredName);
    if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
    await deleteApplication(String(req.params.id));
    res.json({ message: "Application deleted" });
  });

  // Admin: download CV
  app.get("/api/applications/:id/cv", requireAuth, async (req, res) => {
    const app = await getApplicationById(String(req.params.id));
    if (!app) return res.status(404).json({ message: "Application not found" });

    const filePath = path.join(UPLOADS_DIR, app.cvStoredName);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "CV file not found on server" });

    res.setHeader("Content-Disposition", `attachment; filename="${app.cvFilename}"`);
    res.setHeader("Content-Type", app.cvMimeType);
    fs.createReadStream(filePath).pipe(res);
  });

  // ── Contact ────────────────────────────────────────────────────────────────────

  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: "All fields are required" });

    const contact = await createContact({ name, email, subject, message });

    // Send ONE email to all admins/superadmins at once (non-blocking)
    listAdmins().then((admins) => {
      const recipients = admins
        .filter((a) => !!a.email)
        .map((a) => ({ email: a.email, username: a.username }));

      sendContactNotificationEmail({
        recipients,
        contact: {
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          submittedAt: contact.submittedAt,
        },
      });
    }).catch((err) => console.error("[contact] Failed to fetch admins for email:", err));

    res.status(201).json({ message: "Message received" });
  });

  // Admin: list all contact messages
  app.get("/api/contacts", requireAuth, async (_req, res) => {
    const contacts = await listContacts();
    res.json(contacts);
  });

  // Admin: get unread contact count
  app.get("/api/contacts/unread-count", requireAuth, async (_req, res) => {
    const count = await unreadContactCount();
    res.json({ count });
  });

  // Admin: mark a contact message as read
  app.patch("/api/contacts/:id/read", requireAuth, async (req, res) => {
    const updated = await markContactRead(String(req.params.id));
    if (!updated) return res.status(404).json({ message: "Message not found" });
    res.json(updated);
  });

  // Admin: reply to a contact message
  app.post("/api/contacts/:id/reply", requireAuth, async (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: "Reply message is required" });

    const contact = await getContactById(String(req.params.id));
    if (!contact) return res.status(404).json({ message: "Message not found" });

    const admin = await getAdminById(req.session.adminId!);

    try {
      await sendContactReplyEmail({
        toEmail: contact.email,
        toName: contact.name,
        originalSubject: contact.subject,
        replyMessage: message,
        repliedBy: admin?.username ?? "WZM HR Team",
      });
    } catch {
      return res.status(500).json({ message: "Failed to send reply email. Check SMTP config." });
    }

    await markContactRead(String(contact._id));
    res.json({ message: "Reply sent successfully" });
  });

  // ── Testimonials ───────────────────────────────────────────────────────────────

  // Public: active testimonials for the home page
  app.get("/api/testimonials", async (_req, res) => {
    const testimonials = await listTestimonials(true);
    res.json(testimonials);
  });

  // Admin: all testimonials (including inactive)
  app.get("/api/testimonials/all", requireAuth, async (_req, res) => {
    const testimonials = await listTestimonials(false);
    res.json(testimonials);
  });

  // Admin: create testimonial
  app.post("/api/testimonials", requireAuth, async (req, res) => {
    const { name, role, company, quote, rating, order } = req.body;
    if (!name || !company || !quote)
      return res.status(400).json({ message: "Name, company and quote are required" });
    const t = await createTestimonial({ name, role, company, quote, rating, order });
    res.status(201).json(t);
  });

  // Admin: update testimonial
  app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
    const { name, role, company, quote, rating, active, order } = req.body;
    const updated = await updateTestimonial(String(req.params.id), { name, role, company, quote, rating, active, order });
    if (!updated) return res.status(404).json({ message: "Testimonial not found" });
    res.json(updated);
  });

  // Admin: delete testimonial
  app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
    const deleted = await deleteTestimonial(String(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  });

  return httpServer;
}
