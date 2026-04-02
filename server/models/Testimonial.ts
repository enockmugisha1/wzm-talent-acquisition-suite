import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;       // 1–5
  active: boolean;
  order: number;        // display order
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name:    { type: String, required: true, trim: true },
    role:    { type: String, default: "", trim: true },
    company: { type: String, required: true, trim: true },
    quote:   { type: String, required: true },
    rating:  { type: Number, default: 5, min: 1, max: 5 },
    active:  { type: Boolean, default: true },
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
