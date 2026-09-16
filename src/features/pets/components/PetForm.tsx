import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { AlertCircle, PawPrint } from "lucide-react";
import {
  registerPet,
  updatePet,
  Especie,
  Sexo,
  RegisterPetPayload,
  Mascota,
} from "@/services/petService";

interface PetFormProps {
  mascota?: Mascota;
  onSuccess: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ mascota, onSuccess }) => {
  const [formData, setFormData] = useState<RegisterPetPayload>({
    nombre: mascota?.nombre ?? "",
    especie: mascota?.especie ?? "perro",
    raza: mascota?.raza ?? "",
    sexo: mascota?.sexo ?? "macho",
    fechaNacimiento: mascota?.fechaNacimiento ?? "",
    fotoUrl: mascota?.fotoUrl ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setError("El nombre de la mascota es obligatorio.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      if (mascota) {
        await updatePet(mascota.id, formData);
      } else {
        await registerPet(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al guardar la mascota.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        required
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ej. Luna"
        icon={<PawPrint className="w-4 h-4" />}
      />

      <div className="space-y-1 w-full text-left">
        <label
          htmlFor="especie"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          Especie
        </label>
        <select
          id="especie"
          name="especie"
          value={formData.especie}
          onChange={(e) =>
            setFormData({ ...formData, especie: e.target.value as Especie })
          }
          className="w-full bg-transparent text-sm text-slate-900 font-medium border-b-2 border-slate-200 focus:outline-none focus:border-[#0D7C84] py-2"
        >
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <UnderlineInput
        label="Raza (Opcional)"
        name="raza"
        type="text"
        value={formData.raza}
        onChange={handleChange}
        placeholder="Ej. Golden Retriever"
      />

      <div className="space-y-1 w-full text-left">
        <label
          htmlFor="sexo"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          Sexo
        </label>
        <select
          id="sexo"
          name="sexo"
          value={formData.sexo}
          onChange={(e) =>
            setFormData({ ...formData, sexo: e.target.value as Sexo })
          }
          className="w-full bg-transparent text-sm text-slate-900 font-medium border-b-2 border-slate-200 focus:outline-none focus:border-[#0D7C84] py-2"
        >
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
      </div>

      <UnderlineInput
        label="Fecha de Nacimiento (Opcional)"
        name="fechaNacimiento"
        type="date"
        value={formData.fechaNacimiento}
        onChange={handleChange}
      />
      <UnderlineInput
        label="URL de Foto (Opcional)"
        name="fotoUrl"
        type="url"
        value={formData.fotoUrl}
        onChange={handleChange}
        placeholder="https://ejemplo.com/foto-mascota.jpg"
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        variant="primary"
        fullWidth
      >
        {mascota ? "Guardar Cambios" : "Registrar Mascota"}
      </Button>
    </form>
  );
};
