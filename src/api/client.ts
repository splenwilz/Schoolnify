type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: Record<string, unknown> | null
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side needs absolute URL (bypasses Next.js proxy)
    return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  }
  // Client-side uses relative URL. proxied through Next.js rewrites
  // This keeps all requests same-origin, avoiding cross-site cookie issues
  return "";
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, next, signal } = config;

  const url = `${getBaseUrl()}/api/v1${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const fetchOptions: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {
    method,
    headers: requestHeaders,
    credentials: "include",
    signal,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  if (endpoint === "/auth/me" || endpoint === "/auth/login") {
    console.log(`[api] ${method} ${endpoint}`, {
      url,
      origin: typeof window !== "undefined" ? window.location.origin : "server",
      hasAuth: !!requestHeaders.Authorization,
    });
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (endpoint === "/auth/me" || endpoint === "/auth/login") {
      console.error(`[api] ${method} ${endpoint} → ${response.status}`, errorData);
    }
    throw new ApiError(response.status, response.statusText, errorData);
  }

  if (endpoint === "/auth/me" || endpoint === "/auth/login") {
    console.log(`[api] ${method} ${endpoint} → ${response.status} OK`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type { RequestConfig };
