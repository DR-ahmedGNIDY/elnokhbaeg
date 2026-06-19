import mongoose, { Schema, Model, Types } from "mongoose";

export interface ICourseLesson {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  title: string;
  videoUrl: string; // Cloudinary video URL
  videoPublicId?: string | null;
  durationMinutes: number;
  order: number;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseLessonSchema = new Schema<ICourseLesson>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, default: "" },
    videoPublicId: { type: String, default: null },
    durationMinutes: { type: Number, default: 0, min: 0 },
    order: { type: Number, default: 1 },
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true },
);

CourseLessonSchema.index({ course: 1, order: 1 });

export const CourseLesson: Model<ICourseLesson> =
  mongoose.models.CourseLesson ||
  mongoose.model<ICourseLesson>("CourseLesson", CourseLessonSchema);
