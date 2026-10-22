import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { getProfile, updateProfile, Perfil } from "@/services/profileApi";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

export const ProfilePage: React.FC = () => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    fotoUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        setPerfil(await getProfile());
      } catch (err: any) {
        setLoadError(err?.message || "No se pudo cargar el perfil.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPerfil();
  }, []);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando perfil...</p>;
  }

  if (!perfil) {
    return (
      <div className="max-w-md bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{loadError}</span>
      </div>
    );
  }

  const isNombreValid = formData.nombre.trim().length > 0;
  const isTelefonoValid = formData.telefono.trim().length >= 7;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleEditClick = () => {
    setFormData({
      nombre: perfil.nombre,
      telefono: perfil.telefono ?? "",
      fotoUrl: perfil.fotoUrl ?? "",
    });
    setSuccess(false);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNombreValid) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!isTelefonoValid) {
      setError("Ingresa un número de teléfono válido (mínimo 7 dígitos).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setPerfil(await updateProfile(formData));
      setIsEditing(false);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al actualizar el perfil.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="max-w-md bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-emerald-700 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Perfil actualizado correctamente.</span>
        </div>
      )}

      <div className="p-8 rounded-2xl border border-slate-200 bg-white max-w-md flex flex-col items-center text-center gap-4">
        <img
          src={perfil.fotoUrl || DEFAULT_AVATAR}
          alt={perfil.nombre}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-sm"
        />

        {!isEditing ? (
          <>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-outfit">
                {perfil.nombre}
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
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <UnderlineInput
              label="Nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              icon={<UserIcon className="w-4 h-4" />}
              error={
                !isNombreValid && formData.nombre.length > 0
                  ? "El nombre no puede estar vacío."
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

            <UnderlineInput
              label="URL de Foto (Opcional)"
              name="fotoUrl"
              type="url"
              value={formData.fotoUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/mi-foto.jpg"
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
                onClick={() => setIsEditing(false)}
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
