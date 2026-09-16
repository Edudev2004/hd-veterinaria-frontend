import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';

export interface Veterinario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  especialidad: string;
  estado: 'activo' | 'inactivo';
  valoracionPromedio: number;
  totalResenas?: number;
}

export const VETS_INICIALES: Veterinario[] = [
  {
    id: 'vet-1',
    nombre: 'Dra. Valeria Gómez',
    correo: 'valeria.gomez@hdveterinaria.com',
    telefono: '+51 987 654 321',
    especialidad: 'Medicina General y Cirugía',
    estado: 'activo',
    valoracionPromedio: 4.9,
    totalResenas: 48,
  },
  {
    id: 'vet-2',
    nombre: 'Dr. Carlos Mendoza',
    correo: 'carlos.mendoza@hdveterinaria.com',
    telefono: '+51 912 345 678',
    especialidad: 'Dermatología Veterinaria',
    estado: 'activo',
    valoracionPromedio: 4.8,
    totalResenas: 35,
  },
  {
    id: 'vet-3',
    nombre: 'Dra. Andrea Paredes',
    correo: 'andrea.paredes@hdveterinaria.com',
    telefono: '+51 955 432 109',
    especialidad: 'Oftalmología',
    estado: 'activo',
    valoracionPromedio: 4.7,
    totalResenas: 29,
  },
  {
    id: 'vet-4',
    nombre: 'Dr. Roberto Salas',
    correo: 'roberto.salas@hdveterinaria.com',
    telefono: '+51 944 887 766',
    especialidad: 'Traumatología y Ortopedia',
    estado: 'activo',
    valoracionPromedio: 4.6,
    totalResenas: 19,
  },
  {
    id: 'vet-5',
    nombre: 'Dra. Lucía Fernández',
    correo: 'lucia.fernandez@hdveterinaria.com',
    telefono: '+51 933 221 100',
    especialidad: 'Odontología Veterinaria',
    estado: 'activo',
    valoracionPromedio: 5.0,
    totalResenas: 12,
  },
  {
    id: 'vet-6',
    nombre: 'Dr. Manuel Benítez',
    correo: 'manuel.benitez@hdveterinaria.com',
    telefono: '+51 922 114 455',
    especialidad: 'Cardiología',
    estado: 'inactivo',
    valoracionPromedio: 4.4,
    totalResenas: 15,
  },
];

const ITEMS_POR_PAGINA = 5;

export const AdminVetsPage: React.FC = () => {
  const [veterinarios] = useState<Veterinario[]>(VETS_INICIALES);
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(veterinarios.length / ITEMS_POR_PAGINA) || 1;
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const veterinariosPaginados = veterinarios.slice(
    indiceInicio,
    indiceInicio + ITEMS_POR_PAGINA
  );

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">
          Gestión de Personal Veterinario
        </h1>
        <p className="text-sm text-slate-500">
          Listado y control del equipo médico de la clínica.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Veterinario</th>
                <th className="py-3.5 px-6">Especialidad</th>
                <th className="py-3.5 px-6">Contacto</th>
                <th className="py-3.5 px-6 text-center">Estado</th>
                <th className="py-3.5 px-6 text-center">Valoración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {veterinariosPaginados.map((vet) => (
                <tr key={vet.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {vet.nombre
                          .replace(/^(Dr\.|Dra\.)\s*/, '')
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{vet.nombre}</p>
                        <p className="text-xs text-slate-500">{vet.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                      {vet.especialidad}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-xs">
                    <span>{vet.telefono}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        vet.estado === 'activo'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {vet.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-800 text-sm">
                        {vet.valoracionPromedio.toFixed(1)}
                      </span>
                      {vet.totalResenas !== undefined && (
                        <span className="text-xs text-slate-400">({vet.totalResenas})</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 gap-3">
          <span className="text-xs text-slate-500">
            Página <span className="font-semibold text-slate-700">{paginaActual}</span> de{' '}
            <span className="font-semibold text-slate-700">{totalPaginas}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};