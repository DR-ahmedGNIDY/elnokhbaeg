import mongoose, { Schema, Model, Types } from "mongoose";
import { nextSequence } from "./Counter";
import { CODE_PREFIX } from "@/lib/constants";

/**
 * A certified student record. Each record = ONE course for ONE student and
 * carries its own unique NOK code. The same person taking another course
 * produces a brand-new independent record with a new code.
 */
export interface IApprovedStudent {
  _id: Types.ObjectId;
  code: string; // NOK00001 …
  name: string;
  nationalId: string;
  photo?: string | null;
  courseName: string; // entered manually, NOT linked to Course collection
  approvalDate: Date;
  status: "approved";
  createdAt: Date;
  updatedAt: Date;
}

const ApprovedStudentSchema = new Schema<IApprovedStudent>(
  {
    code: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    nationalId: { type: String, required: true, trim: true, index: true },
    photo: { type: String, default: null },
    courseName: { type: String, required: true, trim: true },
    approvalDate: { type: Date, required: true, default: Date.now },
    status: { type: String, default: "approved" },
  },
  { timestamps: true },
);

ApprovedStudentSchema.index({ name: "text", nationalId: "text" });

/** Generate the sequential NOK code before the first save. */
ApprovedStudentSchema.pre("validate", async function (next) {
  if (this.isNew && !this.code) {
    const seq = await nextSequence("approvedStudentCode");
    this.code = `${CODE_PREFIX}${String(seq).padStart(5, "0")}`;
  }
  next();
});

export const ApprovedStudent: Model<IApprovedStudent> =
  mongoose.models.ApprovedStudent ||
  mongoose.model<IApprovedStudent>("ApprovedStudent", ApprovedStudentSchema);
