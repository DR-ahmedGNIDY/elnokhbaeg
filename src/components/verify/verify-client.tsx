"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Loader2,
  BadgeCheck,
  XCircle,
  CalendarDays,
  Hash,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/brand/logo";
import { apiFetch } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

interface VerifyResult {
  code: string;
  name: string;
  photo?: string | null;
  courseName: string;
  approvalDate: string;
  status: string;
}

export function VerifyClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiFetch<VerifyResult>(
        `/api/verify?code=${encodeURIComponent(code.trim())}`,
      );
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="أدخل كود الاعتماد، مثال: NOK00001"
          className="font-mono"
          dir="ltr"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          بحث
        </Button>
      </form>

      {error && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <XCircle className="h-6 w-6 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-card animate-fade-up">
          <div className="flex items-center justify-between bg-maroon-900 px-5 py-3 text-white">
            <div className="flex items-center gap-2">
              <LogoMark size={28} light />
              <span className="text-sm font-semibold">مؤسسة النخبة للعلوم الصينية</span>
            </div>
            <Badge variant="success" className="gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> معتمد
            </Badge>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary sm:mx-0">
              {result.photo ? (
                <Image src={result.photo} alt={result.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-bold text-maroon-300">
                  {result.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="font-display text-xl font-bold text-maroon-900">
                {result.name}
              </h3>
              <Row icon={Hash} label="رقم الاعتماد" value={result.code} mono />
              <Row icon={BookOpen} label="اسم الكورس" value={result.courseName} />
              <Row
                icon={CalendarDays}
                label="تاريخ الاعتماد"
                value={formatDate(result.approvalDate)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-maroon-500" />
      <span className="text-muted-foreground">{label}:</span>
      <span className={mono ? "font-mono font-semibold text-maroon-800" : "font-semibold text-foreground"}>
        {value}
      </span>
    </div>
  );
}
