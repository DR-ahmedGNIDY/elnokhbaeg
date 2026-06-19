import { listUsers } from "@/lib/data/admin";
import { requireAdmin } from "@/lib/session";
import { UsersManager, type UserRow } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  const rows = (await listUsers()) as unknown as UserRow[];
  return <UsersManager initial={rows} currentUserId={admin.id} />;
}
