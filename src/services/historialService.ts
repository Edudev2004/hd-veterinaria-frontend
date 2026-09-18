/**
 * Servicio para gestión y consulta del Historial Clínico de Mascotas (US-19)
 * Basado estrictamente en bd-veterinaria-hd.sql
 * Tablas: diagnosticos, citas, mascotas, veterinarios, usuarios, especialidades
 */

import {
  DiagnosticoDB,
  EntradaHistorialClinico,
  HistorialMascotaResumen,
  MascotaExpediente,
  VeterinarioTratante
} from '../types/historial.types';
import { getAllPets } from './petService';
import vetsMock from '../features/appointments/mocks/veterinarians.json';

export const STORAGE_DIAGNOSTICOS_KEY = 'vethd_db_diagnosticos';

/**
 * Registros semilla de diagnósticos conforme al esquema de la tabla 'diagnosticos'
 * en bd-veterinaria-hd.sql vinculados a citas previas atendidas
 */
const DEFAULT_SEED_DIAGNOSTICOS: (DiagnosticoDB & {
  mascota_id: string;
  mascota_nombre: string;
  veterinario_id: string;
  veterinario_nombre: string;
  especialidad: string;
  fecha_atencion: string;
  motivo_consulta: string;
})[] = [
  // LUNA (Mascota ID 1) - Consulta Cardiológica
  {
    id: 'diag-seed-001',
    cita_id: 'cita-seed-atendida-001',
    mascota_id: '1',
    mascota_nombre: 'Luna',
    veterinario_id: '1',
    veterinario_nombre: 'Dr. Carlos López',
    especialidad: 'Cardiología',
    fecha_atencion: '2026-03-15T09:30:00.000Z',
    motivo_consulta: 'Evaluación cardiológica preventiva y control de jadeos esporádicos',
    diagnostico: 'Soplo cardíaco sistólico grado I incipiente con ritmo sinusal estable',
    datos: 'Peso: 28.5 kg | Temp: 38.4 °C | FC: 96 lpm | FR: 22 rpm | Condición corporal: 5/9',
    tratamiento: 'Enalapril 5 mg (1/2 comprimido vía oral cada 24 horas si presenta tos o cansancio al correr). Dieta prescrita baja en sodio. Evitar sobreesfuerzos en horarios de calor intenso.',
    notas: 'Paciente tranquila y cooperadora. Auscultación torácica revela soplo suave focalizado en foco mitral. Campos pulmonares limpios. Se programa ecocardiograma de control en 6 meses.',
    created_at: '2026-03-15T10:15:00.000Z'
  },
  // LUNA (Mascota ID 1) - Atención Preventiva y Vacunación
  {
    id: 'diag-seed-002',
    cita_id: 'cita-seed-atendida-002',
    mascota_id: '1',
    mascota_nombre: 'Luna',
    veterinario_id: '2',
    veterinario_nombre: 'Dra. Laura Veterinario',
    especialidad: 'Medicina General',
    fecha_atencion: '2025-11-10T11:00:00.000Z',
    motivo_consulta: 'Control anual preventivo, desparasitación interna y vacunación séxtuple',
    diagnostico: 'Paciente canino en óptimo estado de salud general. Vacunación y profilaxis al día',
    datos: 'Peso: 27.8 kg | Temp: 38.5 °C | FC: 100 lpm | Mucosas: rosadas | Hidratación: 100%',
    tratamiento: 'Refuerzo de vacuna Séxtuple Canina aplicado por vía subcutánea interescapular. Desparasitante oral NexGard Spectra (1 tableta masticable cada mes).',
    notas: 'Ganglios linfáticos palpables normales, dentadura en muy buen estado sin sarro significativo. No presentó reacciones adversas inmediatas a la inoculación.',
    created_at: '2025-11-10T11:40:00.000Z'
  },
  // MAX (Mascota ID 2) - Dermatología
  {
    id: 'diag-seed-003',
    cita_id: 'cita-seed-atendida-003',
    mascota_id: '2',
    mascota_nombre: 'Max',
    veterinario_id: '3',
    veterinario_nombre: 'Dr. Javier Martínez',
    especialidad: 'Dermatología',
    fecha_atencion: '2026-08-05T15:30:00.000Z',
    motivo_consulta: 'Prurito recurrente en patas delanteras y lamido constante interdigital',
    diagnostico: 'Dermatitis atópica estacional y pododermatitis alérgica superficial',
    datos: 'Peso: 4.3 kg | Temp: 38.7 °C | Examen cutáneo: eritema interdigital bilateral sin úlceras',
    tratamiento: 'Apoquel 3.6 mg (1/2 comprimido vía oral cada 12 horas durante 7 días, luego continuar 1/2 comprimido cada 24 horas por 10 días adicionales). Limpieza interdigital diaria con toallitas de clorhexidina al 2%.',
    notas: 'Raspado de piel negativo a ectoparásitos y demodex. Se instruye al tutor sobre evitar el uso de desinfectantes irritantes en pisos y mantener al paciente en ambientes aireados.',
    created_at: '2026-08-05T16:20:00.000Z'
  },
  // MAX (Mascota ID 2) - Medicina General Felina
  {
    id: 'diag-seed-004',
    cita_id: 'cita-seed-atendida-004',
    mascota_id: '2',
    mascota_nombre: 'Max',
    veterinario_id: '2',
    veterinario_nombre: 'Dra. Laura Veterinario',
    especialidad: 'Medicina General',
    fecha_atencion: '2026-02-18T10:00:00.000Z',
    motivo_consulta: 'Chequeo pediátrico felino y refuerzo de vacuna Triple Felina',
    diagnostico: 'Desarrollo ponderal normal y esquema vacunal felino completado con éxito',
    datos: 'Peso: 3.9 kg | Temp: 38.6 °C | Palpación abdominal: no dolorosa, riñones normales',
    tratamiento: 'Vacuna Triple Felina administrada vía subcutánea. Pipeta antiparasitaria Revolution Plus felino aplicada en nuca.',
    notas: 'Pelaje brillante y ojos limpios. El paciente tolera la manipulación clínica. Próximo control programado para dentro de 6 meses.',
    created_at: '2026-02-18T10:35:00.000Z'
  },
  // ROCCO (Mascota ID 3) - Traumatología
  {
    id: 'diag-seed-005',
    cita_id: 'cita-seed-atendida-005',
    mascota_id: '3',
    mascota_nombre: 'Rocco',
    veterinario_id: '7',
    veterinario_nombre: 'Dr. Roberto Sánchez',
    especialidad: 'Traumatología',
    fecha_atencion: '2026-05-28T16:00:00.000Z',
    motivo_consulta: 'Claudicación moderada de miembro anterior izquierdo tras saltar del sillón',
    diagnostico: 'Contusión articular con esguince leve de carpo sin fractura ni compromiso ligamentario grave',
    datos: 'Peso: 12.4 kg | Temp: 38.3 °C | Prueba radiográfica carpal: integridad de corteza ósea conservada',
    tratamiento: 'Meloxicam 0.1 mg/kg vía oral cada 24 horas durante 5 días con la comida principal. Condroprotector Condrovet Force HA (1 comprimido diario por 30 días). Reposo relativo sin saltos durante 10 días.',
    notas: 'Dolor moderado a la hiperextensión articular del carpo izquierdo. Tras la toma de placa radiográfica digital no se observaron trazos de fisura ni luxación. Buena respuesta al tratamiento analgésico inicial.',
    created_at: '2026-05-28T17:00:00.000Z'
  },
  // MILO (Mascota ID 4) - Odontología
  {
    id: 'diag-seed-006',
    cita_id: 'cita-seed-atendida-006',
    mascota_id: '4',
    mascota_nombre: 'Milo',
    veterinario_id: '9',
    veterinario_nombre: 'Dr. Miguel Ángel Ramírez',
    especialidad: 'Odontología',
    fecha_atencion: '2026-07-12T14:00:00.000Z',
    motivo_consulta: 'Halitosis marcada y depósitos de sarro en premolares y molares superiores',
    diagnostico: 'Gingivitis marginal crónica por cálculo dental grado II',
    datos: 'Peso: 4.8 kg | Temp: 38.6 °C | Índice periodontal: gingivitis leve sin movilidad de piezas',
    tratamiento: 'Profilaxis dental ultrasónica con pulido coronal completo. Stomorgyl 2 (1 comprimido diario por 6 días vía oral). Gel oral con clorhexidina 0.12% aplicado en encías cada noche tras la comida.',
    notas: 'Procedimiento profiláctico realizado bajo sedación inhalatoria y monitorización anestésica estable. Recuperación rápida. Se instruye técnica de cepillado preventivo con pasta dental felina enzimática.',
    created_at: '2026-07-12T15:30:00.000Z'
  },
  // CANELA (Mascota ID 5) - Medicina General y Geriatría
  {
    id: 'diag-seed-007',
    cita_id: 'cita-seed-atendida-007',
    mascota_id: '5',
    mascota_nombre: 'Canela',
    veterinario_id: '2',
    veterinario_nombre: 'Dra. Laura Veterinario',
    especialidad: 'Medicina General',
    fecha_atencion: '2026-04-22T08:45:00.000Z',
    motivo_consulta: 'Chequeo geriátrico anual y evaluación de marcha matutina lenta',
    diagnostico: 'Artrosis senil precoz en caderas; perfil bioquímico renal y hepático en límites normales',
    datos: 'Peso: 31.0 kg | Temp: 38.2 °C | Creatinina: 1.1 mg/dL | GPT: 34 U/L (Rangos normales)',
    tratamiento: 'Suplemento nutricional con sulfato de glucosamina, condroitina y ácidos grasos Omega 3 diarios. Alimento terapéutico Hills Prescription Diet Canine Mobility j/d.',
    notas: 'Rigidez matutina atribuible al desgaste articular fisiológico de la raza y edad. Corazón y pulmones normales. Se recomienda realizar paseos cortos y frecuentes en césped suave.',
    created_at: '2026-04-22T09:40:00.000Z'
  }
];

