import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-maroon-700">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div>
        <p className="font-display text-2xl font-bold text-maroon-900">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
