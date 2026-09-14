import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useLoadingNavigate } from '@/hooks/useLoadingNavigate';

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
};

import hero1 from '@/assets/images/hero_pets_1.jpg';
import hero2 from '@/assets/images/hero_pets_2.jpg';
import hero3 from '@/assets/images/hero_pets_3.jpg';

const slides = [
  {
    id: 1,
    image: hero1,
    title: 'La mejor atención médica para tus mejores amigos',
    subtitle: 'Consultas especializadas, vacunación, cirugías e historial clínico 100% digital en tiempo real.',
    highlights: new Set(['atención', 'tus', 'mejores']),
  },
  {
    id: 2,
    image: hero2,
    title: 'Diagnósticos precisos con la mayor calidez humana',
    subtitle: 'Médicos veterinarios calificados dedicados al cuidado integral de perros, gatos y especies pequeñas.',
    highlights: new Set(['con', 'calidez', 'humana']),
  },
  {
    id: 3,
    image: hero3,
    title: 'Tu tranquilidad y la salud de tu mascota en un solo lugar',
    subtitle: 'Agenda citas con especialistas, recibe alertas de vacunas y consulta resultados sin salir de casa.',
    highlights: new Set(['tranquilidad', 'mascota', 'lugar']),
  },
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { loading, navigateWithLoader } = useLoadingNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide];
  const words = activeSlide.title.split(' ');

  return (
    <>
      <LoadingOverlay visible={loading} />
      <div className="relative w-full h-screen min-h-[700px] bg-slate-100 flex items-center overflow-hidden">

      {/* Background Image Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
        >
          {/* Light overlay — strong white on the left where text lives, fades to transparent right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/10" />
          {/* Subtle top/bottom vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-20">
        <div className="max-w-2xl space-y-7">

          {/* Word Cascade Animated Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] flex flex-wrap gap-x-3 gap-y-1">
            {words.map((word, i) => {
              const clean = word.replace(/[^\w\u00C0-\u024F]/g, '').toLowerCase();
              const isHighlighted = activeSlide.highlights.has(clean);
              return (
                <motion.span
                  key={activeSlide.id + '-word-' + i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.215, 0.61, 0.355, 1.0],
                  }}
                  className={
                    isHighlighted
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C84] via-teal-500 to-[#F59E0B]'
                      : ''
                  }
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlide.id + '-sub'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl"
            >
              {activeSlide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigateWithLoader('/register')}
                variant="primary"
                className="!py-4 !px-8 text-base shadow-xl shadow-[#0D7C84]/25"
              >
                <span>Agendar Cita Médica</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a
                href="#servicios"
                onClick={(e) => scrollToSection(e, 'servicios')}
                className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-xl border-2 border-slate-300 bg-white/70 text-slate-800 text-sm font-bold backdrop-blur-sm hover:bg-white hover:border-slate-400 transition-all text-center"
              >
                <span>Ver Servicios</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex items-center gap-4 pt-2 text-xs font-semibold"
          >
            <div className="flex items-center gap-2 bg-white/80 border border-slate-200 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-sm text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#0D7C84]" />
              <span>Veterinarios Colegiados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 border border-slate-200 px-3.5 py-2 rounded-xl backdrop-blur-md shadow-sm text-slate-700">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span>4.9 / 5.0 en Atenciones</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slider Nav Controls */}
      <div className="absolute bottom-10 right-8 sm:right-16 z-30 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/80 border border-slate-200 text-slate-700 hover:bg-[#0D7C84] hover:text-white hover:border-[#0D7C84] transition-all shadow-sm backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                currentSlide === idx ? 'w-8 bg-[#F59E0B]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/80 border border-slate-200 text-slate-700 hover:bg-[#0D7C84] hover:text-white hover:border-[#0D7C84] transition-all shadow-sm backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      </div>
    </>
  );
};
