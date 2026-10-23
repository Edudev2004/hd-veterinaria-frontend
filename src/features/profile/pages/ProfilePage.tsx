import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  Camera,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { getProfile, updateProfile, Perfil } from "@/services/profileApi";
import { uploadFile, validateImageFile } from "@/services/storageService";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/constants/avatars";

export const ProfilePage: React.FC = () => {
  const { updateUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    fotoUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const data = await getProfile();
        setPerfil(data);
      } catch (err: any) {
        setLoadError(err?.message || "No se pudo cargar el perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPerfil();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-6">
        <Loader2 className="w-4 h-4 animate-spin text-[#0D7C84]" />
        <span>Cargando perfil...</span>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-md bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{loadError}</span>
      </div>
    );
  }

  const nombreCompleto = `${perfil.nombres} ${perfil.apellidos}`.trim();
  const isNombresValid = formData.nombres.trim().length > 0;
  const isApellidosValid = formData.apellidos.trim().length > 0;
  const isTelefonoValid = formData.telefono.trim().length >= 7;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleEditClick = () => {
    setFormData({
      nombres: perfil.nombres,
      apellidos: perfil.apellidos,
      telefono: perfil.telefono ?? "",
      fotoUrl: perfil.fotoUrl ?? "",
    });
    setSuccess(null);
    setIsEditing(true);
  };

  /**
   * Sube la foto directamente a Supabase Storage desde el avatar circular.
   */
  const handleDirectAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Archivo no permitido");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setError(null);
      const res = await uploadFile(file, "avatares");

      if (isEditing) {
        setFormData((prev) => ({ ...prev, fotoUrl: res.url }));
        setSuccess("Foto subida a Supabase. Recuerda guardar los cambios.");
      } else {
        // En modo vista, actualizamos y persistimos directamente en backend
        const updated = await updateProfile({
          nombres: perfil.nombres,
          apellidos: perfil.apellidos,
          telefono: perfil.telefono || "",
          fotoUrl: res.url,
        });
        setPerfil(updated);
        updateUserData({
          fotoUrl: updated.fotoUrl,
          nombre: `${updated.nombres} ${updated.apellidos}`,
        });
        setSuccess("Foto de perfil actualizada en Supabase Storage exitosamente.");
      }
    } catch (err: any) {
      setError(err?.message || "No se pudo subir la foto a Supabase Storage.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNombresValid) {
      setError("Los nombres son obligatorios.");
      return;
    }
    if (!isApellidosValid) {
      setError("Los apellidos son obligatorios.");
      return;
    }
    if (!isTelefonoValid) {
      setError("Ingresa un número de teléfono válido (mínimo 7 dígitos).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const updated = await updateProfile(formData);
      setPerfil(updated);
      updateUserData({
        fotoUrl: updated.fotoUrl,
        nombre: `${updated.nombres} ${updated.apellidos}`,
      });
      setIsEditing(false);
      setSuccess("Perfil actualizado correctamente.");
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al actualizar el perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Foto que se debe visualizar en el avatar
  const displayedPhoto = isEditing
    ? formData.fotoUrl || DEFAULT_AVATAR
    : perfil.fotoUrl || DEFAULT_AVATAR;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">
          Mi Perfil
        </h1>
        <p className="text-sm text-slate-500">
          Información personal y configuración de cuenta
        </p>
      </div>

      {success && (
        <div className="max-w-md bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-emerald-700 text-xs sm:text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
          <span className="flex-1">{success}</span>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="text-emerald-500 hover:text-emerald-800 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="max-w-md bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-8 rounded-2xl border border-slate-200 bg-white max-w-md flex flex-col items-center text-center gap-4 shadow-xs">
        {/* Avatar interactivo con botón de carga a Supabase Storage */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#0D7C84]/20 shadow-sm bg-slate-100 flex items-center justify-center">
            {isUploadingAvatar ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/60 text-white gap-1">
                <Loader2 className="w-6 h-6 animate-spin text-teal-300" />
                <span className="text-[10px] font-semibold">Subiendo...</span>
              </div>
            ) : (
              <img
                src={displayedPhoto}
                alt={nombreCompleto}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Botón flotante para seleccionar archivo */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#0D7C84] hover:bg-[#09575d] text-white shadow-md transition-all hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-white"
            title="Subir foto a Supabase Storage"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleDirectAvatarUpload}
            className="hidden"
          />
        </div>

        {!isEditing ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">
                {nombreCompleto}
              </h2>
              <p className="text-xs text-slate-500">Propietario</p>
            </div>

            <div className="w-full space-y-3 pt-4 border-t border-slate-100 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{perfil.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">
                  {perfil.telefono || "No especificado"}
                </span>
              </div>
            </div>

            <Button variant="primary" onClick={handleEditClick} fullWidth>
              Editar Perfil
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
            <UnderlineInput
              label="Nombres"
              name="nombres"
              type="text"
              value={formData.nombres}
              onChange={handleChange}
              icon={<UserIcon className="w-4 h-4" />}
              error={
                !isNombresValid && formData.nombres.length > 0
                  ? "Los nombres no pueden estar vacíos."
                  : undefined
              }
            />

            <UnderlineInput
              label="Apellidos"
              name="apellidos"
              type="text"
              value={formData.apellidos}
              onChange={handleChange}
              icon={<UserIcon className="w-4 h-4" />}
              error={
                !isApellidosValid && formData.apellidos.length > 0
                  ? "Los apellidos no pueden estar vacíos."
                  : undefined
              }
            />

            <UnderlineInput
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              icon={<Phone className="w-4 h-4" />}
              error={
                !isTelefonoValid && formData.telefono.length > 0
                  ? "Mínimo 7 dígitos."
                  : undefined
              }
            />

            <ImageUpload
              label="Foto de Perfil (Opcional)"
              value={formData.fotoUrl}
              onChange={(url) => setFormData({ ...formData, fotoUrl: url })}
              folder="avatares"
              shape="circle"
              helperText="Sube tu foto de perfil a Supabase (JPG, PNG o WEBP)"
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                variant="primary"
                fullWidth
              >
                Guardar Cambios
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
