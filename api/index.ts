import "dotenv/config";
import express, { type Request, type Response } from "express";
import { registerRoutes } from "../server/routes";
import { connectDB } from "../server/db";
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
      const httpServer = createServer(app);
      await registerRoutes(httpServer, app);
    })().catch((err) => {
      initPromise = null; // allow retry on next request
      throw err;
    });
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    await init();
  } catch (err) {
    console.error("Server init failed:", err);
    return res.status(500).json({ message: "Server initialization failed" });
  }
  app(req, res);
}
