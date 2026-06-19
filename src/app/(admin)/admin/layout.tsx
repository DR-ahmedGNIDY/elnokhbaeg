import { requireAdmin } from "@/lib/session";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
