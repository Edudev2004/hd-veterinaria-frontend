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
  409: "El horario seleccionado ya no está disponible o existe un conflicto de agenda.",
  500: "Ocurrió un error interno en el servidor.",
};

const FRIENDLY_BACKEND_MESSAGES: Record<string, string> = {
  "the veterinarian already has an appointment booked for this slot":
    "El horario seleccionado ya no está disponible con este veterinario. Por favor elige otro horario o veterinario.",
  "only pending appointments can be rescheduled":
    "Solo las citas en estado pendiente pueden ser reprogramadas.",
  "only pending appointments can be cancelled":
    "Solo las citas en estado pendiente pueden ser canceladas.",
  "you do not own this pet":
    "No tienes permisos sobre la mascota seleccionada.",
  "you do not own this appointment":
    "No tienes permisos sobre esta cita.",
  "specialty does not belong to veterinarian":
    "La especialidad seleccionada no corresponde al veterinario.",
  "pet not found": "La mascota seleccionada no fue encontrada.",
  "veterinarian not found": "El veterinario seleccionado no fue encontrado.",
  "appointment not found": "La cita solicitada no fue encontrada.",
  "appointment cannot be in the past": "La cita debe ser programada en una fecha y hora futura.",
  "appointment hour must be between 08:00 and 18:00": "El horario de atención es entre las 08:00 y las 18:00.",
};

const normalizeBackendMessage = (msg: string): string => {
  const lower = msg.trim().toLowerCase();
  return FRIENDLY_BACKEND_MESSAGES[lower] ?? msg.trim();
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
    return normalizeBackendMessage(data);
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;

    for (const key of ["message", "detail", "reason"] as const) {
      const value = payload[key];

      if (
        typeof value === "string" &&
        value.trim() &&
        value.trim().toLowerCase() !== NO_MESSAGE_AVAILABLE
      ) {
        return normalizeBackendMessage(value);
      }
    }

    if (payload.validationErrors && typeof payload.validationErrors === "object") {
      const firstValidation = Object.values(payload.validationErrors as Record<string, unknown>)[0];
      if (typeof firstValidation === "string" && firstValidation.trim()) {
        return firstValidation.trim();
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
 * Adjunta el token JWT, normaliza errores y notifica cuando la sesión expira o el servidor falla.
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

    const connectionMessage =
      "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.";

    window.dispatchEvent(
      new CustomEvent("vethd:server-error", {
        detail: {
          status: 503,
          message: connectionMessage,
        },
      }),
    );

    throw new ApiError(0, connectionMessage);
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
    const errorMessage = extractErrorMessage(data, response.status);

    if (response.status === 401 && auth) {
      clearSession();
      window.dispatchEvent(new CustomEvent("vethd:unauthorized"));
    }

    if (response.status >= 500) {
      window.dispatchEvent(
        new CustomEvent("vethd:server-error", {
          detail: {
            status: response.status,
            message: errorMessage,
          },
        }),
      );
    }

    throw new ApiError(
      response.status,
      errorMessage,
      data,
    );
  }

  return (data ?? undefined) as T;
}
