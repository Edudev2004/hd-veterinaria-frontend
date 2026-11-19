import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';
import { ApiError } from '../../../services/apiClient';
import { getCitas } from '../../../services/citaService';
import { createReview, reviewService } from '../../../services/reviewApi';

interface AppointmentReview {
  id: string;
  petName: string;
  service: string;
  veterinarian: string;
  date: string;
  status: 'ATENDIDA';
  rating?: number;
  comment?: string;
  reviewed?: boolean;
}

const formatearFecha = (iso: string): string =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export const ReviewsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentReview | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let activo = true;

    setIsLoading(true);
    setError(null);

    const cargarAtenciones = async () => {
      try {
        const citas = await getCitas();
        if (!activo) return;

        const atendidas = citas.filter((cita) => cita.estado === 'atendida');

        // Consultar valoraciones existentes de los veterinarios involucrados para prehidratar el estado
        const vetIds = Array.from(new Set(atendidas.map((c) => c.veterinario.id)));
        const reviewsResponses = await Promise.all(
          vetIds.map((id) => reviewService.getVeterinarianReviews(id).catch(() => null))
        );

        if (!activo) return;

        const reviewByAppointmentId = new Map<string, { rating: number; comment?: string }>();
        for (const resp of reviewsResponses) {
          if (resp && Array.isArray(resp.valoraciones)) {
            for (const v of resp.valoraciones) {
              if (v.appointmentId) {
                reviewByAppointmentId.set(v.appointmentId, {
                  rating: v.rating,
                  comment: v.comment || undefined,
                });
              }
            }
          }
        }

        const mapped: AppointmentReview[] = atendidas.map((cita) => {
          const existingReview = reviewByAppointmentId.get(cita.id);
          return {
            id: cita.id,
            petName: cita.mascota.nombre,
            service: cita.veterinario.especialidad_nombre || 'Consulta general',
            veterinarian: cita.veterinario.nombre,
            date: formatearFecha(cita.fecha_hora),
            status: 'ATENDIDA',
            rating: existingReview?.rating,
            comment: existingReview?.comment,
            reviewed: Boolean(existingReview),
          };
        });

        setAppointments(mapped);
      } catch (err) {
        if (!activo) return;
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar tus atenciones. Inténtalo de nuevo.'
        );
        setAppointments([]);
      } finally {
        if (activo) setIsLoading(false);
      }
    };

    void cargarAtenciones();

    return () => {
      activo = false;
    };
  }, []);

  const handleOpenModal = (appointment: AppointmentReview) => {
    if (appointment.rating || appointment.reviewed) return;

    setSelectedAppointment(appointment);
    setRating(0);
    setHover(0);
    setComment('');
    setIsModalOpen(true);
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAppointment || rating === 0) return;

    setIsSaving(true);
    setError(null);

    try {
      await createReview(selectedAppointment.id, {
        rating,
        comment,
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === selectedAppointment.id ? { ...app, rating, comment, reviewed: true } : app
        )
      );

      setIsModalOpen(false);
      setSelectedAppointment(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === selectedAppointment.id ? { ...app, reviewed: true } : app
          )
        );
        setIsModalOpen(false);
        setSelectedAppointment(null);
        return;
      }

      setError('No se pudo registrar la valoración. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Valoraciones de Atención</h1>
        <p className="text-sm text-slate-500">
          Califica la experiencia y el trato recibido por nuestros profesionales veterinarios.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 border border-rose-100">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
          Cargando atenciones finalizadas...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-semibold text-slate-900">Sin atenciones por calificar</h3>
          <p className="mt-1 text-sm text-slate-500">
            Aquí aparecerán tus citas una vez que hayan sido atendidas por el veterinario.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-900">{item.petName}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">{item.service}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> ATENDIDA
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center">
                      <User className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> {item.veterinarian}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> {item.date}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center sm:mt-0">
                  {item.rating ? (
                    <div className="flex items-center space-x-1 rounded-xl bg-amber-50 px-3 py-1.5 border border-amber-100">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : item.reviewed ? (
                    <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Ya valorada
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
                    >
                      <Star className="mr-1.5 h-4 w-4 fill-white" /> Calificar atención
                    </button>
                  )}
                </div>
              </div>

              {item.rating && item.comment && (
                <div className="mt-3 flex items-start space-x-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                  <MessageSquare className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="italic">"{item.comment}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900">Calificar atención</h3>
            <p className="mt-1 text-sm text-slate-600">
              ¿Cómo fue tu experiencia con <span className="font-medium text-slate-900">{selectedAppointment?.veterinarian}</span>?
            </p>

            <form onSubmit={handleSubmitRating} className="mt-6 space-y-4">
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Comentario (opcional)</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe detalles sobre la atención recibida..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || isSaving}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {isSaving ? 'Enviando...' : 'Enviar calificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
