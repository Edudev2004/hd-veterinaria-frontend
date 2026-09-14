import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Scissors, Activity, Syringe, ShieldAlert, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

import service1 from '@/assets/images/hero_pets_2.jpg';
import service2 from '@/assets/images/hero_pets_1.jpg';
import service3 from '@/assets/images/hero_pets_3.jpg';

const servicesData = [
  {
    id: 'consultas',
    number: '01',
    title: 'Consultas Médicas Especializadas',
    subtitle: 'Evaluación clínica completa por médicos veterinarios expertos.',
    description: 'Diagnóstico preventivo, chequeos periódicos, medicina interna y tratamiento especializado para perros, gatos y mascotas exóticas.',
    icon: Stethoscope,
    image: service1,
    features: ['Evaluación física completa', 'Recetas electrónicas', 'Seguimiento por historia clínica digital'],
  },
  {
    id: 'cirugia',
    number: '02',
    title: 'Cirugía de Alta Complejidad',
    subtitle: 'Quirófano equipado con anestesia inhalatoria y monitoreo continuo.',
    description: 'Procedimientos tejidos blandos, traumatología, esterilizaciones y cirugías reconstructivas con protocolos de dolor avanzados.',
    icon: Activity,
    image: service2,
    features: ['Monitoreo multiparámetro', 'Recuperación asistida', 'Anestesia segura de última generación'],
  },
  {
    id: 'spa',
    number: '03',
    title: 'Peluquería & Spa Canino / Felino',
    subtitle: 'Grooming profesional con productos dermatológicos hipoalergénicos.',
    description: 'Baños medicinales, cortes de raza, limpieza de oídos y glándulas, y tratamiento acondicionador para mantener el pelaje radiante.',
    icon: Scissors,
    image: service3,
    features: ['Productos hipoalergénicos', 'Corte higiénico y estético', 'Ambiente libre de estrés'],
  },
  {
    id: 'vacunas',
    number: '04',
    title: 'Vacunación & Desparasitación',
    subtitle: 'Planes de inmunización personalizados desde cachorros hasta seniors.',
    description: 'Esquemas de vacunación quintuple, séxtuple, antirrábica y desparasitación interna y externa periódica con recordatorios automáticos.',
    icon: Syringe,
    image: service1,
    features: ['Vacunas biológicas certificadas', 'Carnet digital de vacunación', 'Notificaciones de refuerzo'],
  },
  {
    id: 'urgencias',
    number: '05',
    title: 'Urgencias & Cuidados Intensivos 24/7',
    subtitle: 'Atención médica inmediata ante accidentes o emergencias graves.',
    description: 'Unidad de cuidados intensivos, oxigenoterapia, transfusiones y guardia médica permanente disponible los 365 días del año.',
    icon: ShieldAlert,
    image: service2,
    features: ['Disponibilidad las 24 horas', 'Unidad de oxigenoterapia', 'Triage médico rápido'],
  },
];

export const InteractiveServices: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState<string>('consultas');
  const navigate = useNavigate();

  const activeService = servicesData.find((s) => s.id === activeServiceId) || servicesData[0];

  return (
    <section id="servicios" className="py-24 bg-white text-slate-900 relative overflow-hidden">
      {/* Subtle top-right teal tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,124,132,0.06),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[#F59E0B] text-xs font-bold uppercase tracking-widest block mb-2">
              Nuestros Servicios Médicos
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Cuidado integral diseñado <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C84] to-teal-500">
                para la salud de tu mascota
              </span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base max-w-md leading-relaxed font-light">
            Instalaciones clínicas modernas y médicos calificados dedicados a brindar la mejor experiencia en salud veterinaria.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT: Typographic Interactive List */}
          <div className="lg:col-span-7 space-y-1">
            {servicesData.map((service) => {
              const isActive = service.id === activeServiceId;
              const Icon = service.icon;

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveServiceId(service.id)}
                  onClick={() => setActiveServiceId(service.id)}
                  className="relative cursor-pointer group py-4 px-6 rounded-2xl transition-all"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeServiceHighlight"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 bg-[#E2F2F3]/70 border border-[#0D7C84]/30 rounded-2xl shadow-sm"
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <span className={`text-base font-extrabold font-mono transition-colors ${
                        isActive ? 'text-[#F59E0B]' : 'text-slate-300 group-hover:text-slate-400'
                      }`}>
                        {service.number}
                      </span>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 transition-colors ${
                          isActive ? 'text-[#0D7C84]' : 'text-slate-400 group-hover:text-slate-500'
                        }`} />
                        <h3 className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                          isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                        }`}>
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <ArrowUpRight className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-[#F59E0B] translate-x-1 -translate-y-1' : 'text-slate-300 group-hover:text-slate-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Dynamic Detail Panel */}
          <div className="lg:col-span-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-6 shadow-lg space-y-6"
              >
                {/* Preview Image */}
                <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0D7C84] border border-slate-200 shadow-sm">
                    {activeService.subtitle}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {activeService.description}
                  </p>
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    {activeService.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#0D7C84]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={() => navigate('/register')} variant="primary" fullWidth>
                    <span>Reservar este Servicio</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
