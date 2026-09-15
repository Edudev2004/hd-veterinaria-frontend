import React, { useState } from 'react';

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

  const filteredSpecialties = specialties.filter((specialty) => {
  const search = query.toLowerCase();

  return (
    specialty.name.toLowerCase().includes(search) ||
    specialty.description.toLowerCase().includes(search)
  );
});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          Gestión de Especialidades Médicas
        </h1>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
