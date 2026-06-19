"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { articleSchema, type ArticleInput } from "@/lib/validations/content";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { formatDate } from "@/lib/utils";

export interface ArticleRow {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string | null;
  author?: string;
  isPublished: boolean;
  publishedAt: string;
}

export function ArticlesManager({ initial }: { initial: ArticleRow[] }) {
  const [rows, setRows] = useState<ArticleRow[]>(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleRow | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticleInput>({ resolver: zodResolver(articleSchema) });

  function openCreate() {
    setEditing(null);
    setImage("");
    setPublished(true);
    reset({ title: "", content: "", excerpt: "", author: "" });
    setDialogOpen(true);
  }

  function openEdit(row: ArticleRow) {
    setEditing(row);
    setImage(row.image ?? "");
    setPublished(row.isPublished);
    reset({
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      author: row.author,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ArticleInput) {
    try {
      const payload = { ...values, image, isPublished: published };
      if (editing) {
        const updated = await api.put<ArticleRow>(`/api/admin/articles/${editing._id}`, payload);
        setRows((r) => r.map((x) => (x._id === editing._id ? updated : x)));
        toast.success("تم تحديث المقال");
      } else {
        const created = await api.post<ArticleRow>("/api/admin/articles", payload);
        setRows((r) => [created, ...r]);
        toast.success("تمت إضافة المقال");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error("تعذّر الحفظ", (err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    await api.del(`/api/admin/articles/${deleteId}`);
    setRows((r) => r.filter((x) => x._id !== deleteId));
    toast.success("تم حذف المقال");
    setDeleteId(null);
  }

  const columns: ColumnDef<ArticleRow, unknown>[] = [
    {
      accessorKey: "title",
      header: "المقال",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-secondary">
            {row.original.image ? (
              <Image src={row.original.image} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-maroon-400">
                <Newspaper className="h-4 w-4" />
              </div>
            )}
          </div>
          <span className="font-medium line-clamp-1">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: "تاريخ النشر",
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
    {
      accessorKey: "isPublished",
      header: "الحالة",
      cell: ({ getValue }) =>
        getValue() ? <Badge variant="success">منشور</Badge> : <Badge variant="outline">مسودة</Badge>,
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
        title="المقالات"
        description="إدارة المقالات المنشورة في الموقع."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة مقال
          </Button>
        }
      />

      <DataTable columns={columns} data={rows} searchPlaceholder="ابحث بعنوان المقال…" />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل مقال" : "إضافة مقال"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <MediaUpload folder="articles" type="image" value={image} onChange={(u) => setImage(u)} label="صورة المقال" />
            <div>
              <Label>العنوان</Label>
              <Input className="mt-1.5" {...register("title")} />
              <FieldError message={errors.title?.message} />
            </div>
            <div>
              <Label>مقتطف (اختياري)</Label>
              <Textarea rows={2} className="mt-1.5" {...register("excerpt")} />
            </div>
            <div>
              <Label>المحتوى</Label>
              <Textarea rows={8} className="mt-1.5" {...register("content")} />
              <FieldError message={errors.content?.message} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label>نشر المقال</Label>
              <Switch checked={published} onCheckedChange={setPublished} />
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
        description="سيتم حذف المقال نهائياً."
        onConfirm={handleDelete}
      />
    </div>
  );
}
