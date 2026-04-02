import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  jobId?: mongoose.Types.ObjectId;
  cvFilename: string;       // original file name shown to admin
  cvStoredName: string;     // hashed file name on disk
  cvMimeType: string;
  status: "new" | "reviewed" | "shortlisted" | "rejected";
  submittedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    cvFilename: { type: String, required: true },
    cvStoredName: { type: String, required: true },
    cvMimeType: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected"],
      default: "new",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ApplicationModel = mongoose.model<IApplication>("Application", ApplicationSchema);
