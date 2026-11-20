import React, { useState } from 'react';
import { Edit3, Plus, X } from 'lucide-react';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

const initialSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'Medicina General',
    description: 'Atención veterinaria general y preventiva.',
    icon: '🩺',
    active: true,
  },
  {
    id: '2',
    name: 'Dermatología',
    description: 'Diagnóstico y tratamiento de enfermedades de la piel.',
    icon: '🐾',
    active: true,
  },
  {
    id: '3',
    name: 'Cirugía Veterinaria',
    description: 'Procedimientos quirúrgicos para mascotas.',
    icon: '✂️',
    active: true,
  },
  {
    id: '4',
    name: 'Odontología',
    description: 'Prevención y tratamiento de problemas dentales.',
    icon: '🦷',
    active: true,
  },
];

const STORAGE_KEY = 'vethd-admin-specialties';

export const AdminSpecialtiesPage: React.FC = () => {
 
  const [specialties, setSpecialties] = useState<Specialty[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        return JSON.parse(stored) as Specialty[];
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialSpecialties),
      );

      return initialSpecialties;
    } catch (error) {
      console.error(
        'Error al cargar las especialidades:',
        error,
      );

      return initialSpecialties;
    }
  });

  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<Specialty | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  
  const filteredSpecialties = specialties.filter((specialty) => {
    const search = query.toLowerCase();

    const matchesSearch =
      specialty.name.toLowerCase().includes(search) ||
      specialty.description.toLowerCase().includes(search);

    const matchesStatus =
      showInactive || specialty.active;

    return matchesSearch && matchesStatus;
  });

  
  const openEditForm = (specialty: Specialty) => {
    setEditing(specialty);

    setFormData({
      name: specialty.name,
      description: specialty.description,
      icon: specialty.icon,
    });

    setIsFormOpen(true);
  };

  
  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim()
    ) {
      alert(
        'Completa el nombre y la descripción de la especialidad.',
      );

      return;
    }

    let updatedSpecialties: Specialty[];

    
    if (editing) {
      updatedSpecialties = specialties.map((specialty) =>
        specialty.id === editing.id
          ? {
              ...specialty,
              name: formData.name.trim(),
              description: formData.description.trim(),
              icon: formData.icon.trim() || '🐾',
            }
          : specialty,
      );
    } else {
      
      const newSpecialty: Specialty = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || '🐾',
        active: true,
      };

      updatedSpecialties = [
        ...specialties,
        newSpecialty,
      ];
    }

  
    setSpecialties(updatedSpecialties);

    
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSpecialties),
      );
    } catch (error) {
      console.error(
        'Error al guardar las especialidades:',
        error,
      );
    }

    
    setEditing(null);
    setIsFormOpen(false);

    
    setFormData({
      name: '',
      description: '',
      icon: '',
    });
  };

  
  const toggleSpecialtyStatus = (id: string) => {
    const updatedSpecialties = specialties.map(
      (specialty) =>
        specialty.id === id
          ? {
              ...specialty,
              active: !specialty.active,
            }
          : specialty,
    );

   
    setSpecialties(updatedSpecialties);

    
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSpecialties),
      );
    } catch (error) {
      console.error(
        'Error al actualizar el estado:',
        error,
      );
    }
  };

  
  const resetForm = () => {
    setEditing(null);
    setIsFormOpen(false);

    setFormData({
      name: '',
      description: '',
      icon: '',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de Especialidades Médicas
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Administración del catálogo de especialidades
        </p>

        <button
          type="button"
          onClick={() => {
            setEditing(null);

            setFormData({
              name: '',
              description: '',
              icon: '',
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
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Buscar especialidad..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />

          <div className="mt-4 flex items-center gap-2">
            <input
              id="showInactive"
              type="checkbox"
              checked={showInactive}
              onChange={(event) =>
                setShowInactive(event.target.checked)
              }
              className="h-4 w-4"
            />

            <label
              htmlFor="showInactive"
              className="text-sm text-slate-600"
            >
              Mostrar especialidades inactivas
            </label>
          </div>
        </div>

        <h2 className="mb-4 font-bold text-slate-800">
          Especialidades
        </h2>

        {filteredSpecialties.length === 0 ? (
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
                      {specialty.icon}
                    </span>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {specialty.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {specialty.description}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          specialty.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {specialty.active
                          ? 'Activa'
                          : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                 
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(specialty)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </button>

                  
                    <button
                      type="button"
                      onClick={() =>
                        toggleSpecialtyStatus(
                          specialty.id,
                        )
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {specialty.active
                        ? 'Desactivar'
                        : 'Activar'}
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
                  {editing
                    ? 'Editar especialidad'
                    : 'Nueva especialidad'}
                </h3>

                <p className="text-sm text-slate-500">
                  Completa la información de la
                  especialidad.
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
                      description:
                        event.target.value,
                    })
                  }
                  placeholder="Describe la especialidad..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ícono
                </label>

                <input
                  type="text"
                  value={formData.icon}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      icon: event.target.value,
                    })
                  }
                  placeholder="Ej. 🩺"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
