export interface AdminSignupRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  school_name: string;
}

export interface AdminSignupUser {
  id: string;
  email: string;
  organization_id: string;
}

export interface AdminSignupOrganization {
  id: string;
  name: string;
  slug: string;
}

/** 201 response. account created, cookies set */
export interface AdminSignupSuccess {
  user: AdminSignupUser;
  organization: AdminSignupOrganization;
  message: string;
  access_token?: string;
  subdomain_url: string;
}

/** 202 response. email verification required */
export interface AdminSignupPending {
  message: string;
  pending_authentication_token: string;
  school_name: string;
  user_id?: string;
}

export type AdminSignupResponse = AdminSignupSuccess | AdminSignupPending;

export function isSignupPending(
  response: AdminSignupResponse
): response is AdminSignupPending {
  return "pending_authentication_token" in response;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  message: string;
  subdomain_url: string;
  user: VerifiedUser;
}

// ---------------------------------------------------------------------------
// Verify Email
// ---------------------------------------------------------------------------

export interface VerifyEmailRequest {
  code: string;
  pending_authentication_token: string;
}

export interface VerifiedUser {
  id: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  organization_id: string;
  profile_picture_url: string | null;
  role: string;
  created_at: string;
}

export interface VerifyEmailResponse {
  access_token: string;
  refresh_token: string;
  message: string;
  user: VerifiedUser;
}

// ---------------------------------------------------------------------------
// Resend Verification
// ---------------------------------------------------------------------------

export interface ResendVerificationRequest {
  user_id: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Create Organization (post-verification)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Establish Session (cross-subdomain login)
// ---------------------------------------------------------------------------

export interface EstablishSessionRequest {
  organization_slug: string;
  refresh_token?: string;
}

export interface EstablishSessionResponse {
  user: VerifiedUser;
  message: string;
  subdomain_url: string;
}

// ---------------------------------------------------------------------------
// Create Organization (post-verification)
// ---------------------------------------------------------------------------

export interface CreateOrganizationRequest {
  school_name: string;
  refresh_token?: string;
}

export interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  subdomain_url: string;
}
