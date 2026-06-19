"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Ban,
  Loader2,
  Eye,
  Trash2,
  FileSpreadsheet,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { exportToExcel } from "@/lib/export";
import { formatDate } from "@/lib/utils";
import {
  PROVIDER_LABELS,
  USER_STATUS_LABELS,
  type UserStatus,
} from "@/lib/constants";

export interface UserRow {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  provider: "credentials" | "google";
  role: "admin" | "student";
  status: UserStatus;
  lastLogin?: string | null;
  createdAt: string;
}

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "student", label: "الطلاب" },
  { key: "admin", label: "المشرفون" },
  { key: "google", label: "عبر Google" },
  { key: "credentials", label: "عبر البريد" },
] as const;

const statusVariant: Record<UserStatus, "success" | "warning" | "destructive"> = {
  active: "success",
  suspended: "warning",
  blocked: "destructive",
};

export function UsersManager({
  initial,
  currentUserId,
}: {
  initial: UserRow[];
  currentUserId: string;
}) {
  const [rows, setRows] = useState<UserRow[]>(initial);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: rows.length,
      students: rows.filter((r) => r.role === "student").length,
      google: rows.filter((r) => r.provider === "google").length,
      active: rows.filter((r) => r.status === "active").length,
      suspended: rows.filter((r) => r.status !== "active").length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "student":
        return rows.filter((r) => r.role === "student");
      case "admin":
        return rows.filter((r) => r.role === "admin");
      case "google":
        return rows.filter((r) => r.provider === "google");
      case "credentials":
        return rows.filter((r) => r.provider === "credentials");
      default:
        return rows;
    }
  }, [rows, filter]);

  function applyUpdate(updated: UserRow) {
    setRows((r) => r.map((x) => (x._id === updated._id ? { ...x, ...updated } : x)));
  }

  async function changeField(
    id: string,
    data: Partial<Pick<UserRow, "role" | "status">>,
  ) {
    try {
      const updated = await api.put<UserRow>(`/api/admin/users/${id}`, data);
      applyUpdate(updated);
      toast.success("تم تحديث المستخدم");
    } catch (err) {
      toast.error("تعذّر التحديث", (err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await api.del(`/api/admin/users/${deleteId}`);
    setRows((r) => r.filter((x) => x._id !== deleteId));
    toast.success("تم حذف المستخدم");
    setDeleteId(null);
  }

  function handleExport() {
    exportToExcel(
      rows.map((r) => ({
        "الاسم": r.name,
        "البريد الإلكتروني": r.email,
        "طريقة التسجيل": PROVIDER_LABELS[r.provider],
        "الدور": r.role === "admin" ? "مشرف" : "طالب",
        "الحالة": USER_STATUS_LABELS[r.status],
        "تاريخ التسجيل": formatDate(r.createdAt),
      })),
      "المستخدمون",
      "Users",
    );
  }

  const detailUser = rows.find((r) => r._id === detailId) ?? null;

  const columns: ColumnDef<UserRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "المستخدم",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-secondary">
            {row.original.avatar ? (
              <Image src={row.original.avatar} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-maroon-400">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "provider",
      header: "التسجيل",
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "google" ? "gold" : "secondary"}>
          {PROVIDER_LABELS[getValue() as string]}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "الدور",
      cell: ({ getValue }) =>
        getValue() === "admin" ? (
          <Badge>مشرف</Badge>
        ) : (
          <Badge variant="outline">طالب</Badge>
        ),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ getValue }) => {
        const s = getValue() as UserStatus;
        return <Badge variant={statusVariant[s]}>{USER_STATUS_LABELS[s]}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ التسجيل",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      id: "actions",
      header: "العمليات",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setDetailId(row.original._id)}>
            <Eye className="h-4 w-4" />
          </Button>
          {row.original._id !== currentUserId && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => setDeleteId(row.original._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="المستخدمون" description="إدارة حسابات الطلاب والمشرفين." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="إجمالي المستخدمين" value={stats.total} icon={Users} />
        <StatCard label="الطلاب" value={stats.students} icon={UserCheck} />
        <StatCard label="حسابات Google" value={stats.google} icon={ShieldCheck} />
        <StatCard label="النشطون" value={stats.active} icon={UserCheck} />
        <StatCard label="الموقوفون" value={stats.suspended} icon={Ban} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="ابحث بالاسم أو البريد…"
        filters={
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? "default" : "outline"}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        }
        toolbar={
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4" /> تصدير Excel
          </Button>
        }
      />

      {/* Detail / management dialog */}
      <Dialog open={!!detailId} onOpenChange={(v) => !v && setDetailId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          {detailUser && (
            <UserDetail
              user={detailUser}
              isSelf={detailUser._id === currentUserId}
              onRole={(role) => changeField(detailUser._id, { role })}
              onStatus={(status) => changeField(detailUser._id, { status })}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        description="سيتم حذف المستخدم وجميع اشتراكاته نهائياً."
        onConfirm={handleDelete}
      />
    </div>
  );
}

function UserDetail({
  user,
  isSelf,
  onRole,
  onStatus,
}: {
  user: UserRow;
  isSelf: boolean;
  onRole: (role: "admin" | "student") => void;
  onStatus: (status: UserStatus) => void;
}) {
  const [detail, setDetail] = useState<{ purchasedCount: number } | null>(null);

  useEffect(() => {
    api
      .get<{ purchasedCount: number }>(`/api/admin/users/${user._id}`)
      .then((d) => setDetail({ purchasedCount: d.purchasedCount }))
      .catch(() => setDetail({ purchasedCount: 0 }));
  }, [user._id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-secondary">
          {user.avatar ? (
            <Image src={user.avatar} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-bold text-maroon-300">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="font-display text-lg font-bold text-maroon-900">{user.name}</p>
          <p className="text-sm text-muted-foreground" dir="ltr">
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="طريقة التسجيل" value={PROVIDER_LABELS[user.provider]} />
        <Info label="الدورات المشتراة" value={detail ? String(detail.purchasedCount) : "…"} />
        <Info label="تاريخ الإنشاء" value={formatDate(user.createdAt)} />
        <Info label="آخر دخول" value={user.lastLogin ? formatDate(user.lastLogin) : "—"} />
      </div>

      {isSelf ? (
        <p className="rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
          لا يمكنك تعديل دور أو حالة حسابك الخاص.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">الدور</label>
            <Select value={user.role} onValueChange={(v) => onRole(v as "admin" | "student")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">طالب</SelectItem>
                <SelectItem value="admin">مشرف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">الحالة</label>
            <Select value={user.status} onValueChange={(v) => onStatus(v as UserStatus)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="suspended">موقوف</SelectItem>
                <SelectItem value="blocked">محظور</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold text-foreground">{value}</p>
    </div>
  );
}
