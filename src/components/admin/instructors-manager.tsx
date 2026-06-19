"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { instructorSchema, type InstructorInput } from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";

export interface InstructorRow {
  _id: string;
  name: string;
  title: string;
  shortBio: string;
  bio: string;
  avatar?: string | null;
  yearsOfExperience: number;
  specialty: string;
  isActive: boolean;
}

export function InstructorsManager({ initial }: { initial: InstructorRow[] }) {
  const [rows, setRows] = useState<InstructorRow[]>(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InstructorRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InstructorInput>({ resolver: zodResolver(instructorSchema) });

  function openCreate() {
    setEditing(null);
    setAvatar("");
    reset({ name: "", title: "", shortBio: "", bio: "", specialty: "", yearsOfExperience: 0, isActive: true });
    setDialogOpen(true);
  }

  function openEdit(row: InstructorRow) {
    setEditing(row);
    setAvatar(row.avatar ?? "");
    reset({
      name: row.name,
      title: row.title,
      shortBio: row.shortBio,
      bio: row.bio,
      specialty: row.specialty,
      yearsOfExperience: row.yearsOfExperience,
      isActive: row.isActive,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: InstructorInput) {
    try {
      const payload = { ...values, avatar };
      if (editing) {
        const updated = await api.put<InstructorRow>(
          `/api/admin/instructors/${editing._id}`,
          payload,
        );
        setRows((r) => r.map((x) => (x._id === editing._id ? updated : x)));
        toast.success("تم تحديث المحاضر");
      } else {
        const created = await api.post<InstructorRow>("/api/admin/instructors", payload);
        setRows((r) => [created, ...r]);
        toast.success("تمت إضافة المحاضر");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await api.del(`/api/admin/instructors/${deleteId}`);
    setRows((r) => r.filter((x) => x._id !== deleteId));
    toast.success("تم حذف المحاضر");
    setDeleteId(null);
  }

  const columns: ColumnDef<InstructorRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "المحاضر",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
            {row.original.avatar ? (
              <Image src={row.original.avatar} alt={row.original.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-maroon-400">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "title", header: "المسمى الوظيفي" },
    {
      accessorKey: "yearsOfExperience",
      header: "الخبرة",
      cell: ({ getValue }) => `${getValue() as number} سنة`,
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ getValue }) =>
        getValue() ? (
          <Badge variant="success">نشط</Badge>
        ) : (
          <Badge variant="outline">مخفي</Badge>
        ),
    },
    {
      id: "actions",
      header: "العمليات",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => setDeleteId(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المحاضرون"
        description="إدارة المحاضرين الذين يظهرون في الموقع."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة محاضر
          </Button>
        }
      />

      <DataTable columns={columns} data={rows} searchPlaceholder="ابحث بالاسم أو المسمى…" />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل محاضر" : "إضافة محاضر"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <MediaUpload
              folder="instructors"
              type="image"
              value={avatar}
              onChange={(url) => setAvatar(url)}
              label="صورة المحاضر"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>الاسم</Label>
                <Input className="mt-1.5" {...register("name")} />
                <FieldError message={errors.name?.message} />
              </div>
              <div>
                <Label>المسمى الوظيفي</Label>
                <Input className="mt-1.5" {...register("title")} />
                <FieldError message={errors.title?.message} />
              </div>
              <div>
                <Label>سنوات الخبرة</Label>
                <Input type="number" className="mt-1.5" {...register("yearsOfExperience")} />
                <FieldError message={errors.yearsOfExperience?.message} />
              </div>
              <div>
                <Label>التخصص</Label>
                <Input className="mt-1.5" {...register("specialty")} />
              </div>
            </div>
            <div>
              <Label>نبذة مختصرة</Label>
              <Textarea rows={2} className="mt-1.5" {...register("shortBio")} />
              <FieldError message={errors.shortBio?.message} />
            </div>
            <div>
              <Label>السيرة الذاتية</Label>
              <Textarea rows={4} className="mt-1.5" {...register("bio")} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "حفظ التعديلات" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        description="سيتم حذف المحاضر نهائياً وإلغاء ربطه بالدورات."
        onConfirm={handleDelete}
      />
    </div>
  );
}
