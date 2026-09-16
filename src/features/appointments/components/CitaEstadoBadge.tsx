import React from 'react';
import { Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { EstadoCita } from '../../../types/cita.types';

interface CitaEstadoBadgeProps {
  estado: EstadoCita;
  motivo?: string | null;
  className?: string;
  size?: 'sm' | 'md';
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
    classes: 'bg-amber-50 text-amber-800 border-amber-200/90 shadow-sm',
    dotColor: 'bg-amber-500 animate-pulse',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
  },
  atendida: {
    label: 'Atendida',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 shadow-sm',
    dotColor: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
  },
  no_atendida: {
    label: 'No Atendida',
    classes: 'bg-orange-50 text-orange-800 border-orange-200/90 shadow-sm',
    dotColor: 'bg-orange-500',
    icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
  },
  cancelada: {
    label: 'Cancelada',
    classes: 'bg-rose-50 text-rose-700 border-rose-200/90 shadow-sm',
    dotColor: 'bg-rose-500',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />
  }
};

export const CitaEstadoBadge: React.FC<CitaEstadoBadgeProps> = ({
  estado,
  motivo,
  className = '',
  size = 'md'
}) => {
  const config = ESTADOS_CONFIG[estado] || ESTADOS_CONFIG.pendiente;
  const paddingClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const tooltipText =
    estado === 'cancelada' && motivo
      ? `Cita Cancelada: ${motivo}`
      : `Estado de la cita: ${config.label}`;

  return (
    <span
      title={tooltipText}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${paddingClasses} ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
