import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, PhoneCall, Mail, MapPin, Heart } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D7C84] p-0.5 shadow-lg shadow-[#0D7C84]/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#0D7C84]" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Vet<span className="text-[#F59E0B]">HD</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-light">
              Plataforma médica veterinaria integral para la gestión de citas, historias clínicas digitales y seguimiento del bienestar de tus mascotas.
            </p>

            <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl text-xs text-white font-semibold">
              <PhoneCall className="w-4 h-4 text-[#F59E0B] animate-pulse" />
              <span>Urgencias Médicas 24/7: <strong>+51 987 654 321</strong></span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#servicios" className="hover:text-[#F59E0B] transition-colors">Servicios Médicos</a></li>
              <li><a href="#nosotros" className="hover:text-[#F59E0B] transition-colors">Nosotros & Equipo</a></li>
              <li><a href="#testimonios" className="hover:text-[#F59E0B] transition-colors">Testimonios de Clientes</a></li>
              <li><Link to="/register" className="hover:text-[#F59E0B] transition-colors">Registro de Propietarios</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ubicación & Atención</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0D7C84] shrink-0 mt-0.5" />
                <span>Av. Principal 123, San Isidro, Lima - Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0D7C84] shrink-0" />
                <span>contacto@vethd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0D7C84] shrink-0" />
                <span>Atención Telefónica: Mon - Sun (24 Horas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} VetHD. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Desarrollado con</span>
            <Heart className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span>para amantes de las mascotas.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
