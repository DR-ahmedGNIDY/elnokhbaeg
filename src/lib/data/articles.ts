import "server-only";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { serialize } from "@/lib/serialize";

export async function getPublishedArticles(limit?: number) {
  await connectDB();
  let q = Article.find({ isPublished: true })
    .select("title slug image excerpt author publishedAt")
    .sort({ publishedAt: -1 });
  if (limit) q = q.limit(limit);
  return serialize(await q.lean());
}

export async function getArticleBySlug(slug: string) {
  await connectDB();
  const doc = await Article.findOne({ slug, isPublished: true }).lean();
  return doc ? serialize(doc) : null;
}
