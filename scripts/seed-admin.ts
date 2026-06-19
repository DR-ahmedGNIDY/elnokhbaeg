/**
 * Creates (or promotes) the bootstrap admin account.
 * Usage: npm run seed:admin
 * Reads SEED_ADMIN_* and MONGODB_URI from .env.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Minimal .env loader (avoids extra deps).
function loadEnv() {
  try {
    const file = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env file */
  }
}

async function main() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI غير مضبوط في .env");

  const name = process.env.SEED_ADMIN_NAME ?? "مدير المؤسسة";
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@elite-cs.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  await mongoose.connect(uri);

  const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
  const User = mongoose.models.User || mongoose.model("User", UserSchema, "users");

  const hashed = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    await User.updateOne(
      { email },
      { $set: { role: "admin", status: "active", password: hashed } },
    );
    console.log(`✓ تم تحديث الحساب الحالي ليصبح مشرفاً: ${email}`);
  } else {
    await User.create({
      name,
      email,
      password: hashed,
      provider: "credentials",
      role: "admin",
      status: "active",
    });
    console.log(`✓ تم إنشاء حساب المشرف: ${email}`);
  }

  console.log(`  كلمة المرور: ${password}`);
  console.log("  يُنصح بتغييرها بعد أول تسجيل دخول.");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ فشل إنشاء حساب المشرف:", err.message);
  process.exit(1);
});
