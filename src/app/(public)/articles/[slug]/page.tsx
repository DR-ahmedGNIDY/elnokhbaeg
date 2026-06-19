import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, User } from "lucide-react";
import { getArticleBySlug } from "@/lib/data/articles";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getArticleBySlug(slug)) as { title: string; excerpt?: string } | null;
  return a ? { title: a.title, description: a.excerpt } : { title: "المقال" };
}

export default async function ArticleDetailsPage({ params }: Props) {
  const { slug } = await params;
  const article = (await getArticleBySlug(slug)) as never as {
    title: string;
    content: string;
    image?: string | null;
    author?: string;
    publishedAt: string;
  } | null;
  if (!article) notFound();

  return (
    <article className="pb-16">
      <div className="container max-w-3xl">
        <header className="pt-12 text-center">
          <h1 className="heading-display text-3xl md:text-4xl">{article.title}</h1>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {article.author || "مؤسسة النخبة"}
            </span>
          </div>
        </header>

        {article.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image src={article.image} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-line leading-loose text-foreground/85">
          {article.content}
        </div>
      </div>
    </article>
  );
}
