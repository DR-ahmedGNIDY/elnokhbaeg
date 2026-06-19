import mongoose, { Schema, Model, Types } from "mongoose";
import { slugify } from "@/lib/utils";

export interface IInstructor {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  title: string; // المسمى الوظيفي
  shortBio: string; // نبذة مختصرة
  bio: string; // السيرة الذاتية الكاملة
  avatar?: string | null;
  yearsOfExperience: number;
  specialty: string;
  social?: {
    facebook?: string;
    linkedin?: string;
    website?: string;
    whatsapp?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstructorSchema = new Schema<IInstructor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    shortBio: { type: String, required: true, maxlength: 300 },
    bio: { type: String, default: "" },
    avatar: { type: String, default: null },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    specialty: { type: String, default: "" },
    social: {
      facebook: String,
      linkedin: String,
      website: String,
      whatsapp: String,
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

InstructorSchema.pre("validate", function (next) {
  if (!this.slug && this.name) this.slug = slugify(this.name);
  next();
});

export const Instructor: Model<IInstructor> =
  mongoose.models.Instructor ||
  mongoose.model<IInstructor>("Instructor", InstructorSchema);
