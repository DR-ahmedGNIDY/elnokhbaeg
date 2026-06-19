"use client";

import { useState } from "react";
import { Loader2, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";

export interface SettingsData {
  about: {
    intro: string;
    vision: string;
    mission: string;
    goals: string[];
    specialties: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    mapEmbedUrl: string;
  };
}

export function SettingsManager({ initial }: { initial: SettingsData }) {
  const [data, setData] = useState<SettingsData>(initial);
  const [saving, setSaving] = useState(false);

  function setAbout<K extends keyof SettingsData["about"]>(
    key: K,
    value: SettingsData["about"][K],
  ) {
    setData((d) => ({ ...d, about: { ...d.about, [key]: value } }));
  }
  function setContact<K extends keyof SettingsData["contact"]>(
    key: K,
    value: SettingsData["contact"][K],
  ) {
    setData((d) => ({ ...d, contact: { ...d.contact, [key]: value } }));
  }

  async function save() {
    try {
      setSaving(true);
      await api.put("/api/admin/settings", {
        about: data.about,
        contact: data.contact,
      });
      toast.success("تم حفظ الإعدادات");
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="تحرير محتوى صفحة «من نحن» وبيانات التواصل."
        action={
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ التغييرات
          </Button>
        }
      />

      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">من نحن</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <Field label="نبذة عن المؤسسة">
              <Textarea rows={3} value={data.about.intro} onChange={(e) => setAbout("intro", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الرؤية">
                <Textarea rows={3} value={data.about.vision} onChange={(e) => setAbout("vision", e.target.value)} />
              </Field>
              <Field label="الرسالة">
                <Textarea rows={3} value={data.about.mission} onChange={(e) => setAbout("mission", e.target.value)} />
              </Field>
            </div>
            <Field label="نبذة عن التخصصات">
              <Textarea rows={2} value={data.about.specialties} onChange={(e) => setAbout("specialties", e.target.value)} />
            </Field>
            <GoalsEditor goals={data.about.goals} onChange={(goals) => setAbout("goals", goals)} />
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
            <Field label="الهاتف">
              <Input dir="ltr" value={data.contact.phone} onChange={(e) => setContact("phone", e.target.value)} />
            </Field>
            <Field label="البريد الإلكتروني">
              <Input dir="ltr" value={data.contact.email} onChange={(e) => setContact("email", e.target.value)} />
            </Field>
            <Field label="العنوان" full>
              <Input value={data.contact.address} onChange={(e) => setContact("address", e.target.value)} />
            </Field>
            <Field label="رابط خريطة جوجل (Embed URL)" full>
              <Input dir="ltr" value={data.contact.mapEmbedUrl} onChange={(e) => setContact("mapEmbedUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
            </Field>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function GoalsEditor({
  goals,
  onChange,
}: {
  goals: string[];
  onChange: (goals: string[]) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div>
      <Label className="mb-1.5 block">أهداف المؤسسة</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="أضف هدفاً ثم اضغط +"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.trim()) {
                onChange([...goals, value.trim()]);
                setValue("");
              }
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            if (value.trim()) {
              onChange([...goals, value.trim()]);
              setValue("");
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ul className="mt-3 space-y-2">
        {goals.map((g, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-sm">
            <span>{g}</span>
            <button
              type="button"
              onClick={() => onChange(goals.filter((_, idx) => idx !== i))}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
