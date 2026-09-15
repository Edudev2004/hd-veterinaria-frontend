import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mariana Ruiz',
    role: 'Propietaria de Luna (Golden Retriever)',
    initials: 'MR',
    accentColor: '#F59E0B',
    rating: 5,
    highlight: 'VetHD transformó la manera en que cuido a Luna.',
    text: 'Recibo alertas de sus vacunas al instante y los veterinarios tienen todo su historial listo al momento de la consulta. ¡La atención es extraordinaria y la plataforma es súper intuitiva!',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    role: 'Propietario de Max (Gato Bombay)',
    initials: 'CM',
    accentColor: '#0D7C84',
    rating: 5,
    highlight: 'Una emergencia a medianoche y la respuesta fue inmediata.',
    text: 'La rapidez y profesionalismo salvó la vida de Max. El sistema de agendamiento es súper fluido, y poder consultar el historial desde el celular es un game changer total.',
  },
  {
    id: 3,
    name: 'Dra. Sofía Martínez',
    role: 'Médica Veterinaria Cirujana — VetHD',
    initials: 'SM',
    accentColor: '#0D7C84',
    rating: 5,
    highlight: 'Decisiones diagnósticas más rápidas y precisas.',
    text: 'Como médica, tener las historias clínicas integradas en tiempo real es un cambio absoluto. La plataforma eleva el estándar de la salud veterinaria y nos permite brindar mejor atención a cada paciente.',
  },
  {
    id: 4,
    name: 'Roberto Paredes',
    role: 'Propietario de Tita (Bulldog Inglés)',
    initials: 'RP',
    accentColor: '#F59E0B',
    rating: 5,
    highlight: 'El mejor servicio veterinario al que he llevado a mi perra.',
    text: 'Tita tiene un historial complicado y antes era un caos. Con VetHD todo queda ordenado, los médicos lo ven al instante y el seguimiento post-cirugía fue impecable. No cambio este sistema por nada.',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const current = testimonials[active];

  return (
    <section id="testimonios" className="relative py-28 bg-white overflow-hidden">
      {/* Dotted pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: `radial-gradient(circle, #0D7C84 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#E2F2F3]/60 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.25em] block mb-4"
          >
            Historias Reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight"
          >
            Lo que dicen nuestras{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C84] to-teal-500">
              familias
            </span>
          </motion.h2>
        </div>

        {/* Main testimonial split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

          {/* LEFT — large quote */}
          <div className="min-h-[300px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="space-y-6"
              >
                <p
                  className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.15] tracking-tight"
                  style={{ color: current.accentColor }}
                >
                  "{current.highlight}"
                </p>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                  {current.text}
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black border-2"
                    style={{ borderColor: current.accentColor, color: current.accentColor, backgroundColor: `${current.accentColor}15` }}
                  >
                    {current.initials}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{current.name}</p>
                    <p className="text-slate-400 text-xs">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — vertical selector list */}
          <div className="flex flex-col gap-2">
            {testimonials.map((t, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(idx)}
                  className="relative text-left pl-5 pr-4 py-4 rounded-none border-l-2 transition-all duration-300 group focus:outline-none"
                  style={{
                    borderLeftColor: isActive ? t.accentColor : '#E2E8F0',
                    backgroundColor: isActive ? `${t.accentColor}08` : 'transparent',
                  }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-0.5 origin-top"
                      style={{ backgroundColor: t.accentColor }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 7, ease: 'linear' }}
                    />
                  )}
                  <p className={`text-sm font-bold leading-snug transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {t.highlight}
                  </p>
                  <p className={`text-xs mt-1 transition-colors duration-300 ${isActive ? 'text-slate-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    — {t.name}, {t.role}
                  </p>
                </button>
              );
            })}

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-3 pl-5">
              <button
                onClick={prev}
                className="p-2.5 rounded-full border border-slate-200 text-slate-500 hover:border-[#0D7C84] hover:text-[#0D7C84] transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="p-2.5 rounded-full border border-slate-200 text-slate-500 hover:border-[#0D7C84] hover:text-[#0D7C84] transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-slate-300 text-xs font-mono ml-auto pr-2">
                {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
