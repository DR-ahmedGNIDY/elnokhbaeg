import mongoose, { Schema, Model, Types } from "mongoose";
import {
  ROLES,
  USER_STATUS,
  AUTH_PROVIDERS,
  type Role,
  type UserStatus,
} from "@/lib/constants";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string | null; // hashed; null for OAuth-only accounts
  googleId?: string | null;
  provider: "credentials" | "google";
  avatar?: string | null;
  role: Role;
  status: UserStatus;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, default: null, select: false },
    googleId: { type: String, default: null },
    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.CREDENTIALS,
    },
    avatar: { type: String, default: null },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    resetToken: { type: String, default: null, select: false },
    resetTokenExpiry: { type: Date, default: null, select: false },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.index({ name: "text", email: "text" });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
