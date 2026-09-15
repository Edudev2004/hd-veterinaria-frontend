import React from 'react';
import { BarChart3, CalendarDays, PawPrint, Stethoscope } from 'lucide-react';

interface AppointmentReport {
  id: string;
  date: string;
  owner: string;
  pet: string;
  veterinarian: string;
  specialty: string;
  status: string;
}

interface VeterinarianReport {
  id: string;
  name: string;
  specialty: string;
  appointments: number;
}

interface SpeciesReport {
  species: string;
  count: number;
}

export const mockAppointments: AppointmentReport[] = [
  {
    id: '1',
    date: '2026-09-01',
    owner: 'Carlos Mendoza',
    pet: 'Max',
    veterinarian: 'Dr. Juan Pérez',
    specialty: 'Medicina General',
    status: 'Atendida',
  },
  {
    id: '2',
    date: '2026-09-03',
    owner: 'María López',
    pet: 'Luna',
    veterinarian: 'Dra. Ana Torres',
    specialty: 'Dermatología',
    status: 'Atendida',
  },
  {
    id: '3',
    date: '2026-09-05',
    owner: 'Pedro Ramírez',
    pet: 'Rocky',
    veterinarian: 'Dr. Juan Pérez',
    specialty: 'Medicina General',
    status: 'Pendiente',
  },
  {
    id: '4',
    date: '2026-09-08',
    owner: 'Laura García',
    pet: 'Milo',
    veterinarian: 'Dr. Carlos Ruiz',
    specialty: 'Cirugía Veterinaria',
    status: 'Atendida',
  },
  {
    id: '5',
    date: '2026-09-10',
    owner: 'José Fernández',
    pet: 'Nala',
    veterinarian: 'Dra. Ana Torres',
    specialty: 'Dermatología',
    status: 'Atendida',
  },
  {
    id: '6',
    date: '2026-09-12',
    owner: 'Andrea Castillo',
    pet: 'Simba',
    veterinarian: 'Dr. Carlos Ruiz',
    specialty: 'Odontología',
    status: 'Pendiente',
  },
];

export const mockVeterinarians: VeterinarianReport[] = [
  {
    id: '1',
    name: 'Dr. Juan Pérez',
    specialty: 'Medicina General',
    appointments: 24,
  },
  {
    id: '2',
    name: 'Dra. Ana Torres',
    specialty: 'Dermatología',
    appointments: 19,
  },
  {
    id: '3',
    name: 'Dr. Carlos Ruiz',
    specialty: 'Cirugía Veterinaria',
    appointments: 15,
  },
  {
    id: '4',
    name: 'Dra. Elena Vargas',
    specialty: 'Odontología',
    appointments: 11,
  },
];

export const mockSpecies: SpeciesReport[] = [
  {
    species: 'Perros',
    count: 42,
  },
  {
    species: 'Gatos',
    count: 28,
  },
  {
    species: 'Aves',
    count: 10,
  },
  {
    species: 'Otros',
    count: 5,
  },
];

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Reportes y Estadísticas
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Consulta información estadística y reportes del sistema veterinario.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <CalendarDays size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Citas por período
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta las citas registradas durante un período determinado.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Stethoscope size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Veterinarios más solicitados
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta el ranking de veterinarios según las atenciones.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <PawPrint size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Mascotas por especie
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Visualiza las mascotas atendidas agrupadas por especie.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <BarChart3 size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Estadísticas generales
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta los principales indicadores del sistema.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">
          Panel de reportes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Los reportes y estadísticas estarán disponibles en este panel.
        </p>
      </div>
    </div>
  );
};