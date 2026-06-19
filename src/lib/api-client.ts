"use client";

/** Thin fetch wrapper for client components. Throws on non-2xx with the
 * server's Arabic error message so forms can surface it directly. */
export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    const message = json?.error || "حدث خطأ غير متوقع";
    const err = new Error(message) as Error & { details?: unknown };
    err.details = json?.details;
    throw err;
  }
  return (json?.data ?? json) as T;
}

export const api = {
  get: <T>(url: string) => apiFetch<T>(url),
  post: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};
