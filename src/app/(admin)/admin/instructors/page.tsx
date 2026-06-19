import { listInstructorsAdmin } from "@/lib/data/admin";
import {
  InstructorsManager,
  type InstructorRow,
} from "@/components/admin/instructors-manager";

export const dynamic = "force-dynamic";

export default async function AdminInstructorsPage() {
  const rows = (await listInstructorsAdmin()) as unknown as InstructorRow[];
  return <InstructorsManager initial={rows} />;
}
