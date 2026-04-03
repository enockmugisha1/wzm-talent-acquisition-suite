import "dotenv/config";
import express, { type Request, type Response } from "express";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import { adminCount, createAdmin, hashPassword } from "./storage";
import { createServer } from "http";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// Cached initialization — runs once per serverless cold start
let initPromise: Promise<void> | null = null;

function init(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      const count = await adminCount();
      if (count === 0) {
        await createAdmin({
          username: "enock",
          email: "e.mugisha4@alustudent.com",
          password: hashPassword("Admin@1234"),
          role: "super_admin",
          mustChangePassword: false,
        });
      }
      const httpServer = createServer(app);
      await registerRoutes(httpServer, app);
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    await init();
  } catch (err: any) {
    console.error("Server init failed:", err);
    return res.status(500).json({
      message: "Server initialization failed",
      error: err?.message || String(err),
      stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
    });
  }
  app(req, res);
}
