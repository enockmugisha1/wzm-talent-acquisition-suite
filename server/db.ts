import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wzm_hr";

// Cache connection across serverless invocations
let cached = (global as any).__mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
if (!cached) {
  cached = (global as any).__mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 5,
    }).then((m) => {
      console.log("[mongodb] MongoDB connected");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