/**
 * Obtiene los diagnósticos almacenados en localStorage respetando la tabla 'diagnosticos'
 */
export const getStoredDiagnosticos = (): (DiagnosticoDB & {
  mascota_id: string;
  mascota_nombre: string;
  veterinario_id: string;
  veterinario_nombre: string;
  especialidad: string;
  fecha_atencion: string;
  motivo_consulta: string;
})[] => {
  const data = localStorage.getItem(STORAGE_DIAGNOSTICOS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_DIAGNOSTICOS_KEY, JSON.stringify(DEFAULT_SEED_DIAGNOSTICOS));
    return DEFAULT_SEED_DIAGNOSTICOS;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_DIAGNOSTICOS_KEY, JSON.stringify(DEFAULT_SEED_DIAGNOSTICOS));
      return DEFAULT_SEED_DIAGNOSTICOS;
    }
    // Asegurar que las semillas base existan siempre para pruebas
    let modificado = false;
    DEFAULT_SEED_DIAGNOSTICOS.forEach((seed) => {
      if (!parsed.some((d: any) => d.id === seed.id)) {
        parsed.push(seed);
        modificado = true;
      }
    });
    if (modificado) {
      localStorage.setItem(STORAGE_DIAGNOSTICOS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_SEED_DIAGNOSTICOS;
  }
};

