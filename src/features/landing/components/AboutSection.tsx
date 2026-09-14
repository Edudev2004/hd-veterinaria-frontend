import React from 'react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Stethoscope, ClipboardList, BellRing, Smartphone } from 'lucide-react';

const advantages = [
  {
    Icon: ClipboardList,
    title: 'Historial Clínico 100% Digital',
    body: 'Adiós al papel. Cada consulta, vacuna, cirugía y resultado de laboratorio queda registrado en la nube y disponible en segundos para cualquier médico del equipo.',
    color: '#0D7C84',
    number: '01',
  },
  {
    Icon: BellRing,
    title: 'Alertas y Recordatorios Inteligentes',
    body: 'El sistema te avisa automáticamente cuándo vacunar, desparasitar o llevar a control a tu mascota. Nunca más olvides una cita importante.',
    color: '#F59E0B',
    number: '02',
  },
  {
    Icon: Smartphone,
    title: 'Gestión desde tu celular',
    body: 'Agenda citas, revisa prescripciones, consulta resultados y chatea con tu veterinario desde la palma de tu mano. Disponible 24/7 sin filas ni llamadas.',
    color: '#0D7C84',
    number: '03',
  },
  {
    Icon: Stethoscope,
    title: 'Médicos Especialistas Certificados',
    body: 'Contamos con veterinarios colegiados en medicina interna, cirugía, dermatología y animales exóticos. Atención de primer nivel sin importar la especialidad.',
    color: '#F59E0B',
    number: '04',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] } },
};

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="relative py-28 bg-slate-50 overflow-hidden">
      {/* Ambient blobs (very subtle on light bg) */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#0D7C84]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-[#F59E0B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.25em] block mb-4"
          >
            Nuestro Sistema
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight"
          >
            Por qué VetHD es{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C84] to-teal-500">
              diferente
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed"
          >
            Mientras otras clínicas aún manejan carpetas y anotaciones a mano, VetHD opera con
            tecnología de punta que conecta al dueño, la mascota y el médico en un ecosistema
            digital integrado y seguro.
          </motion.p>
        </div>

        {/* Advantages — Vertical Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Vertical line */}
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-[#0D7C84]/40 via-slate-200 to-transparent hidden sm:block" />

          <div className="space-y-16 sm:space-y-12">
            {advantages.map((adv) => {
              const Icon = adv.Icon;
              return (
                <motion.div
                  key={adv.number}
                  variants={itemVariants}
                  className="sm:pl-16 flex flex-col sm:flex-row gap-6 sm:gap-10 relative group"
                >
                  {/* Dot on timeline */}
                  <div
                    className="absolute left-0 top-1 w-11 h-11 rounded-full hidden sm:flex items-center justify-center border-2 transition-colors duration-300 group-hover:border-[#F59E0B] bg-white shadow-sm"
                    style={{ borderColor: adv.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: adv.color }} />
                  </div>

                  {/* Number accent */}
                  <div
                    className="text-[5rem] sm:text-[7rem] font-black leading-none select-none opacity-[0.04] absolute -top-4 sm:-top-6 right-0 sm:right-8 pointer-events-none"
                    style={{ color: adv.color }}
                  >
                    {adv.number}
                  </div>

                  {/* Mobile icon */}
                  <div
                    className="sm:hidden w-10 h-10 rounded-full flex items-center justify-center border bg-white shadow-sm"
                    style={{ borderColor: adv.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: adv.color }} />
                  </div>

                  {/* Content */}
                  <div className="relative flex-1 pb-2 border-b border-slate-200 group-hover:border-slate-300 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                      {adv.title}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed max-w-2xl">
                      {adv.body}
                    </p>
                    <motion.div
                      className="h-px w-0 mt-4 group-hover:w-24 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: adv.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-10"
        >
          <p className="text-slate-700 text-lg sm:text-xl font-semibold max-w-md leading-snug">
            Más de <span className="text-[#0D7C84] font-black">2,500 mascotas</span> confían en
            nosotros cada mes.
          </p>
          <a
            href="#contacto"
            className="group inline-flex items-center gap-3 text-sm font-bold text-slate-800 border-b-2 border-[#F59E0B] pb-1 hover:text-[#F59E0B] transition-colors duration-300"
          >
            Únete ahora
            <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
