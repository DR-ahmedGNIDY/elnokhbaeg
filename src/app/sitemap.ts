import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import { Course } from "@/models/Course";
import { Article } from "@/models/Article";
import { Instructor } from "@/models/Instructor";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/courses",
    "/instructors",
    "/articles",
    "/verify",
    "/contact",
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly", priority: 0.8 }));

  try {
    await connectDB();
    const [courses, articles, instructors] = await Promise.all([
      Course.find({ isPublished: true }).select("slug updatedAt").lean(),
      Article.find({ isPublished: true }).select("slug updatedAt").lean(),
      Instructor.find({ isActive: true }).select("slug updatedAt").lean(),
    ]);

    return [
      ...staticRoutes,
      ...courses.map((c) => ({
        url: `${base}/courses/${c.slug}`,
        lastModified: c.updatedAt,
      })),
      ...articles.map((a) => ({
        url: `${base}/articles/${a.slug}`,
        lastModified: a.updatedAt,
      })),
      ...instructors.map((i) => ({
        url: `${base}/instructors/${i.slug}`,
        lastModified: i.updatedAt,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
