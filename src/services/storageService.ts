import { API_URL } from "@/config/env";
import { getToken } from "@/services/tokenStorage";
import { ApiError } from "@/services/apiClient";

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Valida un archivo antes de enviarlo al backend / Supabase Storage.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "Selecciona un archivo." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: "Formato no permitido. Solo se aceptan imágenes JPEG, PNG, WEBP o GIF.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "La imagen excede el tamaño máximo permitido de 10 MB.",
    };
  }

  return { valid: true };
}

/**
 * Sube un archivo a Supabase Storage a través del endpoint del backend /api/storage/upload.
 * @param file El archivo a subir
 * @param folder Carpeta de destino (ej. 'mascotas', 'avatares')
 */
export async function uploadFile(
  file: File,
  folder: string = "general",
): Promise<UploadResponse> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new ApiError(400, validation.error || "Archivo no válido");
  }

  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_URL}/api/storage/upload`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch (error) {
    throw new ApiError(
      0,
      "No se pudo conectar con el servidor de almacenamiento. Verifica tu conexión.",
    );
  }

  if (!response.ok) {
    let errorMsg = "Error al subir la imagen a Supabase Storage.";
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch {
      // Ignorar fallback a mensaje por defecto
    }
    throw new ApiError(response.status, errorMsg);
  }

  return (await response.json()) as UploadResponse;
}
