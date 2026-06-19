"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Copy,
  Check,
  FileSpreadsheet,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { MediaUpload } from "@/components/shared/media-upload";
import { FieldError } from "@/components/shared/field-error";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  approvedStudentSchema,
  type ApprovedStudentInput,
} from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { exportToExcel } from "@/lib/export";
import { formatDate } from "@/lib/utils";

export interface ApprovedRow {
  _id: string;
  code: string;
  name: string;
  nationalId: string;
  photo?: string | null;
  courseName: string;
  approvalDate: string;
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("تم نسخ الكود", code);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 font-mono text-sm font-semibold text-maroon-800 hover:bg-accent"
    >
      {code}
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function ApprovedStudentsManager({ initial }: { initial: ApprovedRow[] }) {
  const [rows, setRows] = useState<ApprovedRow[]>(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ApprovedRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [photo, setPhoto] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApprovedStudentInput>({ resolver: zodResolver(approvedStudentSchema) });

  function openCreate() {
    setEditing(null);
    setPhoto("");
    reset({
      name: "",
      nationalId: "",
      courseName: "",
      approvalDate: new Date(),
    });
    setDialogOpen(true);
  }

  function openEdit(row: ApprovedRow) {
    setEditing(row);
    setPhoto(row.photo ?? "");
    reset({
      name: row.name,
      nationalId: row.nationalId,
      courseName: row.courseName,
      approvalDate: new Date(row.approvalDate),
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ApprovedStudentInput) {
    try {
      const payload = { ...values, photo };
      if (editing) {
        const updated = await api.put<ApprovedRow>(
          `/api/admin/approved-students/${editing._id}`,
          payload,
        );
        setRows((r) => r.map((x) => (x._id === editing._id ? updated : x)));
        toast.success("تم تحديث السجل");
      } else {
        const created = await api.post<ApprovedRow>("/api/admin/approved-students", payload);
        setRows((r) => [created, ...r]);
        toast.success("تمت إضافة الطالب", `الكود: ${created.code}`);
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await api.del(`/api/admin/approved-students/${deleteId}`);
    setRows((r) => r.filter((x) => x._id !== deleteId));
    toast.success("تم حذف السجل");
    setDeleteId(null);
  }

  function handleExport() {
    exportToExcel(
      rows.map((r) => ({
        "الكود": r.code,
        "الاسم": r.name,
        "الرقم القومي": r.nationalId,
        "اسم الكورس": r.courseName,
        "تاريخ الاعتماد": formatDate(r.approvalDate),
      })),
      "الطلاب-المعتمدون",
      "ApprovedStudents",
    );
  }

  const columns: ColumnDef<ApprovedRow, unknown>[] = [
    {
      accessorKey: "code",
      header: "الكود",
      cell: ({ getValue }) => <CopyCode code={getValue() as string} />,
    },
    {
      accessorKey: "name",
      header: "الطالب",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-secondary">
            {row.original.photo ? (
              <Image src={row.original.photo} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-maroon-400">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "nationalId", header: "الرقم القومي" },
    { accessorKey: "courseName", header: "اسم الكورس" },
    {
      accessorKey: "approvalDate",
      header: "تاريخ الاعتماد",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      id: "actions",
      header: "العمليات",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(row.original._id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="الطلاب المعتمدون"
        description="كل سجل يمثّل كورساً واحداً بكود فريد. إضافة نفس الطالب لكورس آخر تُنشئ سجلاً وكوداً جديدين."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة طالب معتمد
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="إجمالي السجلات المعتمدة" value={rows.length} icon={User} />
      </div>

      <DataTable
        columns={columns}
        data={rows}
        searchPlaceholder="ابحث بالاسم أو الرقم القومي…"
        toolbar={
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="h-4 w-4" /> تصدير Excel
          </Button>
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل سجل" : "إضافة طالب معتمد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <MediaUpload folder="students" type="image" value={photo} onChange={(u) => setPhoto(u)} label="صورة الطالب" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>اسم الطالب</Label>
                <Input className="mt-1.5" {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label>الرقم القومي</Label>
                <Input dir="ltr" className="mt-1.5" {...register("nationalId")} />
                <FieldError message={errors.nationalId?.message} />
              </div>
              <div>
                <Label>اسم الكورس</Label>
                <Input className="mt-1.5" {...register("courseName")} />
                <FieldError message={errors.courseName?.message} />
              </div>
              <div>
                <Label>تاريخ الاعتماد</Label>
                <Input type="date" className="mt-1.5" {...register("approvalDate")} />
                <FieldError message={errors.approvalDate?.message} />
              </div>
            </div>
            {!editing && (
              <p className="rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
                سيتم توليد كود الاعتماد تلقائياً (مثل NOK00001) عند الحفظ.
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ التعديلات" : "إضافة وتوليد كود"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        description="سيتم حذف سجل الاعتماد نهائياً."
        onConfirm={handleDelete}
      />
    </div>
  );
}
