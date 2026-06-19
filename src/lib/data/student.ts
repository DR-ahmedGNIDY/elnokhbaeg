import "server-only";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { serialize } from "@/lib/serialize";

export async function getStudentProfile(userId: string) {
  await connectDB();
  const user = await User.findById(userId)
    .select("name email avatar provider createdAt")
    .lean();
  return user ? serialize(user) : null;
}