/**
 * Busca los metadatos completos de una mascota a partir de su ID o Nombre
 */
export const findMascotaInfo = (mascotaIdOrName: string | number): MascotaExpediente => {
  const searchStr = String(mascotaIdOrName).trim().toLowerCase();
  
  const allPets = getAllPets();
  const found = allPets.find(
    (p) => String(p.id).toLowerCase() === searchStr || (p.nombre && p.nombre.toLowerCase() === searchStr)
  );
  if (found) {
    return {
      id: String(found.id),
      nombre: found.nombre,
      especie: found.especie ? found.especie.charAt(0).toUpperCase() + found.especie.slice(1) : 'Canino',
      raza: found.raza,
      sexo: found.sexo || 'macho',
      fecha_nacimiento: found.fechaNacimiento,
      foto_url: found.fotoUrl,
      propietario_id: found.propietarioId || 'prop-seed-01',
      propietario_nombre: 'Carlos Propietario'
    };
  }

  // Fallback por defecto
  return {
    id: String(mascotaIdOrName),
    nombre: typeof mascotaIdOrName === 'string' && isNaN(Number(mascotaIdOrName)) ? mascotaIdOrName : 'Paciente Canino',
    especie: 'Canino',
    raza: 'Mestizo',
    sexo: 'macho',
    propietario_id: 'prop-seed-01',
    propietario_nombre: 'Carlos Propietario'
  };
};

