const configuredApiUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env as Record<string, string | undefined>).REACT_APP_API_URL
)?.trim();

/**
 * URL base del backend Spring Boot.
 * En desarrollo usa http://localhost:8081 por defecto.
 * En producción se sobreescribe con VITE_API_URL o REACT_APP_API_URL.
 */
export const API_URL = (configuredApiUrl || 'http://localhost:8081').replace(
  /\/+$/,
  '',
);
