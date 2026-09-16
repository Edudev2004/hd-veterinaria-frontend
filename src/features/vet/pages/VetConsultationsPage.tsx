import React, { useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { vetScheduleService } from '../../appointments/services/vetScheduleService';
import type { CitaAgenda } from '../../appointments/types/vetSchedule.types';
import { VetConsultationForm } from '../components/VetConsultationForm';
import { VetConsultationSummary } from '../components/VetConsultationSummary';
import { vetConsultationService } from '../services/vetConsultationService';
import type { RegistroAtencion } from '../types/vetConsultation.types';

export const VetConsultationsPage: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const { user } = useAuth();

  const [cita, setCita] = useState<CitaAgenda | null>(null);
  const [atencionExistente, setAtencionExistente] =
    useState<RegistroAtencion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    if (!user) {
      setCita(null);
      setAtencionExistente(null);
      setCargando(false);
      return;
    }

    const cargarAtencion = async (): Promise<void> => {
      setCargando(true);
      setMensajeExito('');

      const atencionActiva = vetConsultationService.getAtencionActiva(user.id);
      const citaSeleccionadaId = citaId ?? atencionActiva?.citaId;

      if (!citaSeleccionadaId) {
        setCita(null);
        setAtencionExistente(null);
        setCargando(false);
        return;
      }

      const citaEncontrada = await vetScheduleService.getCitaById(
        citaSeleccionadaId,
        user.id
      );

      setCita(citaEncontrada);

      if (citaEncontrada) {
        const registro = await vetConsultationService.getAtencionByCita(
          citaSeleccionadaId,
          user.id
        );

        setAtencionExistente(registro);
      } else {
        setAtencionExistente(null);
      }

      setCargando(false);
    };

    void cargarAtencion();
  }, [citaId, user]);

  const guardarRegistro = async (values: {
    diagnostico: string;
    tratamiento: string;
    notas: string;
  }): Promise<void> => {
    if (!cita || !user) {
      return;
    }

    setGuardando(true);
    setMensajeExito('');

    try {
      const registroGuardado = await vetConsultationService.guardarAtencion({
        citaId: cita.id,
        veterinarioId: user.id,
        ...values
      });

      setAtencionExistente(registroGuardado);
      setMensajeExito('La atención clínica se guardó correctamente.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Cargando atención médica...
      </p>
    );
  }

  if (!cita) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-outfit text-2xl font-bold text-slate-900">
            Atenciones Médicas
          </h1>
          <p className="text-sm text-slate-500">
            Registro de diagnóstico y tratamiento.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-primary">
            <Stethoscope className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              No tienes una atención en curso
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              Inicia una atención desde una cita pendiente de la Agenda Diaria.
              La cita quedará disponible aquí hasta que la finalices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-outfit text-2xl font-bold text-slate-900">
          Registro de Atención Médica
        </h1>
        <p className="text-sm text-slate-500">
          Completa la información clínica de la cita seleccionada.
        </p>
      </div>

      <VetConsultationSummary cita={cita} />

      {mensajeExito && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {mensajeExito}
        </p>
      )}

      <VetConsultationForm
        initialValues={{
          diagnostico: atencionExistente?.diagnostico ?? '',
          tratamiento: atencionExistente?.tratamiento ?? '',
          notas: atencionExistente?.notas ?? ''
        }}
        guardando={guardando}
        onSubmit={guardarRegistro}
      />
    </div>
  );
};