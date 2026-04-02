import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
  mustChangePassword: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, default: "" },
    role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
    mustChangePassword: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);
