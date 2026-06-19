import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { GraduationCap, Briefcase, Award, BookOpen } from "lucide-react";
import { getInstructorBySlug } from "@/lib/data/instructors";
import { getInstructorCourses } from "@/lib/data/courses";
import { CourseCard } from "@/components/shared/course-card";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inst = (await getInstructorBySlug(slug)) as { name: string; title: string } | null;
  return inst ? { title: inst.name, description: inst.title } : { title: "المحاضر" };
}

export default async function InstructorDetailsPage({ params }: Props) {
  const { slug } = await params;
  const instructor = (await getInstructorBySlug(slug)) as never as {
    _id: string;
    name: string;
    title: string;
    shortBio: string;
    bio: string;
    avatar?: string | null;
    yearsOfExperience: number;
    specialty: string;
  } | null;
  if (!instructor) notFound();

  const courses = await getInstructorCourses(instructor._id);

  return (
    <div className="pb-16">
      <section className="brand-gradient py-14 text-white">
        <div className="container flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-start">
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10">
            {instructor.avatar ? (
              <Image src={instructor.avatar} alt={instructor.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-beige-200">
                <GraduationCap className="h-12 w-12" />
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{instructor.name}</h1>
            <p className="mt-1 text-beige-200">{instructor.title}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {instructor.yearsOfExperience > 0 && (
                <Badge variant="gold" className="gap-1">
                  <Briefcase className="h-3 w-3" /> {instructor.yearsOfExperience} سنوات خبرة
                </Badge>
              )}
              {instructor.specialty && (
                <Badge variant="gold" className="gap-1">
                  <Award className="h-3 w-3" /> {instructor.specialty}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-12 space-y-12">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h2 className="heading-display text-2xl">السيرة الذاتية</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/80">
            {instructor.bio || instructor.shortBio}
          </p>
        </section>

        {courses.length > 0 && (
          <section>
            <h2 className="heading-display mb-6 flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-maroon-600" /> الدورات التي يقدّمها
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
