import React, { useEffect, useState } from "react";
import { ChevronDown, ClipboardPlus, Stethoscope } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { vetScheduleService } from "../../appointments/services/vetScheduleService";
import type { CitaAgenda } from "../../appointments/types/vetSchedule.types";
import { VetConsultationForm } from "../components/VetConsultationForm";
import { VetConsultationSummary } from "../components/VetConsultationSummary";
import { vetConsultationService } from "../services/vetConsultationService";
import type { RegistroAtencion } from "../types/vetConsultation.types";
import { MarkAsAttendedDialog } from "../components/MarkAsAttendedDialog";
import { MarkAsNotAttendedDialog } from "../components/MarkAsNotAttendedDialog";

export const VetConsultationsPage: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const { user } = useAuth();

  const [citasEnCurso, setCitasEnCurso] = useState<CitaAgenda[]>([]);
  const [registros, setRegistros] = useState<
    Record<string, RegistroAtencion | null>
  >({});
  const [citaExpandidaId, setCitaExpandidaId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [citaGuardandoId, setCitaGuardandoId] = useState<string | null>(null);
  const [mensajesExito, setMensajesExito] = useState<Record<string, string>>(
    {},
  );

    const [citaPorConfirmar, setCitaPorConfirmar] = useState<CitaAgenda | null>(
    null,
  );
  const [marcandoAtendida, setMarcandoAtendida] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState("");

  const [citaPorNoAtender, setCitaPorNoAtender] = useState<CitaAgenda | null>(
    null,
  );
  const [marcandoNoAtendida, setMarcandoNoAtendida] = useState(false);

  useEffect(() => {
    if (!user) {
      setCitasEnCurso([]);
      setRegistros({});
      setCargando(false);
      return;
    }

    const cargarAtencionesEnCurso = async (): Promise<void> => {
      setCargando(true);

      const atencionesEnCurso = vetConsultationService.getAtencionesEnCurso(
        user.id,
      );

      const citas = await Promise.all(
        atencionesEnCurso.map((atencion) =>
          vetScheduleService.getCitaById(atencion.citaId, user.id),
        ),
      );

      const citasEncontradas = citas.filter(
        (cita): cita is CitaAgenda => cita !== null,
      );

      const registrosCargados = await Promise.all(
        citasEncontradas.map(async (cita) => [
          cita.id,
          await vetConsultationService.getAtencionByCita(cita.id, user.id),
        ]),
      );

      setCitasEnCurso(citasEncontradas);
      setRegistros(Object.fromEntries(registrosCargados));

      if (citaId && citasEncontradas.some((cita) => cita.id === citaId)) {
        setCitaExpandidaId(citaId);
      }

      setCargando(false);
    };

    void cargarAtencionesEnCurso();
  }, [citaId, user]);

  const alternarDetalle = (id: string): void => {
    setCitaExpandidaId((idActual) => (idActual === id ? null : id));
  };

  const confirmarCitaAtendida = async (): Promise<void> => {
    if (!user || !citaPorConfirmar) {
      return;
    }

    setMarcandoAtendida(true);

    try {
      const citaActualizada = await vetScheduleService.marcarCitaComoAtendida(
        citaPorConfirmar.id,
        user.id,
      );

      if (!citaActualizada) {
        return;
      }

      vetConsultationService.limpiarAtencionActiva(
        user.id,
        citaPorConfirmar.id,
      );

      setCitasEnCurso((citas) =>
        citas.filter((cita) => cita.id !== citaPorConfirmar.id),
      );

      setCitaExpandidaId(null);
      setMensajeAccion(
        `${citaPorConfirmar.mascota.nombre} fue marcada como atendida.`,
      );
      setCitaPorConfirmar(null);
    } finally {
      setMarcandoAtendida(false);
    }
  };

  const guardarRegistro = async (
    citaSeleccionada: CitaAgenda,
    values: {
      diagnostico: string;
      tratamiento: string;
      notas: string;
    },
  ): Promise<void> => {
    if (!user) {
      return;
    }

    setCitaGuardandoId(citaSeleccionada.id);
    setMensajesExito((mensajes) => ({
      ...mensajes,
      [citaSeleccionada.id]: "",
    }));

    try {
      const registroGuardado = await vetConsultationService.guardarAtencion({
        citaId: citaSeleccionada.id,
        veterinarioId: user.id,
        ...values,
      });

      setRegistros((registrosActuales) => ({
        ...registrosActuales,
        [citaSeleccionada.id]: registroGuardado,
      }));

      setMensajesExito((mensajes) => ({
        ...mensajes,
        [citaSeleccionada.id]: "Atención registrada correctamente.",
      }));
    } finally {
      setCitaGuardandoId(null);
    }
  };

  if (cargando) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Cargando atenciones en curso...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-outfit text-2xl font-bold text-slate-900">
          Atenciones Médicas
        </h1>
        <p className="text-sm text-slate-500">
          Registra y consulta el diagnóstico y tratamiento de las citas
          iniciadas.
        </p>
      </div>

      {mensajeAccion && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {mensajeAccion}
        </p>
      )}

      {citasEnCurso.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-primary">
            <Stethoscope className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              No hay atenciones iniciadas
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Las citas aparecerán aquí cuando pulses “Iniciar atención” desde
              la Agenda Diaria.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {citasEnCurso.map((cita) => {
            const detalleVisible = citaExpandidaId === cita.id;
            const registro = registros[cita.id];
            const hora = new Date(cita.fecha_hora).toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <article
                key={cita.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <button
                  onClick={() => alternarDetalle(cita.id)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-slate-50"
                  aria-expanded={detalleVisible}
                >
                  {cita.mascota.fotoUrl ? (
                    <img
                      src={cita.mascota.fotoUrl}
                      alt={cita.mascota.nombre}
                      className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-tertiary text-primary">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">
                      {cita.mascota.nombre}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {cita.propietario.nombre} · {cita.motivo}
                    </p>
                    <p className="mt-1 text-xs font-medium text-primary">
                      Cita iniciada · {hora}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {registro && (
                      <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline">
                        Registrada
                      </span>
                    )}

                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        detalleVisible ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {detalleVisible && (
                  <div className="flex flex-col gap-5 border-t border-slate-100 bg-slate-50/70 p-5">
                    <VetConsultationSummary cita={cita} />

                    {mensajesExito[cita.id] && (
                      <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {mensajesExito[cita.id]}
                      </p>
                    )}

                    <VetConsultationForm
                      initialValues={{
                        diagnostico: registro?.diagnostico ?? "",
                        tratamiento: registro?.tratamiento ?? "",
                        notas: registro?.notas ?? "",
                      }}
                      guardando={citaGuardandoId === cita.id}
                      onSubmit={(values) => guardarRegistro(cita, values)}
                    />
                    {registro ? (
                      <div className="flex justify-end border-t border-slate-200 pt-5">
                        <button
                          type="button"
                          onClick={() => setCitaPorConfirmar(cita)}
                          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          Marcar como atendida
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Guarda el diagnóstico y tratamiento antes de finalizar
                        la atención.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {citasEnCurso.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-tertiary/40 p-4 text-primary">
          <ClipboardPlus className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            Las atenciones iniciadas se mantienen disponibles hasta que la cita
            sea marcada como atendida o no atendida.
          </p>
        </div>
      )}

      <MarkAsAttendedDialog
        abierto={Boolean(citaPorConfirmar)}
        nombreMascota={citaPorConfirmar?.mascota.nombre ?? ""}
        cargando={marcandoAtendida}
        onCancelar={() => setCitaPorConfirmar(null)}
        onConfirmar={confirmarCitaAtendida}
      />
    </div>
  );
};