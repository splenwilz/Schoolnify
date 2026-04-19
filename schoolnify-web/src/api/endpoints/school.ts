import { apiClient } from "../client";
import type {
  GetSetupResponse,
  PatchSetupRequest,
  PatchSetupResponse,
  PublicSchoolBranding,
} from "@/types/school";

export const schoolApi = {
  getSetup: () => apiClient<GetSetupResponse>("/schools/setup"),

  patchSetup: (data: PatchSetupRequest) =>
    apiClient<PatchSetupResponse>("/schools/setup", {
      method: "PATCH",
      body: data,
    }),

  getPublicBranding: (slug: string) =>
    apiClient<PublicSchoolBranding>(`/schools/${slug}/public`),
};
