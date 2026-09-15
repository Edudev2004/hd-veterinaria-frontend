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

export const AdminSpecialtiesPage: React.FC = () => {
  const [specialties] = useState<Specialty[]>(initialSpecialties);
  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [editing, setEditing] = useState<Specialty | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredSpecialties = specialties.filter((specialty) => {
  const search = query.toLowerCase();

  const matchesSearch =
    specialty.name.toLowerCase().includes(search) ||
    specialty.description.toLowerCase().includes(search);

  const matchesStatus = showInactive || specialty.active;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          Gestión de Especialidades Médicas
        </h1>
          <button
           type="button"
           onClick={() => setIsFormOpen(true)}
           className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
           >
           <Plus className="h-4 w-4" />
            Nueva especialidad
          </button>

        <p className="text-sm text-slate-500">
          Administración del catálogo de especialidades
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="mb-4">
         <input
           type="text"
           value={query}
           onChange={(event) => setQuery(event.target.value)}
           placeholder="Buscar especialidad..."
           className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
           />
      <div className="flex items-center gap-2">
         <input
          id="showInactive"
          type="checkbox"
          checked={showInactive}
          onChange={(event) => setShowInactive(event.target.checked)}
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

        <h2 className="font-bold mb-4">
          Especialidades
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredSpecialties.map((specialty) => (
            <div
              key={specialty.id}
              className="border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                     {specialty.icon}
                  </span>

                   <div>
                    <h3 className="font-semibold">
                      {specialty.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {specialty.description}
                    </p>
                  </div>
              </div>

              <button
               type="button"
               onClick={() => setEditing(specialty)}
               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
           >
              <Edit3 className="h-4 w-4" />
               Editar
              </button>
              </div>

{(isFormOpen || editing) && (
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
        onClick={() => {
          setEditing(null);
          setIsFormOpen(false);
        }}
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
          defaultValue={editing?.name ?? ''}
          placeholder="Ej. Cardiología veterinaria"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Descripción
        </label>

        <textarea
          defaultValue={editing?.description ?? ''}
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
          defaultValue={editing?.icon ?? ''}
          placeholder="Ej. 🩺"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setIsFormOpen(false);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
                <div>
                  <h3 className="font-semibold">
                    {specialty.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {specialty.description}
                  </p>
                </div>
              </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};
