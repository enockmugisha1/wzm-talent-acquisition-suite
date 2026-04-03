import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wzm_hr";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[mongodb] MongoDB connected: ${MONGO_URI}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
