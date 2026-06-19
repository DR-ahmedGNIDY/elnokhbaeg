"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toast";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed bottom-4 start-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.variant];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-card p-4 shadow-card animate-fade-up",
              t.variant === "success" && "border-green-200",
              t.variant === "error" && "border-red-200",
              t.variant === "default" && "border-border",
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0",
                t.variant === "success" && "text-green-600",
                t.variant === "error" && "text-red-600",
                t.variant === "default" && "text-maroon-700",
              )}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
