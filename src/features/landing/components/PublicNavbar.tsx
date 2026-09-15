import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { Stethoscope, User, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useLoadingNavigate } from '@/hooks/useLoadingNavigate';

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const id = href.replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
};

export const PublicNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { loading, navigateWithLoader } = useLoadingNavigate();

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#testimonios', label: 'Testimonios' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <>
      <LoadingOverlay visible={loading} />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl py-3 border-b border-slate-200 shadow-md shadow-slate-200/60'
            : 'bg-gradient-to-b from-white/80 via-white/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-10 h-10 rounded-xl bg-[#0D7C84] p-0.5 shadow-lg shadow-[#0D7C84]/30 flex items-center justify-center"
            >
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#0D7C84]" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Vet<span className="text-[#F59E0B]">HD</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0D7C84]">
                Salud Veterinaria
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => scrollToSection(e, href)}
                className="hover:text-[#0D7C84] transition-colors relative py-1 group cursor-pointer"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0D7C84] transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => navigateWithLoader('/login')}
                className="text-xs font-bold text-slate-700 hover:text-[#0D7C84] px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#0D7C84]/40 hover:bg-[#E2F2F3]/50 transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#0D7C84]" />
                <span>Iniciar Sesión</span>
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigateWithLoader('/register')}
                variant="primary"
                className="!py-2.5 !px-5 text-xs shadow-md"
              >
                <span>Registrarse</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-slate-900 p-2 rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 border-b border-slate-200 px-6 py-6 space-y-4 shadow-lg"
          >
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { scrollToSection(e, href); setMobileMenuOpen(false); }}
                className="block text-slate-700 hover:text-[#0D7C84] font-semibold"
              >
                {label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <button
                onClick={() => { setMobileMenuOpen(false); navigateWithLoader('/login'); }}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-[#0D7C84]"
              >
                Iniciar Sesión
              </button>
              <Button
                onClick={() => { setMobileMenuOpen(false); navigateWithLoader('/register'); }}
                variant="primary"
                fullWidth
              >
                Registrarse Gratis
              </Button>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
};
