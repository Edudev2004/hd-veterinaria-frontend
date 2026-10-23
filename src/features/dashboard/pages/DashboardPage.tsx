import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Calendar, AlertTriangle, Plus, Clock, Loader2, PawPrint, CheckCircle2 } from 'lucide-react';
import { getMyPets } from '@/services/petApi';
import { getCitas, splitLocalDateTime, normalizarEstado } from '@/services/citaService';
import type { Mascota } from '@/services/petService';
import type { CitaDetallada } from '@/types/cita.types';

const DEFAULT_PET_IMAGE = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80";

const calcularEdad = (fechaNacimiento?: string): string => {
  if (!fechaNacimiento) return "Edad no especificada";
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return "Edad no especificada";
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  if (edad <= 0) {
    const meses = Math.max(1, (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth()));
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }
  return `${edad} ${edad === 1 ? 'año' : 'años'}`;
};

const formatFechaCita = (fechaHora: string): { dia: string; mes: string; hora: string } => {
  const fecha = new Date(fechaHora);
  if (Number.isNaN(fecha.getTime())) {
    try {
      const parts = splitLocalDateTime(fechaHora);
      return { dia: "--", mes: "---", hora: parts.hour };
    } catch {
      return { dia: "--", mes: "---", hora: "" };
    }
  }
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = fecha.toLocaleDateString("es-ES", { month: "short" }).replace(".", "").toUpperCase();
  const hora = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  return { dia, mes, hora };
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<CitaDetallada[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [petsData, citasData] = await Promise.all([
          getMyPets(),
          getCitas()
        ]);

        if (active) {
          setMascotas(petsData);
          setCitas(citasData);
        }
      } catch (err: any) {
        if (active) {
          console.error("Error al cargar datos del dashboard:", err);
          setError(err?.message || "No se pudieron cargar los datos del panel.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void cargarDatos();

    return () => {
      active = false;
    };
  }, []);

  // Filtrar próximas citas activas (pendientes o confirmadas) ordenadas cronológicamente
  const proximasCitas = citas
    .filter((c) => {
      const estado = normalizarEstado(c.estado);
      return estado === 'pendiente' || estado === 'confirmada';
    })
    .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
    .slice(0, 3);

  const proximaCita = proximasCitas.length > 0 ? proximasCitas[0] : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-[#0d9488] mb-3" />
        <p className="text-sm font-medium">Cargando el resumen de tus mascotas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Subtitle */}
      <p className="text-slate-500 font-normal text-base -mt-4">
        Aquí está el resumen del bienestar de tus mascotas.
      </p>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-bold text-amber-900 underline hover:text-amber-950 ml-4"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Top Grid: Próximas Citas & Avisos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Citas Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">
                Próximas Citas
              </h3>
              <Link
                to="/citas"
                className="text-xs font-semibold text-[#0d9488] hover:underline flex items-center gap-1"
              >
                Ver todas &rsaquo;
              </Link>
            </div>

            {proximasCitas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">No tienes citas próximas agendadas</p>
                <p className="text-xs text-slate-400 mt-1">Agenda una atención médica cuando lo necesites</p>
                <button
                  onClick={() => navigate('/citas?action=new')}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0f766e] transition-colors"
                >
                  + Agendar Cita
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {proximasCitas.map((cita) => {
                  const { dia, mes, hora } = formatFechaCita(cita.fecha_hora);
                  const esConfirmada = normalizarEstado(cita.estado) === 'confirmada';

                  return (
                    <div
                      key={cita.id}
                      onClick={() => navigate(`/citas?detalle=${cita.id}`)}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm flex-shrink-0 ${
                            esConfirmada
                              ? 'bg-amber-500 text-white'
                              : 'bg-teal-600 text-white'
                          }`}
                        >
                          <span className="text-base leading-none">{dia}</span>
                          <span className="text-[10px] uppercase tracking-wider leading-none mt-0.5">
                            {mes}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#0d9488] transition-colors">
                            {cita.motivo || 'Consulta Médica'} &bull; {cita.mascota.nombre}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {hora} &bull; Dr(a). {cita.veterinario.nombre}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-3">
                        <Badge variant={esConfirmada ? 'confirmed' : 'pending'}>
                          {esConfirmada ? 'Confirmada' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Avisos Card */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-outfit mb-4">
              Avisos
            </h3>

            {mascotas.length === 0 ? (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/60 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                  <PawPrint className="w-4 h-4 text-[#0d9488] flex-shrink-0" />
                  Registra a tu Mascota
                </div>
                <p className="text-xs text-teal-900/80 leading-relaxed">
                  Para poder agendar citas médicas y llevar el historial, primero registra a tus mascotas en el sistema.
                </p>
                <button
                  onClick={() => navigate('/mascotas')}
                  className="text-xs font-bold text-[#0d9488] underline hover:text-[#0f766e] mt-1 self-start"
                >
                  Registrar ahora
                </button>
              </div>
            ) : proximaCita ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/60 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  {normalizarEstado(proximaCita.estado) === 'confirmada' ? 'Cita Confirmada Próxima' : 'Cita Pendiente de Atención'}
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  <strong>{proximaCita.mascota.nombre}</strong> tiene atención con Dr(a). {proximaCita.veterinario.nombre}. Recuerda asistir 10 minutos antes.
                </p>
                <button
                  onClick={() => navigate(`/citas?detalle=${proximaCita.id}`)}
                  className="text-xs font-bold text-amber-900 underline hover:text-amber-950 mt-1 self-start"
                >
                  Ver detalles de la cita
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  Todo al día
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  No tienes citas ni avisos pendientes. Tus mascotas cuentan con su expediente listo.
                </p>
                <button
                  onClick={() => navigate('/citas?action=new')}
                  className="text-xs font-bold text-emerald-900 underline hover:text-emerald-950 mt-1 self-start"
                >
                  Agendar una nueva cita
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Mis Mascotas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 font-outfit">
            Mis Mascotas ({mascotas.length})
          </h3>
          <button
            onClick={() => navigate('/mascotas')}
            className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Añadir Mascota
          </button>
        </div>

        {mascotas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/70 p-10 text-center flex flex-col items-center justify-center shadow-sm">
            <PawPrint className="w-12 h-12 text-slate-300 mb-3" />
            <h4 className="text-base font-bold text-slate-800">Aún no tienes mascotas registradas</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Registra a tus perros, gatos u otras mascotas para poder agendar consultas médicas y acceder a su historial clínico.
            </p>
            <button
              onClick={() => navigate('/mascotas')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0f766e] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar mi primera mascota
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mascotas.map((pet) => {
              const edadTexto = calcularEdad(pet.fechaNacimiento);
              const imagen = pet.fotoUrl || DEFAULT_PET_IMAGE;

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={imagen}
                      alt={pet.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_PET_IMAGE;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="healthy">Registrada</Badge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 truncate">{pet.nombre}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {pet.especie} &bull; {pet.raza || "Sin raza"} &bull; {edadTexto}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => navigate(`/citas?action=new`)}
                        className="py-2 px-3 bg-teal-50 text-[#0d9488] border border-teal-200 rounded-xl text-xs font-semibold hover:bg-teal-100/70 transition-all flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Agendar
                      </button>
                      <button
                        onClick={() => navigate(`/mascotas`)}
                        className="py-2 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                      >
                        <PawPrint className="w-3.5 h-3.5 text-slate-400" />
                        Expediente
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
