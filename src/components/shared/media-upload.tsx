"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X, Film } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "@/store/toast";
import { cn } from "@/lib/utils";
import type { UploadFolder } from "@/lib/cloudinary";

interface SignResponse {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

interface MediaUploadProps {
  folder: UploadFolder;
  value?: string;
  publicId?: string;
  onChange: (url: string, publicId: string) => void;
  type?: "image" | "video";
  label?: string;
  className?: string;
}

export function MediaUpload({
  folder,
  value,
  onChange,
  type = "image",
  label,
  className,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    try {
      setUploading(true);
      setProgress(0);
      const sign = await api.post<SignResponse>("/api/upload/sign", { folder });

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      form.append("folder", sign.folder);

      const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${type}/upload`;

      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", endpoint);
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable)
              setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () =>
            xhr.status < 300
              ? resolve(JSON.parse(xhr.responseText))
              : reject(new Error("فشل الرفع إلى Cloudinary"));
          xhr.onerror = () => reject(new Error("فشل الاتصال بـ Cloudinary"));
          xhr.send(form);
        },
      );

      onChange(result.secure_url, result.public_id);
      toast.success("تم رفع الملف بنجاح");
    } catch (err) {
      toast.error("تعذّر رفع الملف", (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={type === "image" ? "image/*" : "video/*"}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {type === "image" ? (
            <Image
              src={value}
              alt="معاينة"
              width={400}
              height={240}
              className="h-44 w-full object-cover"
            />
          ) : (
            <video src={value} controls className="h-44 w-full bg-black object-contain" />
          )}
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="absolute end-2 top-2 rounded-full bg-maroon-900/80 p-1.5 text-white hover:bg-maroon-900"
            aria-label="إزالة"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-secondary/40 text-muted-foreground transition hover:border-maroon-400 hover:text-maroon-700"
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin" />
              <span className="text-sm">جارٍ الرفع… {progress}%</span>
            </>
          ) : (
            <>
              {type === "image" ? (
                <UploadCloud className="h-8 w-8" />
              ) : (
                <Film className="h-8 w-8" />
              )}
              <span className="text-sm">
                اضغط لرفع {type === "image" ? "صورة" : "فيديو"}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
