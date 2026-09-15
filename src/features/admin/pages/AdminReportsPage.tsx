import React, { useState } from 'react';
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
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  const filteredAppointments = mockAppointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.date}T00:00:00`);

    const start = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;

    const end = endDate
      ? new Date(`${endDate}T23:59:59`)
      : null;

    return (
      (!start || appointmentDate >= start) &&
      (!end || appointmentDate <= end)
    );
  });

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

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Filtro por período
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Selecciona el período que deseas consultar en los reportes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Fecha de inicio
            </label>

            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Fecha de fin
            </label>

            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-slate-400"
            />
          </div>
        </div>
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
        <div className="mb-5 flex flex-col gap-1">
          <h2 className="text-lg font-bold text-slate-800">
            Citas por período
          </h2>

          <p className="text-sm text-slate-500">
            Citas registradas entre {startDate} y {endDate}.
          </p>

          <p className="mt-2 text-sm font-medium text-slate-700">
            Citas encontradas: {filteredAppointments.length}
          </p>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Fecha
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Propietario
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Mascota
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Veterinario
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Especialidad
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-4 text-slate-600">
                      {appointment.date}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {appointment.owner}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-800">
                      {appointment.pet}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {appointment.veterinarian}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {appointment.specialty}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          appointment.status === 'Atendida'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">
              No se encontraron citas para el período seleccionado.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Veterinarios más solicitados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ranking de veterinarios según la cantidad de atenciones registradas.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 font-semibold text-slate-700">
                  Posición
                </th>

                <th className="px-4 py-3 font-semibold text-slate-700">
                  Veterinario
                </th>

                <th className="px-4 py-3 font-semibold text-slate-700">
                  Especialidad
                </th>

                <th className="px-4 py-3 text-center font-semibold text-slate-700">
                  Atenciones
                </th>
              </tr>
            </thead>

            <tbody>
              {mockVeterinarians
                .sort((a, b) => b.appointments - a.appointments)
                .map((veterinarian, index) => (
                  <tr
                    key={veterinarian.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      #{index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-800">
                      {veterinarian.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {veterinarian.specialty}
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-slate-800">
                      {veterinarian.appointments}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">
          Panel de reportes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Los demás reportes y estadísticas estarán disponibles en este panel.
        </p>
      </div>
    </div>
  );
};