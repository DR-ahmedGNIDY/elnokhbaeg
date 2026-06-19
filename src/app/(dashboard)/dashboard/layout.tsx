import { requireAuth } from "@/lib/session";
import { SiteHeader } from "@/components/layout/site-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/dashboard");
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30">
      <SiteHeader />
      <main className="container flex-1 py-8">
        <DashboardNav />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
