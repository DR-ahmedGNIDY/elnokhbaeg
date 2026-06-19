import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { articleSchema } from "@/lib/validations/content";
import { ok, resolveError, requireApiAdmin } from "@/lib/api";
import { slugify, truncate } from "@/lib/utils";

export async function GET() {
  try {
    await requireApiAdmin();
    await connectDB();
    return ok(await Article.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    return resolveError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireApiAdmin();
    const data = articleSchema.parse(await req.json());
    await connectDB();
    const article = await Article.create({
      ...data,
      slug: slugify(data.title),
      excerpt: data.excerpt || truncate(data.content.replace(/<[^>]+>/g, ""), 180),
    });
    return ok(article, { status: 201 });
  } catch (err) {
    return resolveError(err);
  }
}
