import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import { adminCount, createAdmin, hashPassword } from "./storage";
import { createServer } from "http";

const app = express();

// Trust Vercel's reverse proxy so secure cookies work on HTTPS
app.set("trust proxy", 1);

app.use(express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: false }));

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
        console.log("[seed] Super admin created: enock / Admin@1234");
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

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  console.error("[error-handler]", err?.message, err?.stack);
  res.status(status).json({ message: err?.message || "Internal Server Error" });
});

export default async function handler(req: Request, res: Response) {
  try {
    await init();
  } catch (err: any) {
    console.error("Server init failed:", err);
    return res.status(500).json({ message: "Server initialization failed", error: err?.message });
  }
  app(req, res);
}
