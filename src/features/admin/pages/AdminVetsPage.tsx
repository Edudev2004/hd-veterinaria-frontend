import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Search,
  Users,
  UserPlus,
  X,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Power,
  AlertTriangle,
  Edit2,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { adminVeterinarianService, AdminVeterinarianDTO } from '../services/adminVeterinarianService';
import { adminSpecialtiesService, SpecialtyDTO } from '../services/adminSpecialtiesService';

const ITEMS_POR_PAGINA = 5;

export const AdminVetsPage: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<AdminVeterinarianDTO[]>([]);
  const [especialidades, setEspecialidades] = useState<SpecialtyDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de control para la US-28
  const [vetAConfirmar, setVetAConfirmar] = useState<AdminVeterinarianDTO | null>(null);
  const [vetAEditar, setVetAEditar] = useState<AdminVeterinarianDTO | null>(null);

  const [editFormData, setEditFormData] = useState({
    dni: '',
    nombre: '',
    correo: '',
    especialidadId: '',
    telefono: '',
  });

  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    correo: '',
    password: '',
    especialidadId: '',
    telefono: '',
  });

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [vets, specs] = await Promise.all([
        adminVeterinarianService.listar(),
        adminSpecialtiesService.listarTodas(),
      ]);
      setVeterinarios(vets);
      setEspecialidades(specs);
      if (specs.length > 0) {
        setFormData((prev) => ({ ...prev, especialidadId: prev.especialidadId || specs[0].id }));
        setEditFormData((prev) => ({ ...prev, especialidadId: prev.especialidadId || specs[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de veterinarios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const veterinariosFiltrados = useMemo(() => {
    return veterinarios.filter((vet) =>
      vet.fullName.toLowerCase().includes(busqueda.toLowerCase()) ||
      vet.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      (vet.dni && vet.dni.includes(busqueda))
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const splitNombre = (nombreCompleto: string) => {
    const partes = nombreCompleto.trim().split(/\s+/);
    if (partes.length === 1) {
      return { firstName: partes[0], lastName: partes[0] };
    }
    const firstName = partes[0];
    const lastName = partes.slice(1).join(' ');
    return { firstName, lastName };
  };

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.password.trim()) {
      return;
    }

    const { firstName, lastName } = splitNombre(formData.nombre);
    const dni = formData.dni.trim() || `10${Math.floor(100000 + Math.random() * 900000)}`;

    setIsSubmitting(true);
    try {
      const nuevo = await adminVeterinarianService.registrar({
        dni,
        firstName,
        lastName,
        email: formData.correo.trim(),
        password: formData.password.trim(),
        specialtyIds: formData.especialidadId ? [formData.especialidadId] : [],
      });

      setVeterinarios((prev) => [nuevo, ...prev]);
      setFormData({
        dni: '',
        nombre: '',
        correo: '',
        password: '',
        especialidadId: especialidades[0]?.id || '',
        telefono: '',
      });
      setModalRegistroAbierto(false);
      setMensajeExito(`Veterinario ${nuevo.fullName} registrado exitosamente.`);
      setTimeout(() => setMensajeExito(null), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al registrar el veterinario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEstado = async () => {
    if (!vetAConfirmar) return;

    try {
      const actualizado = await adminVeterinarianService.cambiarEstado(vetAConfirmar.id);
      setVeterinarios((prev) =>
        prev.map((v) => (v.id === vetAConfirmar.id ? actualizado : v))
      );
      const nuevoEstadoTexto = actualizado.active ? 'activo' : 'inactivo';
      setMensajeExito(`El veterinario ${actualizado.fullName} ahora está ${nuevoEstadoTexto}.`);
      setVetAConfirmar(null);
      setTimeout(() => setMensajeExito(null), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al cambiar estado.');
    }
  };

  const iniciarEdicion = (vet: AdminVeterinarianDTO) => {
    setVetAEditar(vet);
    // Find matching specialty ID if possible
    const specNombre = vet.specialties?.[0];
    const specMatch = especialidades.find((s) => s.name === specNombre);

    setEditFormData({
      dni: vet.dni || '',
      nombre: vet.fullName,
      correo: vet.email,
      especialidadId: specMatch?.id || especialidades[0]?.id || '',
      telefono: '',
    });
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetAEditar) return;

    const { firstName, lastName } = splitNombre(editFormData.nombre);
    const dni = editFormData.dni.trim() || vetAEditar.dni || `10${Math.floor(100000 + Math.random() * 900000)}`;

    setIsSubmitting(true);
    try {
      const actualizado = await adminVeterinarianService.actualizar(vetAEditar.id, {
        dni,
        firstName,
        lastName,
        email: editFormData.correo.trim(),
        specialtyIds: editFormData.especialidadId ? [editFormData.especialidadId] : [],
      });

      setVeterinarios((prev) =>
        prev.map((v) => (v.id === vetAEditar.id ? actualizado : v))
      );
      setVetAEditar(null);
      setMensajeExito(`Datos del Dr./Dra. ${actualizado.fullName} actualizados con éxito.`);
      setTimeout(() => setMensajeExito(null), 3500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar veterinario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalActivos = useMemo(
    () => veterinarios.filter((v) => v.active).length,
    [veterinarios]
  );
  const totalInactivos = useMemo(
    () => veterinarios.filter((v) => !v.active).length,
    [veterinarios]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900 font-outfit">
              Gestión de Veterinarios
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Administra el equipo médico, sus especialidades y estados de actividad.
          </p>
        </div>

        <button
          onClick={() => setModalRegistroAbierto(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Veterinario
        </button>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{mensajeExito}</p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center justify-between">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => void cargarDatos()}
            className="text-sm font-bold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Registrados
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {veterinarios.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Médicos Activos
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalActivos}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Médicos Inactivos
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalInactivos}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Veterinario</th>
                  <th className="py-3.5 px-6">DNI</th>
                  <th className="py-3.5 px-6">Especialidad</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {veterinariosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      No se encontraron veterinarios registrados.
                    </td>
                  </tr>
                ) : (
                  veterinariosPaginados.map((vet) => (
                    <tr key={vet.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {vet.firstName ? vet.firstName.charAt(0) : 'D'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{vet.fullName}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {vet.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        {vet.dni || '—'}
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {vet.specialties && vet.specialties.length > 0
                            ? vet.specialties.join(', ')
                            : 'Medicina General'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            vet.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              vet.active ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {vet.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => iniciarEdicion(vet)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Editar veterinario"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setVetAConfirmar(vet)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              vet.active
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={vet.active ? 'Desactivar veterinario' : 'Activar veterinario'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                disabled={paginaActual === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Registro */}
      {modalRegistroAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit">
                  Registrar Nuevo Veterinario
                </h2>
              </div>
              <button
                onClick={() => setModalRegistroAbierto(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrar} className="p-6 overflow-y-auto flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  DNI (Documento de Identidad)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="dni"
                    placeholder="Ej. 70123456"
                    value={formData.dni}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

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
                  Contraseña Inicial *
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Especialidad *
                </label>
                <select
                  name="especialidadId"
                  value={formData.especialidadId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalRegistroAbierto(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Veterinario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {vetAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-outfit">
                  Editar Datos del Veterinario
                </h2>
              </div>
              <button
                onClick={() => setVetAEditar(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="p-6 overflow-y-auto flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  DNI (Documento de Identidad)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="dni"
                    value={editFormData.dni}
                    onChange={handleEditInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

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
                    value={editFormData.nombre}
                    onChange={handleEditInputChange}
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
                    value={editFormData.correo}
                    onChange={handleEditInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Especialidad *
                </label>
                <select
                  name="especialidadId"
                  value={editFormData.especialidadId}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVetAEditar(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
                vetAConfirmar.active
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
                <strong className="text-slate-800">{vetAConfirmar.fullName}</strong> a{' '}
                <span className="font-semibold capitalize">
                  {vetAConfirmar.active ? 'Inactivo' : 'Activo'}
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
                onClick={() => void handleToggleEstado()}
                className={`flex-1 py-2 text-sm font-semibold text-white rounded-xl shadow-sm transition-all cursor-pointer ${
                  vetAConfirmar.active
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
