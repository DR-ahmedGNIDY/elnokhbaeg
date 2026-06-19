import { listCoursesAdmin, listInstructorOptions } from "@/lib/data/admin";
import { CoursesManager, type CourseRow } from "@/components/admin/courses-manager";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [rows, instructors] = await Promise.all([
    listCoursesAdmin(),
    listInstructorOptions(),
  ]);
  return (
    <CoursesManager
      initial={rows as unknown as CourseRow[]}
      instructors={instructors as unknown as { _id: string; name: string }[]}
    />
  );
}