/**
 * Consulta y visualiza el historial clínico completo asociado a una mascota específica (US-19)
 * Ordenado cronológicamente de la atención más reciente a la más antigua
 */
export const getHistorialPorMascota = (
  mascotaIdOrName: string | number
): EntradaHistorialClinico[] => {
  if (!mascotaIdOrName) return [];

  const rawSearch = String(mascotaIdOrName).trim().toLowerCase();
  const mascotaInfo = findMascotaInfo(mascotaIdOrName);
  const diagnosticos = getStoredDiagnosticos();

  // Filtrar diagnósticos que coincidan con la mascota por ID o por nombre
  const registrosFiltrados = diagnosticos.filter((d) => {
    const idCoincide = String(d.mascota_id).toLowerCase() === rawSearch || String(d.mascota_id) === String(mascotaInfo.id);
    const nombreCoincide = d.mascota_nombre && (
      d.mascota_nombre.toLowerCase() === rawSearch ||
      d.mascota_nombre.toLowerCase() === mascotaInfo.nombre.toLowerCase()
    );
    return idCoincide || nombreCoincide;
  });

  // Mapear al modelo EntradaHistorialClinico
  const entradas: EntradaHistorialClinico[] = registrosFiltrados.map((item) => {
    const vetIdNum = Number(item.veterinario_id) || 1;
    const vetFound = (vetsMock as any[]).find((v) => v.id === vetIdNum);

    const veterinario: VeterinarioTratante = {
      id: String(item.veterinario_id),
      nombre: item.veterinario_nombre || vetFound?.name || 'Dr. Médico Veterinario',
      especialidad: item.especialidad || vetFound?.specialty || 'Medicina General',
      email: `${(item.veterinario_nombre || 'veterinario').toLowerCase().replace(/[^a-z0-9]/g, '.')}@vethd.com`
    };

    return {
      id: item.id,
      cita_id: item.cita_id,
      mascota_id: mascotaInfo.id,
      fecha_atencion: item.fecha_atencion || item.created_at,
      veterinario,
      mascota: mascotaInfo,
      motivo_consulta: item.motivo_consulta || null,
      diagnostico: item.diagnostico,
      tratamiento: item.tratamiento,
      observaciones: item.notas || 'Sin observaciones adicionales registradas.',
      datos: item.datos || null,
      created_at: item.created_at
    };
  });

  // Ordenar de la más reciente a la más antigua
  return entradas.sort(
    (a, b) => new Date(b.fecha_atencion).getTime() - new Date(a.fecha_atencion).getTime()
  );
};

/**
 * Obtiene el resumen del expediente clínico de una mascota
 */
export const getResumenHistorialMascota = (
  mascotaIdOrName: string | number
): HistorialMascotaResumen => {
  const mascota = findMascotaInfo(mascotaIdOrName);
  const entradas = getHistorialPorMascota(mascotaIdOrName);

  return {
    mascota,
    totalAtenciones: entradas.length,
    ultimaAtencion: entradas.length > 0 ? entradas[0].fecha_atencion : null,
    primeraAtencion: entradas.length > 0 ? entradas[entradas.length - 1].fecha_atencion : null,
    entradas
  };
};

