import mongoose, { Schema, Model } from "mongoose";

/** Singleton document holding editable site-wide content. */
export interface ISettings {
  _id: string;
  about: {
    intro: string;
    vision: string;
    mission: string;
    goals: string[];
    specialties: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    mapEmbedUrl: string;
  };
  stats: {
    students: number;
    courses: number;
    instructors: number;
    certificates: number;
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    _id: { type: String, default: "site" },
    about: {
      intro: { type: String, default: "" },
      vision: { type: String, default: "" },
      mission: { type: String, default: "" },
      goals: { type: [String], default: [] },
      specialties: { type: String, default: "" },
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      mapEmbedUrl: { type: String, default: "" },
    },
    stats: {
      students: { type: Number, default: 0 },
      courses: { type: Number, default: 0 },
      instructors: { type: Number, default: 0 },
      certificates: { type: Number, default: 0 },
    },
  },
  { timestamps: true, _id: false },
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export async function getSettings(): Promise<ISettings> {
  const existing = await Settings.findById("site").lean<ISettings>();
  if (existing) return existing;
  const created = await Settings.create({ _id: "site" });
  return created.toObject() as ISettings;
}
