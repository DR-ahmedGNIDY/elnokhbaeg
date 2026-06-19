import { requireAuth } from "@/lib/session";
import { getStudentProfile } from "@/lib/data/student";
import { AccountSettings } from "@/components/dashboard/account-settings";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const user = await requireAuth("/dashboard/settings");
  const profile = await getStudentProfile(user.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-maroon-900">
        إعدادات الحساب
      </h1>
      <AccountSettings
        initial={{
          name: profile?.name ?? user.name ?? "",
          email: profile?.email ?? user.email ?? "",
          avatar: profile?.avatar ?? user.image ?? null,
        }}
      />
    </div>
  );
}
