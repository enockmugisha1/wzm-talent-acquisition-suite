import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  location: string;
  type: string;
  description: string;
  deadline: string;   // ISO date string YYYY-MM-DD
  status: "open" | "closed";
  posted: string;     // ISO date string YYYY-MM-DD
  createdBy: mongoose.Types.ObjectId;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    posted: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export const JobModel = mongoose.model<IJob>("Job", JobSchema);
