import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstructorCardData {
  slug: string;
  name: string;
  title: string;
  shortBio: string;
  avatar?: string | null;
}

export function InstructorCard({ instructor }: { instructor: InstructorCardData }) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-secondary">
        {instructor.avatar ? (
          <Image
            src={instructor.avatar}
            alt={instructor.name}
            fill
            sizes="112px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-maroon-400">
            <GraduationCap className="h-10 w-10" />
          </div>
        )}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-maroon-900">
        {instructor.name}
      </h3>
      <p className="text-sm font-medium text-maroon-600">{instructor.title}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
        {instructor.shortBio}
      </p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href={`/instructors/${instructor.slug}`}>عرض الملف الشخصي</Link>
      </Button>
    </div>
  );
}
