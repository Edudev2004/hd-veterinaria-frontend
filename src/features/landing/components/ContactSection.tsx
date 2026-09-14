import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const contactInfo = [
  { Icon: Phone, label: 'Urgencias Médicas 24/7', value: '+51 987 654 321', color: '#0D7C84', href: 'tel:+51987654321' },
  { Icon: Mail, label: 'Escríbenos', value: 'contacto@vethd.com', color: '#F59E0B', href: 'mailto:contacto@vethd.com' },
  { Icon: MapPin, label: 'Ubicación', value: 'Av. Principal 123, San Isidro, Lima – Perú', color: '#0D7C84', href: '#' },
];

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', pet: '', message: '' });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" className="relative py-28 bg-slate-50 overflow-hidden">
      {/* Ambient */}
      <div className="absolute -bottom-60 -right-60 w-[700px] h-[700px] bg-[#0D7C84]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

        {/* Section header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.25em] block mb-4"
          >
            Hablemos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-xl"
          >
            Agenda tu primera{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D7C84] to-teal-500">
              consulta
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg"
          >
            Tu mascota merece la mejor atención desde el primer día. Escríbenos y nos comunicamos contigo en minutos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 lg:gap-24 items-start">

          {/* LEFT — contact info */}
          <div className="space-y-10">
            {contactInfo.map(({ Icon, label, value, color, href }, idx) => (
              <motion.a
                key={idx}
                href={href}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                className="group flex items-start gap-5 no-underline"
              >
                <div
                  className="mt-1 w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border bg-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                  style={{ borderColor: `${color}40`, color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="border-b border-slate-200 pb-4 flex-1 group-hover:border-slate-300 transition-colors duration-300">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-slate-800 font-bold text-lg group-hover:text-[#0D7C84] transition-colors duration-300 leading-snug">
                    {value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="pt-4 border-t border-slate-200"
            >
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Horario de Atención</p>
              <div className="space-y-1.5 text-slate-700 text-sm">
                <div className="flex justify-between max-w-xs">
                  <span>Lunes – Viernes</span>
                  <span className="text-[#0D7C84] font-semibold">8:00 am – 8:00 pm</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>Sábados</span>
                  <span className="text-[#0D7C84] font-semibold">9:00 am – 5:00 pm</span>
                </div>
                <div className="flex justify-between max-w-xs">
                  <span>Urgencias</span>
                  <span className="text-[#F59E0B] font-semibold">24 / 7</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {([
                  { id: 'name', label: 'Tu nombre', type: 'text', placeholder: 'María García' },
                  { id: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'maria@ejemplo.com' },
                  { id: 'pet', label: 'Nombre y especie de tu mascota', type: 'text', placeholder: 'Luna, Golden Retriever' },
                ] as const).map(({ id, label, type, placeholder }) => (
                  <div key={id} className="relative">
                    <label
                      htmlFor={id}
                      className={`absolute left-0 transition-all duration-300 pointer-events-none font-semibold text-xs ${
                        focused === id || form[id] ? '-top-5 text-[#0D7C84]' : 'top-2 text-slate-400 text-sm'
                      }`}
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={focused === id ? placeholder : ''}
                      value={form[id]}
                      onChange={handleChange}
                      onFocus={() => setFocused(id)}
                      onBlur={() => setFocused(null)}
                      required
                      className="w-full bg-transparent border-0 border-b-2 border-slate-200 focus:border-[#0D7C84] outline-none py-2 text-slate-900 text-sm placeholder:text-slate-300 transition-colors duration-300"
                    />
                  </div>
                ))}

                <div className="relative">
                  <label
                    htmlFor="message"
                    className={`absolute left-0 transition-all duration-300 pointer-events-none font-semibold text-xs ${
                      focused === 'message' || form.message ? '-top-5 text-[#0D7C84]' : 'top-2 text-slate-400 text-sm'
                    }`}
                  >
                    ¿En qué podemos ayudarte?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder={focused === 'message' ? 'Cuéntanos sobre tu mascota y el motivo de consulta...' : ''}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    required
                    className="w-full bg-transparent border-0 border-b-2 border-slate-200 focus:border-[#0D7C84] outline-none py-2 text-slate-900 text-sm placeholder:text-slate-300 transition-colors duration-300 resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group w-full flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-[#0D7C84] text-white font-bold text-sm hover:bg-[#0a6870] transition-colors duration-300 shadow-lg shadow-[#0D7C84]/20 mt-4"
                >
                  <span>Enviar mensaje</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </motion.button>

                <p className="text-slate-400 text-xs text-center">
                  Te respondemos en menos de 30 minutos durante horario de atención.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center justify-center gap-5 py-16 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-[#0D7C84]" />
                <h3 className="text-2xl font-black text-slate-900">¡Mensaje enviado!</h3>
                <p className="text-slate-500 text-base max-w-sm">
                  Gracias por contactarnos. Un miembro de nuestro equipo te escribirá a la brevedad.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', pet: '', message: '' }); }}
                  className="text-[#0D7C84] text-sm font-bold hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
