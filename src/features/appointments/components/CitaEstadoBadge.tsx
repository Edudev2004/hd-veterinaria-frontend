import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { EstadoCita } from '../../../types/cita.types';

interface CitaEstadoBadgeProps {
  estado: EstadoCita;
  className?: string;
}

interface EstadoConfig {
  label: string;
  classes: string;
  dotColor: string;
  icon: React.ReactNode;
}

const ESTADOS_CONFIG: Record<EstadoCita, EstadoConfig> = {
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotColor: 'bg-amber-500 animate-pulse',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
  },
  atendida: {
    label: 'Atendida',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotColor: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
  },
  no_atendida: {
    label: 'No Atendida',
    classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotColor: 'bg-rose-500',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
  },
  cancelada: {
    label: 'Cancelada',
    classes: 'bg-slate-100 text-slate-600 border-slate-200/80',
    dotColor: 'bg-slate-400',
    icon: <XCircle className="w-3.5 h-3.5 text-slate-500" />
  }
};

export const CitaEstadoBadge: React.FC<CitaEstadoBadgeProps> = ({ estado, className = '' }) => {
  const config = ESTADOS_CONFIG[estado] || ESTADOS_CONFIG.pendiente;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
