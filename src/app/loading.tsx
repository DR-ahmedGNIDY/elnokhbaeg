import { LogoMark } from "@/components/brand/logo";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="animate-pulse">
        <LogoMark size={64} />
      </div>
      <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
    </div>
  );
}
