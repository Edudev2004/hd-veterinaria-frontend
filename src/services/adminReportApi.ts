import { apiRequest } from './apiClient';

// ---- DTOs tal como los devuelve el backend (AdminReportController) ----

interface CitasReporteDTO {
  fechaInicio: string;
  fechaFin: string;
  totalCitas: number;
  desglosePorEstado: Record<string, number>;
}

interface VeterinarioRankingDTO {
  veterinarianId: string;
  nombreCompleto: string;
  citasAtendidas: number;
}

interface MascotasEspecieDTO {
  especie: string;
  cantidad: number;
}

interface DashboardEstadisticasDTO {
  totalClientes: number;
  totalVeterinariosActivos: number;
  totalMascotas: number;
  totalCitas: number;
}

// ---- Modelos que usa la UI ----

export interface EstadoCitaConteo {
  estado: string;
  etiqueta: string;
  cantidad: number;
}

export interface ReporteCitas {
  fechaInicio: string;
  fechaFin: string;
  total: number;
  porEstado: EstadoCitaConteo[];
}

export interface VeterinarioRanking {
  id: string;
  nombre: string;
  atenciones: number;
}

export interface MascotasPorEspecie {
  especie: string;
  cantidad: number;
}

export interface EstadisticasDashboard {
  totalClientes: number;
  veterinariosActivos: number;
  totalMascotas: number;
  totalCitas: number;
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
  NO_ATENDIDA: 'No atendida',
};

const ETIQUETAS_ESPECIE: Record<string, string> = {
  perro: 'Perros',
  gato: 'Gatos',
  otro: 'Otros',
};

export const etiquetaEstado = (estado: string): string =>
  ETIQUETAS_ESTADO[estado.toUpperCase()] ?? estado;

export const etiquetaEspecie = (especie: string | null): string => {
  if (!especie) return 'Sin especie';
  return ETIQUETAS_ESPECIE[especie.toLowerCase()] ?? especie;
};

export const getReporteCitas = async (
  fechaInicio: string,
  fechaFin: string,
): Promise<ReporteCitas> => {
  const params = new URLSearchParams({ fechaInicio, fechaFin });
  const dto = await apiRequest<CitasReporteDTO>(`/api/admin/reportes/citas?${params}`);

  const porEstado = Object.entries(dto.desglosePorEstado ?? {})
    .map(([estado, cantidad]) => ({ estado, etiqueta: etiquetaEstado(estado), cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return {
    fechaInicio: dto.fechaInicio,
    fechaFin: dto.fechaFin,
    total: dto.totalCitas,
    porEstado,
  };
};

export const getRankingVeterinarios = async (): Promise<VeterinarioRanking[]> => {
  const dtos = await apiRequest<VeterinarioRankingDTO[]>('/api/admin/reportes/veterinarios');
  return dtos.map((dto) => ({
    id: dto.veterinarianId,
    nombre: dto.nombreCompleto,
    atenciones: dto.citasAtendidas,
  }));
};

export const getMascotasPorEspecie = async (): Promise<MascotasPorEspecie[]> => {
  const dtos = await apiRequest<MascotasEspecieDTO[]>('/api/admin/reportes/mascotas');

  // Agrupa por etiqueta por si el backend devuelve "Perro" y "perro" por separado.
  const porEspecie = new Map<string, number>();
  for (const dto of dtos) {
    const especie = etiquetaEspecie(dto.especie);
    porEspecie.set(especie, (porEspecie.get(especie) ?? 0) + dto.cantidad);
  }

  return [...porEspecie.entries()]
    .map(([especie, cantidad]) => ({ especie, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
};

export const getEstadisticasDashboard = async (): Promise<EstadisticasDashboard> => {
  const dto = await apiRequest<DashboardEstadisticasDTO>('/api/admin/estadisticas');
  return {
    totalClientes: dto.totalClientes,
    veterinariosActivos: dto.totalVeterinariosActivos,
    totalMascotas: dto.totalMascotas,
    totalCitas: dto.totalCitas,
  };
};
