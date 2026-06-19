import { getFeaturedCourses } from "@/lib/data/courses";
import { getActiveInstructors } from "@/lib/data/instructors";
import { getPublishedArticles } from "@/lib/data/articles";
import { getSettings } from "@/models/Settings";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import { HeroDesktop } from "@/components/home/hero-desktop";
import { HeroMobile } from "@/components/home/hero-mobile";
import {
  FeaturedCourses,
  InstructorsPreview,
  ArticlesPreview,
  AboutBrief,
} from "@/components/home/content-sections";
import { WhyUs, StatsSection, CtaSection } from "@/components/home/feature-sections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();
  const [courses, instructorsRaw, articlesRaw, settings] = await Promise.all([
    getFeaturedCourses(6),
    getActiveInstructors(),
    getPublishedArticles(3),
    getSettings(),
  ]);

  const instructors = serialize(instructorsRaw) as never[];
  const articles = serialize(articlesRaw) as never[];
  const stats = settings.stats;

  return (
    <>
      <HeroDesktop stats={stats} />
      <HeroMobile />

      {/* ── Mobile ordering: courses → about → instructors → articles ── */}
      <div className="lg:hidden">
        <FeaturedCourses courses={courses} />
        <AboutBrief intro={settings.about?.intro} />
        <InstructorsPreview instructors={instructors} />
        <ArticlesPreview articles={articles} />
        <StatsSection stats={stats} />
        <CtaSection />
      </div>

      {/* ── Desktop ordering: about → courses → why → instructors → stats → articles → cta ── */}
      <div className="hidden lg:block">
        <AboutBrief intro={settings.about?.intro} />
        <FeaturedCourses courses={courses} />
        <WhyUs />
        <InstructorsPreview instructors={instructors} />
        <StatsSection stats={stats} />
        <ArticlesPreview articles={articles} />
        <CtaSection />
      </div>
    </>
  );
}
