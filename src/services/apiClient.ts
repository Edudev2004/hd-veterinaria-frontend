import { API_URL } from "@/config/env";
import { clearSession, getToken } from "@/services/tokenStorage";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** false = no adjunta token ni dispara el evento global de sesión expirada. */
  auth?: boolean;
  /** Token explícito (útil para logout). */
  token?: string;
  signal?: AbortSignal;
}

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: "La solicitud enviada no es válida.",
  401: "Credenciales incorrectas o sesión expirada.",
  403: "No tienes permisos para realizar esta acción.",
  404: "El recurso solicitado no existe.",
  409: "El recurso ya se encuentra registrado.",
  500: "Ocurrió un error interno en el servidor.",
};

const NO_MESSAGE_AVAILABLE = "no message available";

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const extractErrorMessage = (data: unknown, status: number): string => {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;

    for (const key of ["message", "detail"] as const) {
      const value = payload[key];

      if (
        typeof value === "string" &&
        value.trim() &&
        value.trim().toLowerCase() !== NO_MESSAGE_AVAILABLE
      ) {
        return value.trim();
      }
    }

    const defaultMessage = DEFAULT_ERROR_MESSAGES[status];

    if (defaultMessage) {
      return defaultMessage;
    }

    const error = payload.error;

    if (typeof error === "string" && error.trim()) {
      return error.trim();
    }
  }

  return DEFAULT_ERROR_MESSAGES[status] ?? `Error ${status}`;
};

/**
 * Cliente HTTP central del frontend.
 * Adjunta el token JWT, normaliza errores y notifica cuando la sesión expira.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, token, signal } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const effectiveToken = token ?? (auth ? getToken() : null);

  if (effectiveToken) {
    headers.Authorization = `Bearer ${effectiveToken}`;
  }

  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      0,
      "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  let data: unknown = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = rawBody;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearSession();
      window.dispatchEvent(new CustomEvent("vethd:unauthorized"));
    }

    throw new ApiError(
      response.status,
      extractErrorMessage(data, response.status),
      data,
    );
  }

  return (data ?? undefined) as T;
}
