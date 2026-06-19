import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/data/articles";
import { ArticleCard } from "@/components/shared/article-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = { title: "المقالات" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = (await getPublishedArticles()) as never as {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    image?: string | null;
    publishedAt: string;
  }[];

  return (
    <div className="pb-16">
      <section className="brand-gradient py-14 text-center text-white">
        <div className="container">
          <h1 className="font-display text-4xl font-bold">المقالات</h1>
          <p className="mt-3 text-beige-100/85">
            معرفة ومقالات في عالم الطب والعلوم الصينية.
          </p>
        </div>
      </section>

      <div className="container mt-12">
        {articles.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="لا توجد مقالات بعد"
            description="ستظهر المقالات هنا فور نشرها من لوحة التحكم."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
