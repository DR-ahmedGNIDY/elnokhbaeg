import { listApprovedStudents } from "@/lib/data/admin";
import {
  ApprovedStudentsManager,
  type ApprovedRow,
} from "@/components/admin/approved-students-manager";

export const dynamic = "force-dynamic";

export default async function AdminApprovedStudentsPage() {
  const rows = (await listApprovedStudents()) as unknown as ApprovedRow[];
  return <ApprovedStudentsManager initial={rows} />;
}
