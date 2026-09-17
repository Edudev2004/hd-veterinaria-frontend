import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Search,
  Users,
  UserPlus,
  X,
  CheckCircle2,
  Mail,
  Phone,
  Lock,
  User,
  Power,
  AlertTriangle,
} from 'lucide-react';

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

const STORAGE_KEY = 'hd_admin_veterinarios';

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

const ESPECIALIDADES = [
  'Medicina General y Cirugía',
  'Dermatología Veterinaria',
  'Oftalmología',
  'Traumatología y Ortopedia',
  'Odontología Veterinaria',
  'Cardiología',
  'Oncología',
  'Animales Exóticos',
];

const ITEMS_POR_PAGINA = 5;

export const AdminVetsPage: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      if (guardados) return JSON.parse(guardados);
    } catch {
      // Fallback
    }
    return VETS_INICIALES;
  });

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Estado para el modal de confirmación de activación / desactivación
  const [vetAConfirmar, setVetAConfirmar] = useState<Veterinario | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    especialidad: ESPECIALIDADES[0],
    telefono: '',
  });

  // Guardar en localStorage ante cualquier cambio de la lista
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(veterinarios));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [veterinarios]);

  const veterinariosFiltrados = useMemo(() => {
    return veterinarios.filter((vet) =>
      vet.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [veterinarios, busqueda]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const totalPaginas = Math.ceil(veterinariosFiltrados.length / ITEMS_POR_PAGINA) || 1;
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const veterinariosPaginados = veterinariosFiltrados.slice(
    indiceInicio,
    indiceInicio + ITEMS_POR_PAGINA
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.password.trim() || !formData.telefono.trim()) {
      return;
    }

    const nuevoVet: Veterinario = {
      id: `vet-${Date.now()}`,
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim(),
      telefono: formData.telefono.trim(),
      especialidad: formData.especialidad,
      estado: 'activo',
      valoracionPromedio: 5.0,
      totalResenas: 0,
    };

    setVeterinarios((prev) => [nuevoVet, ...prev]);
    setFormData({
      nombre: '',
      correo: '',
      password: '',
      especialidad: ESPECIALIDADES[0],
      telefono: '',
    });
    setModalAbierto(false);
    setMensajeExito(`Veterinario ${nuevoVet.nombre} registrado exitosamente.`);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  // Función para alternar el estado
  const handleToggleEstado = () => {
    if (!vetAConfirmar) return;

    const nuevoEstado = vetAConfirmar.estado === 'activo' ? 'inactivo' : 'activo';
    setVeterinarios((prev) =>
      prev.map((v) =>
        v.id === vetAConfirmar.id ? { ...v, estado: nuevoEstado } : v
      )
    );

    setMensajeExito(
      `El veterinario ${vetAConfirmar.nombre} ahora está ${nuevoEstado}.`
    );
    setVetAConfirmar(null);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2">
      {/* Encabezado con Botón de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">
            Gestión de Personal Veterinario
          </h1>
          <p className="text-sm text-slate-500">
            Listado y control del equipo médico de la clínica.
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Veterinario
        </button>
      </div>

      {/* Mensaje de Éxito */}
      {mensajeExito && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Barra de Filtro / Buscador */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Mostrando {veterinariosFiltrados.length}{' '}
          {veterinariosFiltrados.length === 1 ? 'médico' : 'médicos'}
        </div>
      </div>

      {/* Tabla de Listado */}
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
                <th className="py-3.5 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {veterinariosPaginados.length > 0 ? (
                veterinariosPaginados.map((vet) => (
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
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => setVetAConfirmar(vet)}
                        title={vet.estado === 'activo' ? 'Desactivar veterinario' : 'Activar veterinario'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          vet.estado === 'activo'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {vet.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No se encontraron veterinarios</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Intenta con otro término de búsqueda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
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

      {/* Modal de Registro */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit">
                  Registrar Nuevo Veterinario
                </h2>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrar} className="p-6 overflow-y-auto flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Ej. Dra. Mariana Torres"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="correo"
                    required
                    placeholder="mariana.torres@hdveterinaria.com"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contraseña Temporal *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Especialidad *
                  </label>
                  <select
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {ESPECIALIDADES.map((esp) => (
                      <option key={esp} value={esp}>
                        {esp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="telefono"
                      required
                      placeholder="+51 999 888 777"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Guardar Veterinario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Estado */}
      {vetAConfirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 flex flex-col items-center text-center gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                vetAConfirmar.estado === 'activo'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit">
                ¿Confirmar cambio de estado?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ¿Deseas cambiar el estado del médico{' '}
                <strong className="text-slate-800">{vetAConfirmar.nombre}</strong> a{' '}
                <span className="font-semibold capitalize">
                  {vetAConfirmar.estado === 'activo' ? 'Inactivo' : 'Activo'}
                </span>
                ?
              </p>
            </div>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setVetAConfirmar(null)}
                className="flex-1 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleToggleEstado}
                className={`flex-1 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all cursor-pointer ${
                  vetAConfirmar.estado === 'activo'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};