import mongoose, { Schema, Model, Types } from "mongoose";
import { slugify } from "@/lib/utils";

export interface ICourse {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  coverImage?: string | null;
  shortDescription: string;
  fullDescription: string;
  price: number; // 0 = free course
  durationMinutes: number;
  instructor?: Types.ObjectId | null;
  isFeatured: boolean;
  isPublished: boolean;
  lessonsCount: number; // denormalised for fast listing
  enrollmentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    coverImage: { type: String, default: null },
    shortDescription: { type: String, required: true, maxlength: 400 },
    fullDescription: { type: String, default: "" },
    price: { type: Number, default: 0, min: 0 },
    durationMinutes: { type: Number, default: 0, min: 0 },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      default: null,
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    lessonsCount: { type: Number, default: 0 },
    enrollmentsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CourseSchema.index({ title: "text", shortDescription: "text" });

CourseSchema.pre("validate", function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
