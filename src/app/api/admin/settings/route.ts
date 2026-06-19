import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Settings, getSettings } from "@/models/Settings";
import { settingsSchema } from "@/lib/validations/content";
import { ok, resolveError, requireApiAdmin } from "@/lib/api";

export async function GET() {
  try {
    await requireApiAdmin();
    await connectDB();
    return ok(await getSettings());
  } catch (err) {
    return resolveError(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = settingsSchema.parse(await req.json());
    await connectDB();
    const updated = await Settings.findByIdAndUpdate(
      "site",
      { $set: data },
      { new: true, upsert: true },
    ).lean();
    return ok(updated);
  } catch (err) {
    return resolveError(err);
  }
}
