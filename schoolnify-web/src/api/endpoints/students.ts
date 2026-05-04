import { apiClient } from "../client";
import type {
  ApiStudent,
  StudentListFilters,
  StudentListResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  ChangeStatusRequest,
  ChangeStatusResponse,
  ChangeClassRequest,
  PromoteRequest,
  PromoteResponse,
  ImportResponse,
} from "@/types/student-api";

// Build query string from filter object, skipping null/undefined/empty
function toQueryString(params: Record<string, string | number | undefined | null> | object): string {
  const entries = Object.entries(params as Record<string, unknown>).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  const usp = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]));
  return `?${usp.toString()}`;
}

export const studentsApi = {
  list: (filters: StudentListFilters = {}) =>
    apiClient<StudentListResponse>(`/students${toQueryString(filters)}`),

  get: (id: string, include?: ("recent_payments" | "recent_attendance")[]) => {
    const qs = include?.length ? `?include=${include.join(",")}` : "";
    return apiClient<ApiStudent>(`/students/${id}${qs}`);
  },

  create: (data: CreateStudentRequest) =>
    apiClient<ApiStudent>("/students", { method: "POST", body: data }),

  update: (id: string, data: UpdateStudentRequest) =>
    apiClient<ApiStudent>(`/students/${id}`, { method: "PATCH", body: data }),

  delete: (id: string) =>
    apiClient<void>(`/students/${id}`, { method: "DELETE" }),

  changeStatus: (id: string, data: ChangeStatusRequest) =>
    apiClient<ChangeStatusResponse>(`/students/${id}/status`, { method: "PATCH", body: data }),

  changeClass: (id: string, data: ChangeClassRequest) =>
    apiClient<ApiStudent>(`/students/${id}/class`, { method: "PATCH", body: data }),

  promote: (data: PromoteRequest) =>
    apiClient<PromoteResponse>("/students/promote", { method: "POST", body: data }),

  // Bulk import: multipart/form-data instead of JSON
  bulkImport: async (file: File, mapping: Record<string, string>, skipInvalid: boolean): Promise<ImportResponse> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("mapping", JSON.stringify(mapping));
    if (skipInvalid) fd.append("skip_invalid", "true");

    const baseUrl = typeof window === "undefined"
      ? (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080")
      : "";
    const res = await fetch(`${baseUrl}/api/v1/students/bulk-import`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    if (!res.ok && res.status !== 422) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || `Import failed: ${res.status}`);
    }
    return res.json();
  },

  // Export: triggers a CSV download via fetch + blob
  export: async (filters: StudentListFilters = {}): Promise<Blob> => {
    const baseUrl = typeof window === "undefined"
      ? (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080")
      : "";
    const res = await fetch(`${baseUrl}/api/v1/students/export${toQueryString(filters)}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Export failed: ${res.status}`);
    return res.blob();
  },
};
