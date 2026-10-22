const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

/**
 * URL base del backend Spring Boot.
 * En desarrollo usa http://localhost:8081 por defecto.
 * En producción se sobreescribe con la variable VITE_API_URL.
 */
export const API_URL = (configuredApiUrl || 'http://localhost:8081').replace(
  /\/+$/,
  '',
);
