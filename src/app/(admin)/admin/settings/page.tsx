import { getSettings } from "@/models/Settings";
import { serialize } from "@/lib/serialize";
import { SettingsManager, type SettingsData } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = serialize(await getSettings());
  const data: SettingsData = {
    about: {
      intro: settings.about?.intro ?? "",
      vision: settings.about?.vision ?? "",
      mission: settings.about?.mission ?? "",
      goals: settings.about?.goals ?? [],
      specialties: settings.about?.specialties ?? "",
    },
    contact: {
      phone: settings.contact?.phone ?? "",
      email: settings.contact?.email ?? "",
      address: settings.contact?.address ?? "",
      mapEmbedUrl: settings.contact?.mapEmbedUrl ?? "",
    },
  };
  return <SettingsManager initial={data} />;
}
