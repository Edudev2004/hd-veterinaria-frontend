const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Los datos enviados no son válidos. Revisa el formulario.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
};

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
  }

  if (!response.ok) {
    throw new Error(STATUS_MESSAGES[response.status] ?? 'Ocurrió un error en el servidor. Inténtalo de nuevo.');
  }

  return response.json() as Promise<T>;
};
