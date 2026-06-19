"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, BookOpen, ListVideo, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { LessonsDialog } from "@/components/admin/lessons-dialog";
import { MediaUpload } from "@/components/shared/media-upload";
import { FieldError } from "@/components/shared/field-error";
import { PageHeader } from "@/components/admin/page-header";
import { courseSchema, type CourseInput } from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { formatPrice } from "@/lib/utils";

export interface CourseRow {
  _id: string;
  title: string;
  coverImage?: string | null;
  shortDescription: string;
  fullDescription: string;
  price: number;
  durationMinutes: number;
  instructor?: { _id: string; name: string } | string | null;
  isFeatured: boolean;
  isPublished: boolean;
  lessonsCount: number;
}

interface InstructorOption {
  _id: string;
  name: string;
}

export function CoursesManager({
  initial,
  instructors,
}: {
  initial: CourseRow[];
  instructors: InstructorOption[];
}) {
  const [rows, setRows] = useState<CourseRow[]>(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lessonsFor, setLessonsFor] = useState<CourseRow | null>(null);

  const [cover, setCover] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [instructorId, setInstructorId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({ resolver: zodResolver(courseSchema) });

  function openCreate() {
    setEditing(null);
    setCover("");
    setFeatured(false);
    setPublished(true);
    setInstructorId("");
    reset({ title: "", shortDescription: "", fullDescription: "", price: 0, durationMinutes: 0 });
    setDialogOpen(true);
  }

  function openEdit(row: CourseRow) {
    setEditing(row);
    setCover(row.coverImage ?? "");
    setFeatured(row.isFeatured);
    setPublished(row.isPublished);
    setInstructorId(
      typeof row.instructor === "object" && row.instructor ? row.instructor._id : "",
    );
    reset({
      title: row.title,
      shortDescription: row.shortDescription,
      fullDescription: row.fullDescription,
      price: row.price,
      durationMinutes: row.durationMinutes,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: CourseInput) {
    try {
      const payload = {
        ...values,
        coverImage: cover,
        isFeatured: featured,
        isPublished: published,
        instructor: instructorId,
      };
      if (editing) {
        const updated = await api.put<CourseRow>(`/api/admin/courses/${editing._id}`, payload);
        setRows((r) => r.map((x) => (x._id === editing._id ? { ...x, ...updated } : x)));
        toast.success("تم تحديث الدورة");
      } else {
        const created = await api.post<CourseRow>("/api/admin/courses", payload);
        setRows((r) => [created, ...r]);
        toast.success("تمت إضافة الدورة");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await api.del(`/api/admin/courses/${deleteId}`);
    setRows((r) => r.filter((x) => x._id !== deleteId));
    toast.success("تم حذف الدورة");
    setDeleteId(null);
  }

  const columns: ColumnDef<CourseRow, unknown>[] = [
    {
      accessorKey: "title",
      header: "الدورة",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-16 overflow-hidden rounded-lg bg-secondary">
            {row.original.coverImage ? (
              <Image src={row.original.coverImage} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-maroon-400">
                <BookOpen className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium line-clamp-1">{row.original.title}</span>
            {row.original.isFeatured && <Star className="h-3.5 w-3.5 fill-beige-500 text-beige-500" />}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "السعر",
      cell: ({ getValue }) => formatPrice(getValue() as number),
    },
    {
      accessorKey: "lessonsCount",
      header: "الدروس",
      cell: ({ getValue }) => `${getValue() as number} درس`,
    },
    {
      accessorKey: "isPublished",
      header: "الحالة",
      cell: ({ getValue }) =>
        getValue() ? <Badge variant="success">منشورة</Badge> : <Badge variant="outline">مخفية</Badge>,
    },
    {
      id: "actions",
      header: "العمليات",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" title="الدروس" onClick={() => setLessonsFor(row.original)}>
            <ListVideo className="h-4 w-4" />
          </Button>
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
        title="الدورات"
        description="إدارة الدورات ودروسها. فعّل خيار «مميزة» لإظهارها بالصفحة الرئيسية."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة دورة
          </Button>
        }
      />

      <DataTable columns={columns} data={rows} searchPlaceholder="ابحث باسم الدورة…" />

      {/* Course form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل دورة" : "إضافة دورة"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <MediaUpload folder="courses" type="image" value={cover} onChange={(u) => setCover(u)} label="صورة الغلاف" />
            <div>
              <Label>اسم الدورة</Label>
              <Input className="mt-1.5" {...register("title")} />
              <FieldError message={errors.title?.message} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>السعر (ج.م)</Label>
                <Input type="number" className="mt-1.5" {...register("price")} />
                <FieldError message={errors.price?.message} />
              </div>
              <div>
                <Label>المحاضر</Label>
                <Select value={instructorId} onValueChange={setInstructorId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="اختر محاضراً" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((i) => (
                      <SelectItem key={i._id} value={i._id}>
                        {i.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>وصف مختصر</Label>
              <Textarea rows={2} className="mt-1.5" {...register("shortDescription")} />
              <FieldError message={errors.shortDescription?.message} />
            </div>
            <div>
              <Label>الوصف الكامل</Label>
              <Textarea rows={5} className="mt-1.5" {...register("fullDescription")} />
              <FieldError message={errors.fullDescription?.message} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>دورة مميزة</Label>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label>منشورة</Label>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
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

      {lessonsFor && (
        <LessonsDialog
          courseId={lessonsFor._id}
          courseTitle={lessonsFor.title}
          open={!!lessonsFor}
          onOpenChange={(v) => !v && setLessonsFor(null)}
          onCountChange={(count) =>
            setRows((r) =>
              r.map((x) => (x._id === lessonsFor._id ? { ...x, lessonsCount: count } : x)),
            )
          }
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        description="سيتم حذف الدورة وجميع دروسها واشتراكاتها نهائياً."
        onConfirm={handleDelete}
      />
    </div>
  );
}
