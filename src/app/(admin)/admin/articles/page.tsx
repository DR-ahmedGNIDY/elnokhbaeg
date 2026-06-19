import { listArticlesAdmin } from "@/lib/data/admin";
import { ArticlesManager, type ArticleRow } from "@/components/admin/articles-manager";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const rows = (await listArticlesAdmin()) as unknown as ArticleRow[];
  return <ArticlesManager initial={rows} />;
}
