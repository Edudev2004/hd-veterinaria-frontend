import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { vetScheduleService } from '../../appointments/services/vetScheduleService';
import type { CitaAgenda } from '../../appointments/types/vetSchedule.types';

export const VetConsultationsPage: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const navigate = useNavigate();
  const [cita, setCita] = useState<CitaAgenda | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!citaId) {
      setCargando(false);
      return;
    }
    setCargando(true);
    vetScheduleService.getCitaById(citaId).then((data) => {
      setCita(data);
      setCargando(false);
    });
  }, [citaId]);

  if (!citaId) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Atenciones y Consultas Médicas</h1>
          <p className="text-sm text-slate-500">Selecciona una cita desde tu agenda diaria para ver su detalle</p>
        </div>

        <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Ninguna cita seleccionada</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Ve a "Agenda Diaria" y haz clic sobre una cita para revisar su información.
          </p>
        </div>
      </div>
    );
  }

  if (cargando) {
    return <p className="text-center text-sm text-slate-400 py-12">Cargando cita...</p>;
  }

  return null;
};