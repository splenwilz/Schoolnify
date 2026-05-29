import { apiClient } from "../client";
import type {
  AdminSignupRequest,
  AdminSignupResponse,
  CreateOrganizationRequest,
  CreateOrganizationResponse,
  EstablishSessionRequest,
  EstablishSessionResponse,
  LoginRequest,
  LoginResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  VerifiedUser,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/types/auth";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: data,
    }),

  adminSignup: (data: AdminSignupRequest) =>
    apiClient<AdminSignupResponse>("/auth/admin-signup", {
      method: "POST",
      body: data,
    }),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient<VerifyEmailResponse>("/auth/verify-email", {
      method: "POST",
      body: data,
    }),

  resendVerification: (data: ResendVerificationRequest) =>
    apiClient<ResendVerificationResponse>("/auth/resend-verification", {
      method: "POST",
      body: data,
    }),

  createOrganization: (data: CreateOrganizationRequest, accessToken?: string) =>
    apiClient<CreateOrganizationResponse>("/auth/create-organization", {
      method: "POST",
      body: data,
      ...(accessToken && { headers: { Authorization: `Bearer ${accessToken}` } }),
    }),

  establishSession: (data: EstablishSessionRequest, accessToken: string) =>
    apiClient<EstablishSessionResponse>("/auth/establish-session", {
      method: "POST",
      body: data,
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  getMe: () => apiClient<VerifiedUser>("/auth/me"),

  logout: () =>
    apiClient<void>("/auth/logout", { method: "POST" }),
};
