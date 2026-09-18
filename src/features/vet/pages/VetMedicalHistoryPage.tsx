import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  PawPrint,
  Clock,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  ChevronRight,
  Printer,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  getTodasLasMascotasConHistorial,
  getHistorialPorMascota
} from '../../../services/historialService';
import { EntradaHistorialClinico, MascotaExpediente } from '../../../types/historial.types';
import { HistorialClinicoModal } from '../../pets/components/HistorialClinicoModal';

export const VetMedicalHistoryPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<
    { mascota: MascotaExpediente; totalAtenciones: number; ultimaAtencion?: string | null }[]
  >([]);
  const [selectedPet, setSelectedPet] = useState<MascotaExpediente | null>(null);
  const [entradas, setEntradas] = useState<EntradaHistorialClinico[]>([]);
  const [petSearchTerm, setPetSearchTerm] = useState<string>('');
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');
  const [speciesFilter, setSpeciesFilter] = useState<'todas' | 'perro' | 'gato' | 'otro'>('todas');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Cargar lista de pacientes al montar
  useEffect(() => {
    const list = getTodasLasMascotasConHistorial();
    setPacientes(list);
    if (list.length > 0 && !selectedPet) {
      setSelectedPet(list[0].mascota);
    }
  }, []);

  // Cargar historial médico cuando cambia la mascota seleccionada
  useEffect(() => {
    if (selectedPet) {
      setIsLoadingHistory(true);
      try {
        const data = getHistorialPorMascota(selectedPet.id);
        setEntradas(data);
      } catch (err) {
        console.error('Error al cargar historial del paciente:', err);
        setEntradas([]);
      } finally {
        setIsLoadingHistory(false);
      }
    } else {
      setEntradas([]);
    }
  }, [selectedPet]);

  // Filtrar lista de pacientes por término y especie
  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => {
      const { mascota } = item;
      const search = petSearchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        mascota.nombre.toLowerCase().includes(search) ||
        (mascota.raza && mascota.raza.toLowerCase().includes(search)) ||
        (mascota.propietario_nombre && mascota.propietario_nombre.toLowerCase().includes(search));

      const matchesSpecies =
        speciesFilter === 'todas' ||
        mascota.especie.toLowerCase() === speciesFilter ||
        (speciesFilter === 'perro' && mascota.especie.toLowerCase() === 'canino') ||
        (speciesFilter === 'gato' && mascota.especie.toLowerCase() === 'felino');

      return matchesSearch && matchesSpecies;
    });
  }, [pacientes, petSearchTerm, speciesFilter]);

  // Filtrar entradas de historial de la mascota seleccionada
  const entradasFiltradas = useMemo(() => {
    if (!historySearchTerm.trim()) return entradas;
    const term = historySearchTerm.toLowerCase().trim();
    return entradas.filter(
      (e) =>
        e.diagnostico.toLowerCase().includes(term) ||
        e.tratamiento.toLowerCase().includes(term) ||
        e.observaciones.toLowerCase().includes(term) ||
        e.veterinario.nombre.toLowerCase().includes(term) ||
        (e.datos && e.datos.toLowerCase().includes(term))
    );
  }, [entradas, historySearchTerm]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-12">
      {/* Cabecera del Módulo Veterinario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shadow-sm">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">
                Historial Clínico de Pacientes
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#0d9488]">
                <Sparkles className="w-3 h-3" /> US-19
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Consulta de expedientes, diagnósticos previos, tratamientos aplicados y observaciones clínicas
            </p>
          </div>
        </div>

        {selectedPet && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all border border-slate-200 shadow-xs"
              title="Imprimir expediente clínico"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Ver en Modal</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid Principal: Lista de Pacientes (Izq) + Expediente Detallado (Der) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Buscador y Selector de Pacientes */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-outfit">
              Pacientes Registrados ({pacientes.length})
            </h3>
            <p className="text-xs text-slate-500">
              Selecciona una mascota para consultar su expediente
            </p>
          </div>

          {/* Buscador de pacientes */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={petSearchTerm}
              onChange={(e) => setPetSearchTerm(e.target.value)}
              placeholder="Buscar por mascota, raza o dueño..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
            />
          </div>

          {/* Filtros rápidos por especie */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['todas', 'perro', 'gato'] as const).map((esp) => (
              <button
                key={esp}
                type="button"
                onClick={() => setSpeciesFilter(esp)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition-colors ${
                  speciesFilter === esp
                    ? 'bg-[#0d9488] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {esp === 'todas' ? 'Todos' : esp === 'perro' ? 'Caninos' : 'Felinos'}
              </button>
            ))}
          </div>

          {/* Listado scrolleable de mascotas */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {pacientesFiltrados.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                No se encontraron pacientes que coincidan con la búsqueda.
              </div>
            ) : (
              pacientesFiltrados.map((item) => {
                const isSelected = selectedPet?.id === item.mascota.id;
                return (
                  <button
                    key={item.mascota.id}
                    type="button"
                    onClick={() => setSelectedPet(item.mascota)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#0d9488] bg-teal-50/70 shadow-xs'
                        : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {item.mascota.foto_url ? (
                          <img
                            src={item.mascota.foto_url}
                            alt={item.mascota.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PawPrint className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm truncate">
                            {item.mascota.nombre}
                          </h4>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-white text-slate-500 border border-slate-200">
                            {item.mascota.especie}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.mascota.raza || 'Mestizo'} • Dueño: {item.mascota.propietario_nombre || 'Registrado'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#0d9488] block">
                        {item.totalAtenciones} {item.totalAtenciones === 1 ? 'visita' : 'visitas'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 ml-auto mt-1" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Visualizador del Expediente Clínico de la Mascota Seleccionada */}
        <div className="lg:col-span-8 space-y-5">
          {selectedPet ? (
            <>
              {/* Tarjeta de Perfil del Paciente */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                      {selectedPet.foto_url ? (
                        <img
                          src={selectedPet.foto_url}
                          alt={selectedPet.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PawPrint className="w-8 h-8 text-[#0d9488]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit">
                          {selectedPet.nombre}
                        </h2>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0d9488] border border-teal-200 capitalize">
                          {selectedPet.especie}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedPet.raza || 'Sin raza registrada'}
                        {selectedPet.sexo ? ` • ${selectedPet.sexo === 'hembra' ? 'Hembra' : 'Macho'}` : ''}
                        {' • '}
                        Tutor: <span className="font-semibold text-slate-700">{selectedPet.propietario_nombre || 'Carlos Propietario'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Consultas Médicas
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {entradas.length} {entradas.length === 1 ? 'atención' : 'atenciones'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Búsqueda dentro del Historial de la Mascota */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex items-center gap-3 shadow-xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                <input
                  type="text"
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  placeholder="Buscar en diagnósticos, medicamentos o tratamientos de esta mascota..."
                  className="w-full text-xs sm:text-sm focus:outline-none"
                />
                {historySearchTerm && (
                  <button
                    type="button"
                    onClick={() => setHistorySearchTerm('')}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 shrink-0"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Entradas del Historial Clínico */}
              {isLoadingHistory ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500">Cargando consultas de la mascota...</p>
                </div>
              ) : entradasFiltradas.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    {historySearchTerm
                      ? 'Sin resultados para la búsqueda'
                      : 'Sin atenciones previas registradas'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md">
                    {historySearchTerm
                      ? `No se encontraron diagnósticos que contengan "${historySearchTerm}".`
                      : `La mascota ${selectedPet.nombre} aún no tiene consultas previas archivadas en su expediente médico.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entradasFiltradas.map((entrada, idx) => {
                    const fechaObj = new Date(entrada.fecha_atencion);
                    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });
                    const horaFormateada = fechaObj.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={entrada.id}
                        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                      >
                        {/* Cabecera de la Entrada Médica */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0d9488] flex items-center justify-center shrink-0">
                              <Activity className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-black text-slate-900 capitalize">
                                  {fechaFormateada}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {horaFormateada}
                                </span>
                                {idx === 0 && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0d9488] border border-teal-200">
                                    Atención más reciente
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                  <Stethoscope className="w-3.5 h-3.5 text-[#0d9488]" />
                                  {entrada.veterinario.nombre}
                                </span>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-500 font-medium">
                                  {entrada.veterinario.especialidad}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[11px] font-mono text-slate-400 self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            Registro: {entrada.id}
                          </span>
                        </div>

                        {/* Motivo de consulta si existe */}
                        {entrada.motivo_consulta && (
                          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                            <span className="font-bold text-slate-700 block mb-0.5">
                              Motivo de Consulta:
                            </span>
                            <p className="text-slate-600 italic">
                              "{entrada.motivo_consulta}"
                            </p>
                          </div>
                        )}

                        {/* Sección 1: DIAGNÓSTICO */}
                        <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Stethoscope className="w-4 h-4 text-[#0d9488]" />
                            <span className="font-bold text-teal-900 uppercase tracking-wider text-[11px]">
                              Diagnóstico Médico
                            </span>
                          </div>
                          <p className="text-slate-800 font-bold text-sm leading-relaxed">
                            {entrada.diagnostico}
                          </p>
                        </div>

                        {/* Sección 2: TRATAMIENTO Y MEDICACIÓN */}
                        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Pill className="w-4 h-4 text-amber-600" />
                            <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                              Tratamiento y Prescripción de Medicación
                            </span>
                          </div>
                          <p className="text-slate-800 font-medium text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                            {entrada.tratamiento}
                          </p>
                        </div>

                        {/* Sección 3: OBSERVACIONES CLÍNICAS */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                          <div className="flex items-center gap-2 mb-1.5">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                              Observaciones y Recomendaciones Clínicas
                            </span>
                          </div>
                          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                            {entrada.observaciones}
                          </p>
                        </div>

                        {/* Signos Vitales / Datos Clínicos */}
                        {entrada.datos && (
                          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">
                              Constantes y Signos Vitales Registrados:
                            </span>
                            <span className="font-mono bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                              {entrada.datos}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0d9488] flex items-center justify-center">
                <PawPrint className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Selecciona una mascota del listado
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Haz clic en cualquiera de las mascotas a la izquierda para cargar y revisar su historial clínico detallado.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal flotante opcional para el veterinario */}
      {selectedPet && (
        <HistorialClinicoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mascotaId={selectedPet.id}
          mascotaNombre={selectedPet.nombre}
        />
      )}
    </div>
  );
};
