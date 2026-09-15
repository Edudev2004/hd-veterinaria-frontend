import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Calendar, User, Heart } from 'lucide-react';

interface AppointmentReview {
  id: string;
  petName: string;
  service: string;
  veterinarian: string;
  date: string;
  status: 'ATENDIDA' | 'PENDIENTE';
  rating?: number;
  comment?: string;
}

const STORAGE_KEY = 'hd_veterinaria_reviews';

export const ReviewsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error al cargar del localStorage', e);
      }
    }
    // Datos simulados de la citas
    return [
      {
        id: '1',
        petName: 'Max',
        service: 'Vacunación Anual',
        veterinarian: 'Dra. Ruiz',
        date: '10 de Septiembre, 2026',
        status: 'ATENDIDA',
      },
      {
        id: '2',
        petName: 'Luna',
        service: 'Vacunación Anual',
        veterinarian: 'Dra. Martínez',
        date: '15 de Septiembre, 2026',
        status: 'ATENDIDA',
      },
      {
        id: '3',
        petName: 'Max',
        service: 'Revisión Dental',
        veterinarian: 'Dra. Ruiz',
        date: '22 de Octubre, 2026',
        status: 'PENDIENTE',
      },
    ];
  });

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentReview | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Guardar en localStorage cada vez que cambien las citas
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const handleOpenModal = (appointment: AppointmentReview) => {
    // Validar que no se haya valorado antes (bloquear si ya tiene rating)
    if (appointment.rating) return;
    
    setSelectedAppointment(appointment);
    setRating(0);
    setComment('');
    setIsModalOpen(true);
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || rating === 0) return;

    // Actualizar la cita con la valoración
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === selectedAppointment.id
          ? { ...app, rating, comment }
          : app
      )
    );

    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-outfit">Valoraciones de Atención</h1>
        <p className="text-sm text-slate-500">Califica la atención recibida en tus citas pasadas.</p>
      </div>

      <div className="grid gap-4">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  <Heart className="mr-1 h-3 w-3" /> {item.petName}
                </span>
                <span className="text-sm font-semibold text-slate-800">{item.service}</span>
                {item.status === 'ATENDIDA' && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> ATENDIDA
                  </span>
                )}
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
              {/* Opción de valorar disponible solo en citas con estado ATENDIDA */}
              {item.status === 'ATENDIDA' ? (
                item.rating ? (
                  <div className="flex items-center space-x-1 rounded-lg bg-amber-50 px-3 py-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating!
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
                  >
                    <Star className="mr-1.5 h-4 w-4 fill-white" /> Calificar atención
                  </button>
                )
              ) : (
                <span className="text-xs italic text-slate-400">Disponible tras la atención</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal con Formulario (puntaje 1-5 estrellas y comentario opcional) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
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
                        star <= (hover || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Comentario (opcional)
                </label>
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
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  Enviar calificación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};