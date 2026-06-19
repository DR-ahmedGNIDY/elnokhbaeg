import mongoose, { Schema, Model, Types } from "mongoose";
import { PAYMENT_STATUS, type PaymentStatus } from "@/lib/constants";

export interface IEnrollment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  course: Types.ObjectId;
  purchaseDate: Date;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  lastLessonViewed?: Types.ObjectId | null;
  completedLessons: Types.ObjectId[];
  progress: number; // 0–100
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    purchaseDate: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PAID,
    },
    amountPaid: { type: Number, default: 0 },
    lastLessonViewed: {
      type: Schema.Types.ObjectId,
      ref: "CourseLesson",
      default: null,
    },
    completedLessons: [
      { type: Schema.Types.ObjectId, ref: "CourseLesson" },
    ],
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
);

// A student can only enrol in a given course once.
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
