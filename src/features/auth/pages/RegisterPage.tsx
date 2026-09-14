import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { UnderlineInput } from '@/components/ui/UnderlineInput';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import bgImage from '@/assets/images/vet_happy_pets_bg.jpg';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validations
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const isPhoneValid = formData.telefono.trim().length >= 7;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!isEmailValid) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!isPhoneValid) {
      setError('Por favor, ingresa un número de teléfono válido.');
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los Términos y Condiciones del Servicio.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await register({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim() || undefined
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al registrar la cuenta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden font-sans bg-slate-100 text-slate-800">
      {/* Bright & Joyful Background Image across full screen */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Soft overlay blending left dark/hero text with right bright card */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-slate-100/90 md:to-white/95" />
      </div>

      {/* Main Split Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
        
        {/* LEFT COLUMN: Hero Heading & Description */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D7C84] p-0.5 shadow-lg shadow-[#0D7C84]/30">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-[#0D7C84]" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
              Vet<span className="text-[#F59E0B]">HD</span>
            </span>
          </div>

          {/* Center Callout Text */}
          <div className="my-auto py-12 max-w-lg space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
              ¿No tienes una <br />
              <span className="text-[#F59E0B]">
                cuenta?
              </span>
            </h1>
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal drop-shadow-md">
              Regístrate para acceder a todas las funciones de nuestro servicio. Gestiona la salud, vacunas e historial clínico de tus mascotas en un solo lugar. <strong className="text-[#F59E0B] font-bold">¡Es totalmente gratis!</strong>
            </p>
          </div>

          {/* Footer Copyright */}
          <div className="text-xs text-slate-300 drop-shadow-md">
            © {new Date().getFullYear()} VetHD. Sistema de Gestión Veterinaria.
          </div>
        </div>

        {/* RIGHT COLUMN: Light Mode Glassmorphic Register Form Container */}
        <div className="w-full md:w-1/2 bg-white/95 md:bg-white/90 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-slate-200/80 p-8 sm:p-12 lg:p-16 flex flex-col justify-center shadow-2xl">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Crear Cuenta
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Completa tus datos para registrarte como propietario de mascota
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 text-rose-600 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nombre Completo */}
              <UnderlineInput
                label="Nombre Completo"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos Pérez"
                icon={<User className="w-4 h-4" />}
              />

              {/* Correo Electrónico */}
              <UnderlineInput
                label="Correo Electrónico"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                icon={<Mail className="w-4 h-4" />}
              />

              {/* Contraseña */}
              <UnderlineInput
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none p-1 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Teléfono */}
              <UnderlineInput
                label="Teléfono / Celular"
                name="telefono"
                type="tel"
                required
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+51 987 654 321"
                icon={<Phone className="w-4 h-4" />}
              />

              {/* Dirección */}
              <UnderlineInput
                label="Dirección (Opcional)"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Av. Principal 123, Lima"
                icon={<MapPin className="w-4 h-4" />}
              />

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0D7C84] focus:ring-[#0D7C84]/30 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-[#0D7C84] hover:text-[#0b686f] cursor-pointer select-none">
                  Acepto los <span className="font-bold text-slate-900 underline underline-offset-2">Términos y Condiciones</span> del Servicio
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  variant="primary"
                  className="w-full sm:w-auto min-w-[170px]"
                >
                  <span>Registrarse</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Link
                  to="/login"
                  className="text-xs text-[#0D7C84] hover:text-[#0b686f] font-bold underline underline-offset-4 transition-colors"
                >
                  ¿Ya tienes una cuenta?
                </Link>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
};