/**
 * Obtiene todas las mascotas registradas con su contador de atenciones médicas
 * Útil para la consola del veterinario (US-19)
 */
export const getTodasLasMascotasConHistorial = (): {
  mascota: MascotaExpediente;
  totalAtenciones: number;
  ultimaAtencion?: string | null;
}[] => {
  // Recorrer todas las mascotas del sistema (mocks y almacenadas)
  const mascotasMap = new Map<string, MascotaExpediente>();

  const allPets = getAllPets();
  allPets.forEach((p) => {
    mascotasMap.set(String(p.id), {
      id: String(p.id),
      nombre: p.nombre,
      especie: p.especie ? p.especie.charAt(0).toUpperCase() + p.especie.slice(1) : 'Canino',
      raza: p.raza,
      sexo: p.sexo || 'macho',
      fecha_nacimiento: p.fechaNacimiento,
      foto_url: p.fotoUrl,
      propietario_id: p.propietarioId || 'prop-seed-01',
      propietario_nombre: 'Carlos Propietario'
    });
  });

  const resultado = Array.from(mascotasMap.values()).map((mascota) => {
    const entradas = getHistorialPorMascota(mascota.id);
    return {
      mascota,
      totalAtenciones: entradas.length,
      ultimaAtencion: entradas.length > 0 ? entradas[0].fecha_atencion : null
    };
  });

  // Ordenar primero las que tienen atenciones más recientes
  return resultado.sort((a, b) => {
    if (!a.ultimaAtencion) return 1;
    if (!b.ultimaAtencion) return -1;
    return new Date(b.ultimaAtencion).getTime() - new Date(a.ultimaAtencion).getTime();
  });
};

/**
 * Guarda una nueva entrada de diagnóstico respetando la tabla 'diagnosticos'
 */
export const guardarDiagnostico = (
  payload: Omit<DiagnosticoDB, 'id' | 'created_at'> & {
    mascota_id: string;
    mascota_nombre: string;
    veterinario_id: string;
    veterinario_nombre: string;
    especialidad: string;
    fecha_atencion?: string;
    motivo_consulta?: string;
  }
): DiagnosticoDB => {
  const diagnosticos = getStoredDiagnosticos();
  const nuevoDiagnostico: DiagnosticoDB & {
    mascota_id: string;
    mascota_nombre: string;
    veterinario_id: string;
    veterinario_nombre: string;
    especialidad: string;
    fecha_atencion: string;
    motivo_consulta: string;
  } = {
    id: `diag-${Date.now()}`,
    cita_id: payload.cita_id,
    mascota_id: payload.mascota_id,
    mascota_nombre: payload.mascota_nombre,
    veterinario_id: payload.veterinario_id,
    veterinario_nombre: payload.veterinario_nombre,
    especialidad: payload.especialidad,
    fecha_atencion: payload.fecha_atencion || new Date().toISOString(),
    motivo_consulta: payload.motivo_consulta || '',
    diagnostico: payload.diagnostico.trim(),
    datos: payload.datos?.trim() || null,
    tratamiento: payload.tratamiento.trim(),
    notas: payload.notas?.trim() || null,
    created_at: new Date().toISOString()
  };

  diagnosticos.unshift(nuevoDiagnostico);
  localStorage.setItem(STORAGE_DIAGNOSTICOS_KEY, JSON.stringify(diagnosticos));

  return {
    id: nuevoDiagnostico.id,
    cita_id: nuevoDiagnostico.cita_id,
    diagnostico: nuevoDiagnostico.diagnostico,
    datos: nuevoDiagnostico.datos,
    tratamiento: nuevoDiagnostico.tratamiento,
    notas: nuevoDiagnostico.notas,
    created_at: nuevoDiagnostico.created_at
  };
};
