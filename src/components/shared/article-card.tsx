import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ArticleCardData {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string | null;
  publishedAt: string | Date;
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-maroon-300">
            <Newspaper className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(article.publishedAt)}
        </span>
        <h3 className="mt-2 font-display text-lg font-bold text-maroon-900 line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <span className="mt-4 text-sm font-semibold text-maroon-600">
          اقرأ المزيد ←
        </span>
      </div>
    </Link>
  );
}
