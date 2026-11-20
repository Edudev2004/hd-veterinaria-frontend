import React, { useEffect, useState, useCallback } from 'react';
import { Edit3, Plus, X, Loader2 } from 'lucide-react';
import { adminSpecialtiesService, SpecialtyDTO } from '../services/adminSpecialtiesService';

export const AdminSpecialtiesPage: React.FC = () => {
  const [specialties, setSpecialties] = useState<SpecialtyDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<SpecialtyDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const cargarEspecialidades = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminSpecialtiesService.listarTodas();
      setSpecialties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las especialidades.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarEspecialidades();
  }, [cargarEspecialidades]);

  const filteredSpecialties = specialties.filter((specialty) => {
    const search = query.toLowerCase();
    const matchesSearch =
      specialty.name.toLowerCase().includes(search) ||
      (specialty.description || '').toLowerCase().includes(search);
    const matchesStatus = showInactive || specialty.active;
    return matchesSearch && matchesStatus;
  });

  const getSpecialtyIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cirug')) return '✂️';
    if (n.includes('derma')) return '🐾';
    if (n.includes('odon')) return '🦷';
    if (n.includes('oftal')) return '👁️';
    if (n.includes('trauma')) return '🦴';
    return '🩺';
  };

  const openEditForm = (specialty: SpecialtyDTO) => {
    setEditing(specialty);
    setFormData({
      name: specialty.name,
      description: specialty.description || '',
    });
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Completa el nombre y la descripción de la especialidad.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editing) {
        const updated = await adminSpecialtiesService.actualizar(editing.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
        setSpecialties((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await adminSpecialtiesService.crear({
          name: formData.name.trim(),
          description: formData.description.trim(),
          active: true,
        });
        setSpecialties((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar la especialidad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSpecialtyStatus = async (id: string, currentActive: boolean) => {
    try {
      const updated = await adminSpecialtiesService.cambiarEstado(id, !currentActive);
      setSpecialties((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cambiar estado.');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setIsFormOpen(false);
    setFormData({
      name: '',
      description: '',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de Especialidades Médicas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administración del catálogo de especialidades veterinarias
        </p>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormData({
              name: '',
              description: '',
            });
            setIsFormOpen(true);
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Nueva especialidad
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar especialidad..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />

          <div className="mt-4 flex items-center gap-2">
            <input
              id="showInactive"
              type="checkbox"
              checked={showInactive}
              onChange={(event) => setShowInactive(event.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="showInactive" className="text-sm text-slate-600">
              Mostrar especialidades inactivas
            </label>
          </div>
        </div>

        <h2 className="mb-4 font-bold text-slate-800">
          Especialidades
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
            <button
              type="button"
              onClick={() => void cargarEspecialidades()}
              className="ml-2 font-bold underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-slate-500">
              No se encontraron especialidades.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSpecialties.map((specialty) => (
              <div
                key={specialty.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getSpecialtyIcon(specialty.name)}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {specialty.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {specialty.description || 'Sin descripción'}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          specialty.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {specialty.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(specialty)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => void toggleSpecialtyStatus(specialty.id, specialty.active)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {specialty.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isFormOpen && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editing ? 'Editar especialidad' : 'Nueva especialidad'}
                </h3>
                <p className="text-sm text-slate-500">
                  Completa la información de la especialidad.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  placeholder="Ej. Cardiología veterinaria"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe la especialidad..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
