import { apiRequest } from '../../../services/apiClient';

export interface DashboardEstadisticasDTO {
  totalClientes: number;
  totalVeterinariosActivos: number;
  totalMascotas: number;
  totalCitas: number;
}

export interface CitasReporteDTO {
  fechaInicio: string;
  fechaFin: string;
  totalCitas: number;
  desglosePorEstado: Record<string, number>;
}

export interface VeterinarioRankingDTO {
  veterinarianId: string;
  nombreCompleto: string;
  citasAtendidas: number;
}

export interface MascotasEspecieDTO {
  especie: string;
  cantidad: number;
}

export const adminReportsService = {
  async obtenerEstadisticasDashboard(): Promise<DashboardEstadisticasDTO> {
    return apiRequest<DashboardEstadisticasDTO>('/api/admin/estadisticas');
  },

  async obtenerReporteCitas(fechaInicio: string, fechaFin: string): Promise<CitasReporteDTO> {
    return apiRequest<CitasReporteDTO>(
      `/api/admin/reportes/citas?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
    );
  },

  async obtenerRankingVeterinarios(): Promise<VeterinarioRankingDTO[]> {
    return apiRequest<VeterinarioRankingDTO[]>('/api/admin/reportes/veterinarios');
  },

  async obtenerReporteMascotasPorEspecie(): Promise<MascotasEspecieDTO[]> {
    return apiRequest<MascotasEspecieDTO[]>('/api/admin/reportes/mascotas');
  },
};
