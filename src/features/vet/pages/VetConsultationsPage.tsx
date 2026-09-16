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
    if (!citaId || !user) {
      setCita(null);
      setAtencionExistente(null);
      setCargando(false);
      return;
    }

    const cargarAtencion = async (): Promise<void> => {
      setCargando(true);
      setMensajeExito('');

      const citaEncontrada = await vetScheduleService.getCitaById(
        citaId,
        user.id
      );

      setCita(citaEncontrada);

      if (citaEncontrada) {
        const registro = await vetConsultationService.getAtencionByCita(
          citaId,
          user.id
        );

        setAtencionExistente(registro);
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
    if (!citaId || !user) {
      return;
    }

    setGuardando(true);
    setMensajeExito('');

    try {
      const registroGuardado = await vetConsultationService.guardarAtencion({
        citaId,
        veterinarioId: user.id,
        ...values
      });

      setAtencionExistente(registroGuardado);
      setMensajeExito('La atención clínica se guardó correctamente.');
    } finally {
      setGuardando(false);
    }
  };

  if (!citaId) {
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
              No hay una cita seleccionada
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              El registro clínico se habilita al pulsar “Iniciar atención” en
              una cita pendiente de la Agenda Diaria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <p className="py-12 text-center text-sm text-slate-400">
        Cargando atención médica...
      </p>
    );
  }

  if (!cita) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          No se encontró la cita solicitada o no pertenece a tu agenda.
        </p>
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